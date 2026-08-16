using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Core.Entities;

namespace NexClone.Backend
{
    public static class DbSeeder
    {
        public static async Task SeedTtsDataAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // Seed Dialects
            if (!await context.Dialects.AnyAsync())
            {
                context.Dialects.AddRange(
                    new Dialect { Name = "مصري", Value = "Egyptian", IsActive = true, Order = 1 },
                    new Dialect { Name = "سعودي", Value = "Saudi", IsActive = true, Order = 2 },
                    new Dialect { Name = "إماراتي", Value = "Emirati", IsActive = true, Order = 3 },
                    new Dialect { Name = "كويتي", Value = "Kuwaiti", IsActive = true, Order = 4 },
                    new Dialect { Name = "سوري", Value = "Syrian", IsActive = true, Order = 5 },
                    new Dialect { Name = "عراقي", Value = "Iraqi", IsActive = true, Order = 6 },
                    new Dialect { Name = "أردني", Value = "Jordanian", IsActive = true, Order = 7 }
                );
            }

            // Seed Emotions
            if (!await context.Emotions.AnyAsync())
            {
                context.Emotions.AddRange(
                    new Emotion { Name = "سعيد", Value = "Happy", IsActive = true, Order = 1 },
                    new Emotion { Name = "حزين", Value = "Sad", IsActive = true, Order = 2 },
                    new Emotion { Name = "غاضب", Value = "Angry", IsActive = true, Order = 3 },
                    new Emotion { Name = "هادئ", Value = "Calm", IsActive = true, Order = 4 },
                    new Emotion { Name = "متحمس", Value = "Excited", IsActive = true, Order = 5 },
                    new Emotion { Name = "احترافي", Value = "Professional", IsActive = true, Order = 6 },
                    new Emotion { Name = "ودود", Value = "Friendly", IsActive = true, Order = 7 }
                );
            }

            // Seed Styles
            if (!await context.Styles.AnyAsync())
            {
                context.Styles.AddRange(
                    new Style { Name = "إخباري", Value = "News", IsActive = true, Order = 1 },
                    new Style { Name = "وثائقي", Value = "Documentary", IsActive = true, Order = 2 },
                    new Style { Name = "إعلاني", Value = "Commercial", IsActive = true, Order = 3 },
                    new Style { Name = "رواية قصص", Value = "Storytelling", IsActive = true, Order = 4 }
                );
            }

            // Seed some generic Voices if none exist
            if (!await context.Voices.AnyAsync())
            {
                context.Voices.AddRange(
                    new Voice { Name = "عالية", VoiceName = "Alia", Gender = "Female", Accent = "Neutral", IsPremium = false, IsActive = true, Order = 1, GeminiVoice = "Aoede" },
                    new Voice { Name = "عمر", VoiceName = "Omar", Gender = "Male", Accent = "Neutral", IsPremium = false, IsActive = true, Order = 2, GeminiVoice = "Charon" },
                    new Voice { Name = "ليلى", VoiceName = "Layla", Gender = "Female", Accent = "Neutral", IsPremium = true, IsActive = true, Order = 3, GeminiVoice = "Kore" },
                    new Voice { Name = "طارق", VoiceName = "Tariq", Gender = "Male", Accent = "Neutral", IsPremium = true, IsActive = true, Order = 4, GeminiVoice = "Fenrir" },
                    new Voice { Name = "زينة", VoiceName = "Zeina", Gender = "Female", Accent = "Neutral", IsPremium = false, IsActive = true, Order = 5, GeminiVoice = "Aoede" },
                    new Voice { Name = "فارس", VoiceName = "Fares", Gender = "Male", Accent = "Neutral", IsPremium = false, IsActive = true, Order = 6, GeminiVoice = "Puck" }
                );
            }

            await context.SaveChangesAsync();
        }

