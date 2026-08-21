using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Xunit;
using NexClone.Backend.Application.Services;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;

namespace NexClone.Tests
{
    public class SubscriptionPermissionServiceTests
    {
        private ApplicationDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_OnePaidSubscription_ReturnsPermissions()
        {
            // Arrange
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var user = new ApplicationUser { Id = userId, UserName = "test1", Email = "test1@test.com" };
            context.Users.Add(user);

            var plan = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true, AllowedVoices = "voice1, voice2" };
            context.Plans.Add(plan);

            var sub = new Subscription { UserId = user.Id, PlanId = plan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) };
            context.Subscriptions.Add(sub);

            await context.SaveChangesAsync();

            // Act
            var perms = await service.GetEffectivePermissionsAsync(userId);

            // Assert
            Assert.True(perms.HasActiveSubscription);
            Assert.False(perms.IsFrozenDueToFreePlanOnly);
            Assert.True(perms.TtsEnabled);
            Assert.Equal(2, perms.AllowedVoices.Count);
            Assert.Contains("voice1", perms.AllowedVoices);
            Assert.Contains("voice2", perms.AllowedVoices);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_TwoPaidSubscriptions_ToolsAreORed()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var plan1 = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true, SttEnabled = false };
            var plan2 = new Plan { Id = 2, PriceUsd = 20, TtsEnabled = false, SttEnabled = true };
            context.Plans.AddRange(plan1, plan2);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan1.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan2.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.True(perms.TtsEnabled);
            Assert.True(perms.SttEnabled);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_TwoSubscriptionsDifferentVoices_VoicesAreUnionedAndDeduplicated()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var plan1 = new Plan { Id = 1, PriceUsd = 10, AllowedVoices = "v1, v2, v3" };
            var plan2 = new Plan { Id = 2, PriceUsd = 20, AllowedVoices = "v3, v4" };
            context.Plans.AddRange(plan1, plan2);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan1.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan2.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.Equal(4, perms.AllowedVoices.Count);
            Assert.Contains("v1", perms.AllowedVoices);
            Assert.Contains("v2", perms.AllowedVoices);
            Assert.Contains("v3", perms.AllowedVoices);
            Assert.Contains("v4", perms.AllowedVoices);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_FreeAndPaidSubscription_IsNotFrozen()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var freePlan = new Plan { Id = 1, PriceUsd = 0, IsFreeTrial = true, Name = "Free" };
            var paidPlan = new Plan { Id = 2, PriceUsd = 20, IsFreeTrial = false, Name = "Pro" };
            context.Plans.AddRange(freePlan, paidPlan);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = freePlan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = paidPlan.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.False(perms.IsFrozenDueToFreePlanOnly);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_MultipleFreeSubscriptions_IsFrozen()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var freePlan1 = new Plan { Id = 1, PriceUsd = 0, IsFreeTrial = true, Name = "Free" };
            var freePlan2 = new Plan { Id = 2, PriceUsd = 0, IsFreeTrial = false, Name = "Basic Free" };
            context.Plans.AddRange(freePlan1, freePlan2);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = freePlan1.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = freePlan2.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.True(perms.IsFrozenDueToFreePlanOnly);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_ExpiredAndCanceledSubscriptions_AreIgnored()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var plan = new Plan { Id = 1, PriceUsd = 10, TtsEnabled = true };
            context.Plans.Add(plan);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "expired", EndDate = DateTime.UtcNow.AddDays(-1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan.Id, Status = "canceled", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.False(perms.HasActiveSubscription);
            Assert.False(perms.TtsEnabled);
        }

        [Fact]
        public async Task GetEffectivePermissionsAsync_NoActiveSubscriptions_PreservesBehavior()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.False(perms.HasActiveSubscription);
            Assert.False(perms.IsFrozenDueToFreePlanOnly);
            Assert.Empty(perms.AllowedVoices);
            Assert.False(perms.TtsEnabled);
        }
        
        [Fact]
        public async Task GetEffectivePermissionsAsync_Plan21AndPlan22_ReturnsBothVoices()
        {
            var context = GetInMemoryContext();
            var service = new SubscriptionPermissionService(context);
            var userId = Guid.NewGuid();

            var plan21 = new Plan { Id = 21, PriceUsd = 10, AllowedVoices = "صبرينة, طلال, صفاء" };
            var plan22 = new Plan { Id = 22, PriceUsd = 20, AllowedVoices = "Alia, Omar, Layla" };
            context.Plans.AddRange(plan21, plan22);

            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan21.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            context.Subscriptions.Add(new Subscription { UserId = userId, PlanId = plan22.Id, Status = "active", EndDate = DateTime.UtcNow.AddDays(1) });
            await context.SaveChangesAsync();

            var perms = await service.GetEffectivePermissionsAsync(userId);

            Assert.Equal(6, perms.AllowedVoices.Count);
            Assert.Contains("صبرينة", perms.AllowedVoices);
            Assert.Contains("Alia", perms.AllowedVoices);
        }
    }
}
