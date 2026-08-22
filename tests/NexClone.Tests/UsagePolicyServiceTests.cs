using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;
using Xunit;
using Moq;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Core.Interfaces;
using NexClone.Backend.Infrastructure.Data;
using NexClone.Backend.Hubs;

namespace NexClone.Tests
{
    public class UsagePolicyServiceTests
    {
        private ApplicationDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new ApplicationDbContext(options);
        }

        private Mock<IHubContext<NotificationHub>> GetMockHubContext()
        {
            var mockHub = new Mock<IHubContext<NotificationHub>>();
            var mockClients = new Mock<IHubClients>();
            var mockClientProxy = new Mock<IClientProxy>();
            mockClients.Setup(c => c.User(It.IsAny<string>())).Returns(mockClientProxy.Object);
            mockHub.Setup(h => h.Clients).Returns(mockClients.Object);
            return mockHub;
        }

        private UsagePolicyService CreateService(ApplicationDbContext context, ISubscriptionPermissionService? permissionService = null)
        {
            var mockHub = GetMockHubContext();
            var permService = permissionService ?? new SubscriptionPermissionService(context);
            return new UsagePolicyService(context, mockHub.Object, permService);
        }

        [Fact]
        public async Task EstimateCostAsync_UserNotFound_ReturnsError()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);

            var result = await service.EstimateCostAsync(Guid.NewGuid(), "text-to-voice", 100);

            Assert.False(result.IsAllowed);
            Assert.Contains("User not found", result.ErrorMessage);
        }

        [Fact]
        public async Task EstimateCostAsync_DisabledTool_ReturnsError()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com" });
            context.ToolConfigurations.Add(new ToolConfiguration { ToolName = "text-to-image", IsActive = false });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "text-to-image", 1);

            Assert.False(result.IsAllowed);
            Assert.Contains("disabled", result.ErrorMessage);
        }

        [Fact]
        public async Task EstimateCostAsync_FrozenFreePlan_ReturnsError()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com" });
            var freePlan = new Plan { Id = 1, PriceUsd = 0, IsFreeTrial = true, Name = "Free" };
            context.Plans.Add(freePlan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = freePlan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "text-to-voice", 100);

            Assert.False(result.IsAllowed);
            Assert.Contains("frozen", result.ErrorMessage, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task EstimateCostAsync_InsufficientCredits_ReturnsError()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 0 });
            var plan = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true };
            context.Plans.Add(plan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            context.TextToVoiceSettings.Add(new TextToVoiceSetting { Id = 1, IsActive = true, MaxTextLength = 5000, MaxConcurrentOperations = 10 });
            context.TextToVoiceModelPricings.Add(new TextToVoiceModelPricing
            {
                QualityLevel = "Standard", ModelName = "tts-standard", ProviderName = "test",
                BillingType = "PerCharacter", CostPerChar = 1.0m, BaseCost = 0, AllowedWallet = "Standard", IsActive = true
            });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "text-to-voice", 100, 100);

            Assert.False(result.IsAllowed);
            Assert.Contains("Insufficient", result.ErrorMessage);
        }

        [Fact]
        public async Task EstimateCostAsync_SufficientCredits_ReturnsAllowed()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 100 });
            var plan = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true };
            context.Plans.Add(plan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            context.TextToVoiceSettings.Add(new TextToVoiceSetting { Id = 1, IsActive = true, MaxTextLength = 5000, MaxConcurrentOperations = 10 });
            context.TextToVoiceModelPricings.Add(new TextToVoiceModelPricing
            {
                QualityLevel = "Standard", ModelName = "tts-standard", ProviderName = "test",
                BillingType = "PerCharacter", CostPerChar = 0.5m, BaseCost = 0, AllowedWallet = "Standard", IsActive = true
            });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "text-to-voice", 100, 100, "Standard");

            Assert.True(result.IsAllowed);
            Assert.Equal(50m, result.TotalCost);
            Assert.Equal(50m, result.StandardCreditsCharged);
            Assert.Equal(0m, result.PremiumCreditsCharged);
        }

        [Fact]
        public async Task EstimateCostAsync_LipSyncTool_CalculatesCorrectly()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 100 });
            var plan = new Plan { Id = 1, PriceUsd = 10, LipSyncEnabled = true };
            context.Plans.Add(plan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            context.LipSyncSettings.Add(new LipSyncSetting { Id = 1, IsActive = true, MaxVideoFileSizeMb = 100, MaxAudioFileSizeMb = 25, MaxAudioDurationSeconds = 120, MaxConcurrentOperations = 10 });
            context.LipSyncModelPricings.Add(new LipSyncModelPricing
            {
                ModelName = "vidu-lipsync-audio", ProviderName = "test",
                BillingType = "Per5Seconds", BaseCost = 12m, CostPerSecond = 2.4m,
                AllowedWallet = "Standard", IsActive = true
            });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "lipsync", 10, 10);

            Assert.True(result.IsAllowed);
            Assert.True(result.TotalCost > 0);
        }

        [Fact]
        public async Task ValidateAndChargeAsync_DeductsCreditsFromUser()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 100 });
            var plan = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true };
            context.Plans.Add(plan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            context.TextToVoiceSettings.Add(new TextToVoiceSetting { Id = 1, IsActive = true, MaxTextLength = 5000, MaxConcurrentOperations = 10 });
            context.TextToVoiceModelPricings.Add(new TextToVoiceModelPricing
            {
                QualityLevel = "Standard", ModelName = "tts-standard", ProviderName = "test",
                BillingType = "PerCharacter", CostPerChar = 0.5m, BaseCost = 0, AllowedWallet = "Standard", IsActive = true
            });
            await context.SaveChangesAsync();

            var result = await service.ValidateAndChargeAsync(userId, "text-to-voice", 100, 100);

            Assert.True(result.IsAllowed);

            var user = await context.Users.FindAsync(userId);
            Assert.Equal(50m, user!.StandardCredits);
        }

        [Fact]
        public async Task RefundAsync_RestoresCredits()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 50, PremiumCredits = 10 });
            await context.SaveChangesAsync();

            await service.RefundAsync(userId, 30, 5);

            var user = await context.Users.FindAsync(userId);
            Assert.Equal(80m, user!.StandardCredits);
            Assert.Equal(15m, user!.PremiumCredits);
        }

        [Fact]
        public async Task EstimateCostAsync_ToolNotInPlan_ReturnsError()
        {
            var context = GetInMemoryContext();
            var service = CreateService(context);
            var userId = Guid.NewGuid();

            context.Users.Add(new ApplicationUser { Id = userId, UserName = "test", Email = "test@test.com", StandardCredits = 100 });
            var plan = new Plan { Id = 1, PriceUsd = 10, MotionControlEnabled = false };
            context.Plans.Add(plan);
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(10) });
            await context.SaveChangesAsync();

            var result = await service.EstimateCostAsync(userId, "motion-control", 5);

            Assert.False(result.IsAllowed);
            Assert.Contains("not include", result.ErrorMessage);
        }
    }
}