        public static async Task SeedToolTablesAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            // 1. Avatar to Video
            if (!await context.AvatarToVideoSettings.AnyAsync())
            {
                context.AvatarToVideoSettings.Add(new AvatarToVideoSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxImageFileSizeMb = 15,
                    MaxAudioFileSizeMb = 15,
                    MaxPromptLength = 500,
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.AvatarToVideoModelPricings.AnyAsync())
            {
                context.AvatarToVideoModelPricings.Add(new AvatarToVideoModelPricing
                {
                    ModelName = "kling_avatar_image2video",
                    ProviderName = "Picsart",
                    BillingType = "PerRequest",
                    UnitCost = 10.0m,
                    BaseCost = 0m,
                    AllowedWallet = "Standard",
                    IsActive = true
                });
            }

            // 2. Text to Video
            if (!await context.TextToVideoSettings.AnyAsync())
            {
                context.TextToVideoSettings.Add(new TextToVideoSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxPromptLength = 5000,
                    MaxDurationSeconds = 20,
                    DefaultResolution = "720p",
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.TextToVideoModelPricings.AnyAsync())
            {
                context.TextToVideoModelPricings.AddRange(
                    new TextToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Fast",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 30.0m,
                        FixedCost_1080p = 37.5m,
                        FixedCost_4k = 90.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new TextToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Lite",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 15.0m,
                        FixedCost_1080p = 22.5m,
                        FixedCost_4k = 75.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new TextToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Quality",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 225.0m,
                        FixedCost_1080p = 232.5m,
                        FixedCost_4k = 285.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new TextToVideoModelPricing
                    {
                        ModelName = "grok-imagine",
                        ProviderName = "CrunAI",
                        BillingType = "PerSecond",
                        CostPerSecond_480p = 2.4m,
                        CostPerSecond_720p = 4.5m,
                        CostPerSecond_1080p = 8.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    }
                );
            }

            // 3. Image to Video / Reference to Video
            if (!await context.ImageToVideoSettings.AnyAsync())
            {
                context.ImageToVideoSettings.Add(new ImageToVideoSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxImageFileSizeMb = 25,
                    MaxDurationSeconds = 20,
                    MaxPromptLength = 5000,
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.ImageToVideoModelPricings.AnyAsync())
            {
                context.ImageToVideoModelPricings.AddRange(
                    new ImageToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Fast",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 30.0m,
                        FixedCost_1080p = 37.5m,
                        FixedCost_4k = 90.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new ImageToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Lite",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 15.0m,
                        FixedCost_1080p = 22.5m,
                        FixedCost_4k = 75.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new ImageToVideoModelPricing
                    {
                        ModelName = "veo 3.1 Quality",
                        ProviderName = "CrunAI",
                        BillingType = "PerRequest",
                        FixedCost_720p = 225.0m,
                        FixedCost_1080p = 232.5m,
                        FixedCost_4k = 285.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    },
                    new ImageToVideoModelPricing
                    {
                        ModelName = "grok-imagine",
                        ProviderName = "CrunAI",
                        BillingType = "PerSecond",
                        CostPerSecond_480p = 2.4m,
                        CostPerSecond_720p = 4.5m,
                        CostPerSecond_1080p = 8.0m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    }
                );
            }

            // 4. LipSync
            if (!await context.LipSyncSettings.AnyAsync())
            {
                context.LipSyncSettings.Add(new LipSyncSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxVideoFileSizeMb = 100,
                    MaxAudioFileSizeMb = 25,
                    MaxAudioDurationSeconds = 120,
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.LipSyncModelPricings.AnyAsync())
            {
                context.LipSyncModelPricings.Add(
                    new LipSyncModelPricing
                    {
                        ModelName = "vidu-lipsync-audio",
                        ProviderName = "CrunAI",
                        BillingType = "Per5Seconds",
                        BaseCost = 12.0m,
                        CostPerSecond = 2.4m,
                        AllowedWallet = "Standard",
                        IsActive = true
                    }
                );
            }

            // 5. Text to Image
            if (!await context.TextToImageSettings.AnyAsync())
            {
                context.TextToImageSettings.Add(new TextToImageSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxPromptLength = 5000,
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.TextToImageModelPricings.AnyAsync())
            {
                context.TextToImageModelPricings.Add(new TextToImageModelPricing
                {
                    ModelName = "grok-imagine",
                    ProviderName = "CrunAI",
                    BillingType = "PerRequest",
                    CostPerImage = 4.0m,
                    BaseCost = 0m,
                    AllowedWallet = "Standard",
                    IsActive = true
                });
            }

            // 6. Motion Control
            if (!await context.MotionControlSettings.AnyAsync())
            {
                context.MotionControlSettings.Add(new MotionControlSetting
                {
                    Id = 1,
                    IsActive = true,
                    MaxVideoFileSizeMb = 100,
                    MaxImageFileSizeMb = 25,
                    MaxDurationSeconds = 30,
                    MaxConcurrentOperations = 10
                });
            }

            if (!await context.MotionControlModelPricings.AnyAsync())
            {
                context.MotionControlModelPricings.Add(new MotionControlModelPricing
                {
                    ModelName = "default",
                    ProviderName = "CrunAI",
                    BillingType = "PerSecond",
                    CostPerSecond = 2.0m,
                    BaseCost = 0m,
                    AllowedWallet = "Standard",
                    IsActive = true
                });
            }

            await context.SaveChangesAsync();
        }
    }
}
