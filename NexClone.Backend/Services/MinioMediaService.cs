using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using NexClone.Backend.Models;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace NexClone.Backend.Services
{
    public class MinioMediaService : IMediaService
    {
        private IMinioClient _minioClient;
        private string _defaultBucket;
        private readonly ApplicationDbContext _context;

        public MinioMediaService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _defaultBucket = "nexmedia"; // Will be overridden if set in DB
        }

        private async Task EnsureClientInitializedAsync()
        {
            if (_minioClient != null) return;

            var settings = _context.AppSettings.ToList();
            var endpoint = settings.FirstOrDefault(s => s.Key == "Minio.Endpoint")?.Value ?? "minio:9000";
            var accessKey = settings.FirstOrDefault(s => s.Key == "Minio.AccessKey")?.Value ?? "minioadmin";
            var secretKey = settings.FirstOrDefault(s => s.Key == "Minio.SecretKey")?.Value ?? "minioadmin";
            _defaultBucket = settings.FirstOrDefault(s => s.Key == "Minio.BucketName")?.Value ?? "nexmedia";

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();
        }

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;
            var objectName = $"{Guid.NewGuid()}_{file.FileName}";

            using var stream = file.OpenReadStream();
            
            return await UploadFileAsync(stream, objectName, file.ContentType, bucketName);
        }

        public async Task<string> UploadFileAsync(Stream stream, string objectName, string contentType, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;

            var bucketExistsArgs = new BucketExistsArgs().WithBucket(bucketName);
            bool found = await _minioClient.BucketExistsAsync(bucketExistsArgs).ConfigureAwait(false);
            if (!found)
            {
                var makeBucketArgs = new MakeBucketArgs().WithBucket(bucketName);
                await _minioClient.MakeBucketAsync(makeBucketArgs).ConfigureAwait(false);
            }

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(stream.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);

            return objectName;
        }

        public async Task<byte[]> DownloadFileAsync(string objectName, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;
            using var memoryStream = new MemoryStream();

            var getObjectArgs = new GetObjectArgs()
                .WithBucket(bucketName)
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
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;

            var settings = _context.AppSettings.ToList();
            var publicEndpoint = settings.FirstOrDefault(s => s.Key == "Minio.PublicEndpoint")?.Value ?? "178.62.192.74:9000";

            // Return direct URL since nexmedia bucket is public
            return $"http://{publicEndpoint}/{bucketName}/{objectName}";
        }

        public async Task<string> GeneratePresignedUploadUrlAsync(string objectName, string contentType, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;

            var settings = _context.AppSettings.ToList();
            var publicEndpoint = settings.FirstOrDefault(s => s.Key == "Minio.PublicEndpoint")?.Value ?? "178.62.192.74:9000";
            var accessKey = settings.FirstOrDefault(s => s.Key == "Minio.AccessKey")?.Value ?? "minioadmin";
            var secretKey = settings.FirstOrDefault(s => s.Key == "Minio.SecretKey")?.Value ?? "minioadmin";

            var publicClient = new MinioClient()
                .WithEndpoint(publicEndpoint)
                .WithCredentials(accessKey, secretKey)
                .Build();

            var presignedPutObjectArgs = new PresignedPutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(60 * 60); // 1 hour expiry

            return await publicClient.PresignedPutObjectAsync(presignedPutObjectArgs).ConfigureAwait(false);
        }
    }
}
