using Moq;
using Moq.Protected;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Models;
using NexClone.Backend.Services.AI;
using System.Net;
using System.Text.Json;
using Xunit;

namespace NexClone.Backend.Tests
{
    public class SttServiceTests
    {
        private ApplicationDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            var dbContext = new ApplicationDbContext(options);

            // Add dummy OpenAI Config
            dbContext.ApiConfigurations.Add(new ApiConfiguration
            {
                ProviderName = "OpenAI",
                ApiKey = "sk-test-key",
                IsActive = true
            });
            dbContext.SaveChanges();

            return dbContext;
        }

        [Fact]
        public async Task TranscribeAudioAsync_WithTranslateFalse_ReturnsOriginalTextOnly()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            handlerMock
               .Protected()
               // Setup the PROTECTED method to mock
               .Setup<Task<HttpResponseMessage>>(
                  "SendAsync",
                  ItExpr.IsAny<HttpRequestMessage>(),
                  ItExpr.IsAny<CancellationToken>()
               )
               // prepare the expected response of the mocked http call
               .ReturnsAsync(new HttpResponseMessage()
               {
                   StatusCode = HttpStatusCode.OK,
                   Content = new StringContent("Hello this is original transcribed text")
               })
               .Verifiable();

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var service = new SttService(dbContext, httpClientFactoryMock.Object);

            // Act
            var result = await service.TranscribeAudioAsync(new byte[] { 1, 2, 3 }, "test.mp3", "audio/mpeg", false, "ar");

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Hello this is original transcribed text", result.OriginalText);
            Assert.Null(result.TranslatedText);
            
            // Verify that SendAsync was called exactly once (for Whisper API)
            handlerMock.Protected().Verify("SendAsync", Times.Exactly(1), ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>());
        }

        [Fact]
        public async Task TranscribeAudioAsync_WithTranslateTrue_CallsTranslateApi()
        {
            // Arrange
            var dbContext = GetInMemoryDbContext();
            
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            
            // Setup two sequential responses: First for Whisper (text), Second for ChatGPT (JSON)
            var translationResponse = new
            {
                choices = new[]
                {
                    new { message = new { content = "مرحبا، هذا نص مترجم" } }
                }
            };

            handlerMock.Protected()
                .SetupSequence<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("Hello this is original transcribed text") // First call Whisper
                })
                .ReturnsAsync(new HttpResponseMessage()
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(JsonSerializer.Serialize(translationResponse)) // Second call Translate
                });

            var httpClient = new HttpClient(handlerMock.Object);
            var httpClientFactoryMock = new Mock<IHttpClientFactory>();
            httpClientFactoryMock.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(httpClient);

            var service = new SttService(dbContext, httpClientFactoryMock.Object);

            // Act
            var result = await service.TranscribeAudioAsync(new byte[] { 1, 2, 3 }, "test.mp3", "audio/mpeg", true, "ar");

            // Assert
            Assert.True(result.Success);
            Assert.Equal("Hello this is original transcribed text", result.OriginalText);
            Assert.Equal("مرحبا، هذا نص مترجم", result.TranslatedText);
            Assert.Equal("ar", result.TargetLanguage);

            // Verify that SendAsync was called exactly twice (Whisper + Chat API)
            handlerMock.Protected().Verify("SendAsync", Times.Exactly(2), ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>());
        }
    }
}
