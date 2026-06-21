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

            // AWS S3 Configuration
            var endpoint = "s3.eu-north-1.amazonaws.com";
            var accessKey = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID") ?? "YOUR_AWS_ACCESS_KEY";
            var secretKey = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY") ?? "YOUR_AWS_SECRET_KEY";
            var region = "eu-north-1";
            _defaultBucket = "nexmedia-files-2026";

            _minioClient = new MinioClient()
                .WithEndpoint(endpoint)
                .WithCredentials(accessKey, secretKey)
                .WithRegion(region)
                .WithSSL(true)
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

            // AWS S3 Virtual-Hosted Style URL
            var publicEndpoint = $"{bucketName}.s3.eu-north-1.amazonaws.com";
            
            return $"https://{publicEndpoint}/{objectName}";
        }

        public async Task<string> GeneratePresignedUploadUrlAsync(string objectName, string contentType, string bucketName = null)
        {
            await EnsureClientInitializedAsync();
            bucketName ??= _defaultBucket;

            var presignedPutObjectArgs = new PresignedPutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(60 * 60); // 1 hour expiry

            return await _minioClient.PresignedPutObjectAsync(presignedPutObjectArgs).ConfigureAwait(false);
        }
    }
}
