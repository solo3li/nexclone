using System;
using System.Threading.Tasks;
using Xunit;
using NexClone.Backend.Core.Entities;

namespace NexClone.Tests
{
    public class SubscriptionStatusTests
    {
        [Theory]
        [InlineData("active", SubscriptionStatus.Active)]
        [InlineData("Active", SubscriptionStatus.Active)]
        [InlineData("ACTIVE", SubscriptionStatus.Active)]
        [InlineData("freeze", SubscriptionStatus.Freeze)]
        [InlineData("Freeze", SubscriptionStatus.Freeze)]
        [InlineData("expired", SubscriptionStatus.Expired)]
        [InlineData("canceled", SubscriptionStatus.Canceled)]
        public void FromString_ParsesAllVariants(string input, SubscriptionStatus expected)
        {
            var result = SubscriptionStatusHelper.FromString(input);
            Assert.Equal(expected, result);
        }

        [Fact]
        public void FromString_NullOrEmpty_ReturnsActive()
        {
            Assert.Equal(SubscriptionStatus.Active, SubscriptionStatusHelper.FromString(null));
            Assert.Equal(SubscriptionStatus.Active, SubscriptionStatusHelper.FromString(""));
            Assert.Equal(SubscriptionStatus.Active, SubscriptionStatusHelper.FromString("   "));
        }

        [Fact]
        public void FromString_UnknownValue_ReturnsActive()
        {
            Assert.Equal(SubscriptionStatus.Active, SubscriptionStatusHelper.FromString("unknown"));
        }

        [Fact]
        public void ToDbString_ReturnsLowercase()
        {
            Assert.Equal("active", SubscriptionStatus.Active.ToDbString());
            Assert.Equal("freeze", SubscriptionStatus.Freeze.ToDbString());
            Assert.Equal("expired", SubscriptionStatus.Expired.ToDbString());
            Assert.Equal("canceled", SubscriptionStatus.Canceled.ToDbString());
        }

        [Theory]
        [InlineData(SubscriptionStatus.Active, true)]
        [InlineData(SubscriptionStatus.Freeze, true)]
        [InlineData(SubscriptionStatus.Expired, false)]
        [InlineData(SubscriptionStatus.Canceled, false)]
        public void IsUsable_ReturnsCorrectly(SubscriptionStatus status, bool expected)
        {
            Assert.Equal(expected, status.IsUsable());
        }

        [Theory]
        [InlineData(SubscriptionStatus.Active, false)]
        [InlineData(SubscriptionStatus.Freeze, false)]
        [InlineData(SubscriptionStatus.Expired, true)]
        [InlineData(SubscriptionStatus.Canceled, true)]
        public void IsEnded_ReturnsCorrectly(SubscriptionStatus status, bool expected)
        {
            Assert.Equal(expected, status.IsEnded());
        }
    }
}