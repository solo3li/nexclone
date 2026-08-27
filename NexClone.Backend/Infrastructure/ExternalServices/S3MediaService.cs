using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Infrastructure.ExternalServices
{
    public class S3MediaService : IMediaService
    {
        private static DateTime _lastFetched = DateTime.MinValue;
        private static System.Collections.Generic.List<NexClone.Backend.Core.Entities.AppSetting> _cachedSettings;
        private static readonly System.Threading.SemaphoreSlim _semaphore = new System.Threading.SemaphoreSlim(1, 1);
        private static readonly TimeSpan _cacheTtl = TimeSpan.FromMinutes(1); // 1 min so admin panel changes apply quickly

        private IMinioClient _minioClient;
        private IMinioClient _publicMinioClient;
        private string _defaultBucket;
        private string _region;
        private string _endpoint;
        private string _publicEndpoint;
        private bool _useSsl;
        private bool _publicUseSsl;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public S3MediaService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
            _defaultBucket = "nexmedia"; // Will be overridden if set in DB
        }

        private async Task EnsureClientInitializedAsync()
        {
            // Re-initialize when cache expires so admin panel changes take effect
            bool cacheExpired = DateTime.UtcNow - _lastFetched > _cacheTtl;
            if (_minioClient != null && !cacheExpired) return;

            System.Collections.Generic.List<NexClone.Backend.Core.Entities.AppSetting> appSettings;
            if (cacheExpired)
            {
                await _semaphore.WaitAsync();
                try
                {
                    if (DateTime.UtcNow - _lastFetched > _cacheTtl)
                    {
                        _cachedSettings = await _context.AppSettings.AsNoTracking().ToListAsync();
                        _lastFetched = DateTime.UtcNow;
                        // Force client rebuild so new settings are applied
                        _minioClient = null;
                        _publicMinioClient = null;
                    }
                }
                finally
                {
                    _semaphore.Release();
                }
            }

            if (_minioClient != null) return; // Already rebuilt by another thread

            appSettings = _cachedSettings ?? new System.Collections.Generic.List<NexClone.Backend.Core.Entities.AppSetting>();

            // -----------------------------------------------------------------------
            // Priority: DB AppSettings (Admin Panel) > Environment Variables > Default
            // -----------------------------------------------------------------------
            var dbEndpoint      = appSettings.FirstOrDefault(s => s.Key == "S3.Endpoint")?.Value;
            var dbAccessKey     = appSettings.FirstOrDefault(s => s.Key == "S3.AccessKey")?.Value;
            var dbSecretKey     = appSettings.FirstOrDefault(s => s.Key == "S3.SecretKey")?.Value;
            var dbRegion        = appSettings.FirstOrDefault(s => s.Key == "S3.Region")?.Value;
            var dbBucketName    = appSettings.FirstOrDefault(s => s.Key == "S3.BucketName")?.Value;
            var dbUseSSL        = appSettings.FirstOrDefault(s => s.Key == "S3.UseSSL")?.Value;
            var dbPublicEndpoint = appSettings.FirstOrDefault(s => s.Key == "S3.PublicEndpoint")?.Value;
            var dbPublicUseSSL  = appSettings.FirstOrDefault(s => s.Key == "S3.PublicUseSSL")?.Value;

            var envEndpoint  = _configuration["S3_ENDPOINT"]         ?? _configuration["Minio:Endpoint"];
            var envRegion    = _configuration["S3_REGION"]            ?? _configuration["Minio:Region"];
            var envBucketName = _configuration["S3_BUCKET_NAME"]     ?? _configuration["Minio:BucketName"];
            var envAccessKey = _configuration["AWS_ACCESS_KEY_ID"]    ?? _configuration["Minio:AccessKey"];
            var envSecretKey = _configuration["AWS_SECRET_ACCESS_KEY"] ?? _configuration["Minio:SecretKey"];
            var envUseSsl    = _configuration["S3_USE_SSL"]            ?? _configuration["Minio:UseSSL"];
            var envPublicEndpoint = _configuration["MINIO_PUBLIC_ENDPOINT"] ?? _configuration["Minio:PublicEndpoint"];
            var envPublicUseSSL   = _configuration["Minio:PublicUseSSL"];

            // DB wins if set; fall back to env; fall back to hard-coded default
            var endpoint  = !string.IsNullOrWhiteSpace(dbEndpoint)   ? dbEndpoint
                          : !string.IsNullOrWhiteSpace(envEndpoint)   ? envEndpoint
                          : "s3.eu-north-1.amazonaws.com";

            var accessKey = !string.IsNullOrWhiteSpace(dbAccessKey)  ? dbAccessKey
                          : !string.IsNullOrWhiteSpace(envAccessKey)  ? envAccessKey
                          : "YOUR_AWS_ACCESS_KEY";

            var secretKey = !string.IsNullOrWhiteSpace(dbSecretKey)  ? dbSecretKey
                          : !string.IsNullOrWhiteSpace(envSecretKey)  ? envSecretKey
                          : "YOUR_AWS_SECRET_KEY";

            var region    = !string.IsNullOrWhiteSpace(dbRegion)     ? dbRegion
                          : !string.IsNullOrWhiteSpace(envRegion)     ? envRegion
                          : "eu-north-1";

            _region   = region;
            _endpoint = endpoint;

            _defaultBucket = !string.IsNullOrWhiteSpace(dbBucketName)  ? dbBucketName
                           : !string.IsNullOrWhiteSpace(envBucketName)  ? envBucketName
                           : "nexmedia-ai-files";

            // UseSSL: DB > env > default true
            var useSslRaw = !string.IsNullOrWhiteSpace(dbUseSSL) ? dbUseSSL : envUseSsl;
            bool useSsl   = string.IsNullOrWhiteSpace(useSslRaw) || useSslRaw.ToLower() == "true";
            _useSsl = useSsl;

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .WithRegion(region)
                .WithSSL(useSsl)
                .Build();

            // Public endpoint for direct URL generation (DB > env)
            var publicEndpoint = !string.IsNullOrWhiteSpace(dbPublicEndpoint) ? dbPublicEndpoint : envPublicEndpoint;
            if (!string.IsNullOrWhiteSpace(publicEndpoint))
            {
                var publicUseSslRaw = !string.IsNullOrWhiteSpace(dbPublicUseSSL) ? dbPublicUseSSL : envPublicUseSSL;
                bool publicUseSsl   = string.IsNullOrWhiteSpace(publicUseSslRaw) ? useSsl : publicUseSslRaw.ToLower() == "true";
                _publicEndpoint = publicEndpoint;
                _publicUseSsl   = publicUseSsl;

                _publicMinioClient = new MinioClient()
                    .WithEndpoint(publicEndpoint)
                    .WithCredentials(accessKey, secretKey)
                    .WithRegion(region)
                    .WithSSL(publicUseSsl)
                    .Build();
            }
            else
            {
                _publicEndpoint    = null;
                _publicMinioClient = null;
            }
        }

        // Sets a public-read bucket policy so objects can be fetched by external services (e.g. Crun AI) without auth.
        private async Task EnsureBucketPublicReadAsync()
        {
            try
            {
                var policyJson = $@"{{
    ""Version"": ""2012-10-17"",
    ""Statement"": [
        {{
            ""Effect"": ""Allow"",
            ""Principal"": {{""AWS"": [""*\""]}},
            ""Action"": [""s3:GetBucketLocation"", ""s3:GetObject""],
            ""Resource"": [""arn:aws:s3:::{_defaultBucket}/*""]
        }}
    ]
}}";
                var setPolicyArgs = new SetPolicyArgs()
                    .WithBucket(_defaultBucket)
                    .WithPolicy(policyJson);
                await _minioClient.SetPolicyAsync(setPolicyArgs).ConfigureAwait(false);
                Console.WriteLine($"[S3MediaService] Bucket '{_defaultBucket}' set to public-read.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[S3MediaService] Could not set public-read policy on bucket '{_defaultBucket}': {ex.Message}");
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            var objectName = $"{Guid.NewGuid()}_{file.FileName}";

            using var stream = file.OpenReadStream();
            
            return await UploadFileAsync(stream, objectName, file.ContentType, bucketName);
        }

        public async Task<string> UploadFileAsync(Stream stream, string objectName, string contentType, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            
            // Read stream into memory first to ensure we have length
            using var memStream = new MemoryStream();
            await stream.CopyToAsync(memStream);
            memStream.Position = 0;

            try
            {
                var bucketExistsArgs = new BucketExistsArgs().WithBucket(_defaultBucket);
                bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
                if (!found)
                {
                    var makeBucketArgs = new MakeBucketArgs().WithBucket(_defaultBucket).WithLocation(_region);
                    await _minioClient.MakeBucketAsync(makeBucketArgs).ConfigureAwait(false);
                    // Make bucket public-read immediately so external services can access files
                    await EnsureBucketPublicReadAsync().ConfigureAwait(false);
                }
                else
                {
                    // Ensure policy is applied even on existing buckets (idempotent)
                    await EnsureBucketPublicReadAsync().ConfigureAwait(false);
                }

                var putObjectArgs = new PutObjectArgs()
                    .WithBucket(_defaultBucket)
                    .WithObject(objectName)
                    .WithStreamData(memStream)
                    .WithObjectSize(memStream.Length)
                    .WithContentType(contentType);

                await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);

                return objectName;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[S3MediaService] Upload failed for '{objectName}': {ex.Message}");
                
                throw; // No local fallback allowed as per requirements.
            }
        }

        public async Task<byte[]> DownloadFileAsync(string objectName, string bucketName = null)
        {
            // Local storage logic removed.

            await EnsureClientInitializedAsync();
            using var memoryStream = new MemoryStream();

            var getObjectArgs = new GetObjectArgs()
                .WithBucket(_defaultBucket)
                .WithObject(objectName)
                .WithCallbackStream(stream =>
                {
                    stream.CopyTo(memoryStream);
                });

            await _minioClient.GetObjectAsync(getObjectArgs).ConfigureAwait(false);

            return memoryStream.ToArray();
        }

        public async Task<string> GetFileUrlAsync(string objectName, string bucketName = null)
        {
            if (objectName.StartsWith("http://") || objectName.StartsWith("https://")) return objectName;

            await EnsureClientInitializedAsync();

            // If a public endpoint is configured, return a direct public URL.
            // This avoids HMAC signature host-mismatch issues (e.g. when using ngrok)
            // and ensures external services like Crun AI can access files without auth.
            if (_publicMinioClient != null && !string.IsNullOrWhiteSpace(_publicEndpoint))
            {
                var scheme = _publicUseSsl ? "https" : "http";
                return $"{scheme}://{_publicEndpoint}/{_defaultBucket}/{objectName}";
            }

            // For cloud S3-compatible providers (Railway, AWS, R2 etc.) — return direct URL
            // because bucket is set to public-read
            if (!_endpoint.Contains("127.0.0.1") && !_endpoint.Contains("localhost") && !_endpoint.Contains("minio"))
            {
                var scheme = _useSsl ? "https" : "http";
                // AWS style: bucket.s3.region.amazonaws.com
                if (_endpoint.Contains("amazonaws.com"))
                    return $"{scheme}://{_defaultBucket}.s3.{_region}.amazonaws.com/{objectName}";
                // Path style (Railway, R2, etc.)
                return $"{scheme}://{_endpoint}/{_defaultBucket}/{objectName}";
            }

            // Fallback: presigned URL (for local MinIO without a public endpoint configured)
            try
            {
                var presignedGetObjectArgs = new PresignedGetObjectArgs()
                    .WithBucket(_defaultBucket)
                    .WithObject(objectName)
                    .WithExpiry(60 * 60 * 24 * 7); // 7 days expiry

                return await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[S3MediaService] Error generating presigned URL for {objectName}: {ex.Message}");
                return $"http://{_endpoint}/{_defaultBucket}/{objectName}";
            }
        }

        public async Task<string> GeneratePresignedUploadUrlAsync(string objectName, string contentType, string bucketName = null)
        {
            await EnsureClientInitializedAsync();

            string actualObjectName = string.IsNullOrWhiteSpace(bucketName) || bucketName == _defaultBucket ? objectName : $"{bucketName}/{objectName}";

            var presignedPutObjectArgs = new PresignedPutObjectArgs()
                .WithBucket(_defaultBucket)
                .WithObject(actualObjectName)
                .WithExpiry(60 * 60); // 1 hour expiry

            string url;
            if (_publicMinioClient != null)
            {
                url = await _publicMinioClient.PresignedPutObjectAsync(presignedPutObjectArgs).ConfigureAwait(false);
            }
            else
            {
                url = await _minioClient.PresignedPutObjectAsync(presignedPutObjectArgs).ConfigureAwait(false);
            }
            
            return url;
        }

        public async Task DeleteFileAsync(string objectName, string bucketName = null)
        {
            if (string.IsNullOrWhiteSpace(objectName)) return;

            // Handle URL inputs, extract just the object name if it's a full URL
            if (objectName.StartsWith("http://") || objectName.StartsWith("https://"))
            {
                try
                {
                    var uri = new Uri(objectName);
                    // Usually path is /bucket-name/object-name OR just /object-name if bucket is in host
                    // A simple fallback is to just take the last segment if it's a flat structure
                    var segments = uri.AbsolutePath.Split('/', StringSplitOptions.RemoveEmptyEntries);
                    if (segments.Length > 0)
                    {
                        objectName = segments.Last();
                    }
                }
                catch
                {
                    return; // Ignore parse errors
                }
            }

            await EnsureClientInitializedAsync();
            
            try
            {
                var removeObjectArgs = new RemoveObjectArgs()
                    .WithBucket(string.IsNullOrWhiteSpace(bucketName) ? _defaultBucket : bucketName)
                    .WithObject(objectName);
                
                await _minioClient.RemoveObjectAsync(removeObjectArgs).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[S3MediaService] Error deleting file {objectName}: {ex.Message}");
            }
        }
    }
}
