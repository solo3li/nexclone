using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Minio;
using Minio.DataModel.Args;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NexClone.Backend.Services
{
    public class MinioMediaService : IMediaService
    {
        private readonly IMinioClient _minioClient;
        private readonly string _defaultBucket;

        public MinioMediaService(IMinioClient minioClient, IConfiguration configuration)
        {
            _minioClient = minioClient;
            _defaultBucket = configuration["Minio:BucketName"] ?? "nexmedia";
        }

        public async Task<string> UploadFileAsync(IFormFile file, string bucketName = null)
        {
            bucketName ??= _defaultBucket;
            var objectName = $"{Guid.NewGuid()}_{file.FileName}";

            using var stream = file.OpenReadStream();
            
            return await UploadFileAsync(stream, objectName, file.ContentType, bucketName);
        }

        public async Task<string> UploadFileAsync(Stream stream, string objectName, string contentType, string bucketName = null)
        {
            bucketName ??= _defaultBucket;

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
            bucketName ??= _defaultBucket;

            var presignedGetObjectArgs = new PresignedGetObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(60 * 60 * 24 * 7); // 7 days (maximum allowed by AWS/MinIO SigV4)

            return await _minioClient.PresignedGetObjectAsync(presignedGetObjectArgs).ConfigureAwait(false);
        }

        public async Task<string> GeneratePresignedUploadUrlAsync(string objectName, string contentType, string bucketName = null)
        {
            bucketName ??= _defaultBucket;

            var presignedPutObjectArgs = new PresignedPutObjectArgs()
                .WithBucket(bucketName)
                .WithObject(objectName)
                .WithExpiry(60 * 60); // 1 hour expiry

            return await _minioClient.PresignedPutObjectAsync(presignedPutObjectArgs).ConfigureAwait(false);
        }
    }
}
