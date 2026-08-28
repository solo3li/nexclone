using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NexClone.Backend.Core.Entities;
using System.Linq;
using System.Collections.Generic;

namespace NexClone.Backend
{
    public static class DbSeeder
    {
        public static async Task SeedAllAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var configuration = scope.ServiceProvider.GetRequiredService<Microsoft.Extensions.Configuration.IConfiguration>();

            await SeedAppSettingsAsync(dbContext);
            await SeedApiConfigsAsync(dbContext, configuration);
            await SeedToolConfigsAsync(dbContext);
            await SeedToolTablesAsync(serviceProvider);
            await SeedLegacyUsersAsync(dbContext);
            await SeedAdminUserAsync(serviceProvider);
        }

        private static async Task SeedAppSettingsAsync(ApplicationDbContext dbContext)
        {
            var defaultSettings = new List<AppSetting>
            {
                new AppSetting { Key = "Site.MaintenanceMode", Value = "false", Description = "Global maintenance mode toggle (true/false)" },
                new AppSetting { Key = "Site.MaintenanceEndDate", Value = "", Description = "Optional end date for maintenance (ISO 8601 string)" },
                new AppSetting { Key = "Origin.AllowedOrigins", Value = "http://localhost:3000,http://localhost:3001,http://167.71.66.188:3000,http://178.62.192.74:3000,https://nexclone.com", Description = "Comma-separated list of allowed origins for CORS" },
                new AppSetting { Key = "Affiliate.CreditRewardReferrer", Value = "50", Description = "Credits given to the referrer" },
                new AppSetting { Key = "Affiliate.CreditRewardReferred", Value = "50", Description = "Credits given to the referred user" },
                new AppSetting { Key = "Affiliate.CashCommissionPercentage", Value = "20", Description = "Percentage of cash commission for affiliates (0-100)" }
            };

            foreach (var setting in defaultSettings)
            {
                if (!await dbContext.AppSettings.AnyAsync(s => s.Key == setting.Key))
                {
                    dbContext.AppSettings.Add(setting);
                }
            }

            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedApiConfigsAsync(ApplicationDbContext dbContext, Microsoft.Extensions.Configuration.IConfiguration configuration)
        {
            var defaultApiConfigs = new[] { "CrunAI" };
            foreach (var provider in defaultApiConfigs)
            {
                if (!await dbContext.ApiConfigurations.AnyAsync(c => c.ProviderName == provider))
                {
                    dbContext.ApiConfigurations.Add(new ApiConfiguration
                    {
                        ProviderName = provider,
                        IsActive = true,
                        ApiKey = provider == "CrunAI" ? (configuration["ApiKeys:CrunAI"] ?? "") : ""
                    });
                }
            }
            await dbContext.SaveChangesAsync();
        }

        private static async Task SeedToolConfigsAsync(ApplicationDbContext dbContext)
        {
            var toolsToSeed = new[] { "kling_avatar_image2video", "vidu_advanced_lip_sync", "advanced-lip-sync", "lip-sync", "lipsync" };
            foreach (var tool in toolsToSeed)
            {
                var existingConfig = await dbContext.ToolConfigurations.Include(t => t.RoutingRules).FirstOrDefaultAsync(t => t.ToolName == tool);
                if (existingConfig == null)
                {
                    var config = new ToolConfiguration
                    {
                        ToolName = tool,
                        IsActive = true,
                        RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = (tool == "kling_avatar_image2video") ? "Picsart" : "CrunAI",
                                ModelName = (tool == "kling_avatar_image2video") ? "kling-v1" : "vidu/lip-sync",
                                QualityLevel = "Standard"
                            }
                        }
                    };
                    dbContext.ToolConfigurations.Add(config);
                }
                else if (!existingConfig.RoutingRules.Any())
                {
                    existingConfig.RoutingRules.Add(new ToolRoutingRule
                    {
                        ProviderName = (tool == "kling_avatar_image2video") ? "Picsart" : "CrunAI",
                        ModelName = (tool == "kling_avatar_image2video") ? "kling-v1" : "vidu/lip-sync",
                        QualityLevel = "Standard"
                    });
                }
            }
            await dbContext.SaveChangesAsync();

            var newToolsToSeed = new[] { "text-to-video", "image-to-video", "reference-to-video", "text-to-image" };
            var defaultJsonConfig = "{ \"grok\": { \"IsPerSecond\": true, \"BaseCost\": 0, \"CostPerSecond\": { \"default\": 2.0, \"480p\": 2.4, \"720p\": 4.5, \"1080p\": 8.0 } }, \"veo\": { \"IsPerSecond\": false, \"FixedCost\": { \"default\": 30, \"720p\": 30, \"1080p\": 37.5, \"4k\": 90 } } }";

            foreach (var tool in newToolsToSeed)
            {
                if (!await dbContext.ToolConfigurations.AnyAsync(t => t.ToolName == tool))
                {
                    var config = new ToolConfiguration
                    {
                        ToolName = tool,
                        IsActive = true,
                        AllowPremiumCredits = true,
                        AllowStandardCredits = true,
                        AdditionalSettings = defaultJsonConfig,
                        RoutingRules = new List<ToolRoutingRule>
                        {
                            new ToolRoutingRule
                            {
                                ProviderName = "CrunAI",
                                ModelName = "default",
                                QualityLevel = "Standard"
                            }
                        }
                    };
                    dbContext.ToolConfigurations.Add(config);
                }
            }
            await dbContext.SaveChangesAsync();
        }

        public static async Task SeedToolTablesAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await context.Database.ExecuteSqlRawAsync(@"
                CREATE TABLE IF NOT EXISTS ""VoiceToTextSettings"" (
                    ""Id"" integer NOT NULL PRIMARY KEY,
                    ""IsActive"" boolean NOT NULL,
                    ""MaxAudioFileSizeMb"" bigint NOT NULL,
                    ""MaxAudioDurationMinutes"" integer NOT NULL,
                    ""MaxConcurrentOperations"" integer NOT NULL,
                    ""UpdatedAt"" timestamp with time zone NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""VoiceToTextModelPricings"" (
                    ""Id"" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    ""ModelName"" character varying(100) NOT NULL,
                    ""ProviderName"" character varying(100) NOT NULL,
                    ""BillingType"" character varying(50) NULL,
                    ""CostPerMinute"" numeric NOT NULL,
                    ""CostPerSecond"" numeric NOT NULL,
                    ""BaseCost"" numeric NOT NULL,
                    ""AllowedWallet"" character varying(50) NULL,
                    ""IsActive"" boolean NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""TextToVoiceSettings"" (
                    ""Id"" integer NOT NULL PRIMARY KEY,
                    ""IsActive"" boolean NOT NULL,
                    ""MaxTextLength"" integer NOT NULL,
                    ""MaxConcurrentOperations"" integer NOT NULL,
                    ""UpdatedAt"" timestamp with time zone NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""TextToVoiceModelPricings"" (
                    ""Id"" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    ""QualityLevel"" character varying(50) NOT NULL,
                    ""ModelName"" character varying(100) NOT NULL,
                    ""ProviderName"" character varying(100) NOT NULL,
                    ""BillingType"" character varying(50) NULL,
                    ""CostPerChar"" numeric NOT NULL,
                    ""BaseCost"" numeric NOT NULL,
                    ""AllowedWallet"" character varying(50) NULL,
                    ""IsActive"" boolean NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""MotionControlSettings"" (
                    ""Id"" integer NOT NULL PRIMARY KEY,
                    ""IsActive"" boolean NOT NULL,
                    ""MaxVideoFileSizeMb"" bigint NOT NULL,
                    ""MaxImageFileSizeMb"" bigint NOT NULL,
                    ""MaxDurationSeconds"" integer NOT NULL,
                    ""MaxConcurrentOperations"" integer NOT NULL,
                    ""UpdatedAt"" timestamp with time zone NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""MotionControlModelPricings"" (
                    ""Id"" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    ""ModelName"" character varying(100) NOT NULL,
                    ""ProviderName"" character varying(100) NOT NULL,
                    ""BillingType"" character varying(50) NULL,
                    ""CostPerGeneration"" numeric NOT NULL DEFAULT 20.0,
                    ""CostPerSecond"" numeric NOT NULL DEFAULT 2.0,
                    ""BaseCost"" numeric NOT NULL DEFAULT 0.0,
                    ""AllowedWallet"" character varying(50) NULL,
                    ""IsActive"" boolean NOT NULL
                );
                ALTER TABLE ""MotionControlModelPricings"" ADD COLUMN IF NOT EXISTS ""CostPerGeneration"" numeric NOT NULL DEFAULT 20.0;
                ALTER TABLE ""AffiliateReferrals"" ADD COLUMN IF NOT EXISTS ""FirstEligiblePaymentAt"" timestamp with time zone NULL;
                ALTER TABLE ""AffiliateReferrals"" ADD COLUMN IF NOT EXISTS ""AccumulatedPackageDays"" integer NOT NULL DEFAULT 0;

                CREATE TABLE IF NOT EXISTS ""ReferenceToVideoSettings"" (
                    ""Id"" integer NOT NULL PRIMARY KEY,
                    ""IsActive"" boolean NOT NULL,
                    ""MaxPromptLength"" integer NOT NULL,
                    ""MaxDurationSeconds"" integer NOT NULL,
                    ""DefaultResolution"" character varying(20) NULL,
                    ""MaxConcurrentOperations"" integer NOT NULL,
                    ""UpdatedAt"" timestamp with time zone NOT NULL
                );
                CREATE TABLE IF NOT EXISTS ""ReferenceToVideoModelPricings"" (
                    ""Id"" integer GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
                    ""ModelName"" character varying(100) NOT NULL,
                    ""ProviderName"" character varying(100) NOT NULL,
                    ""BillingType"" character varying(50) NULL,
                    ""CostPerSecond_480p"" numeric NOT NULL,
                    ""CostPerSecond_720p"" numeric NOT NULL,
                    ""CostPerSecond_1080p"" numeric NOT NULL,
                    ""CostPerSecond_4k"" numeric NOT NULL,
                    ""FixedCost_480p"" numeric NOT NULL,
                    ""FixedCost_720p"" numeric NOT NULL,
                    ""FixedCost_1080p"" numeric NOT NULL,
                    ""FixedCost_4k"" numeric NOT NULL,
                    ""BaseCost"" numeric NOT NULL,
                    ""AllowedWallet"" character varying(50) NULL,
                    ""IsActive"" boolean NOT NULL
                );
            ");

            if (!await context.AvatarToVideoSettings.AnyAsync())
                context.AvatarToVideoSettings.Add(new AvatarToVideoSetting { Id = 1, IsActive = true, MaxImageFileSizeMb = 15, MaxAudioFileSizeMb = 15, MaxPromptLength = 500, MaxConcurrentOperations = 10 });
            if (!await context.AvatarToVideoModelPricings.AnyAsync())
                context.AvatarToVideoModelPricings.Add(new AvatarToVideoModelPricing { ModelName = "kling_avatar_image2video", ProviderName = "Picsart", BillingType = "PerRequest", UnitCost = 10.0m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.TextToVideoSettings.AnyAsync())
                context.TextToVideoSettings.Add(new TextToVideoSetting { Id = 1, IsActive = true, MaxPromptLength = 5000, MaxDurationSeconds = 20, DefaultResolution = "720p", MaxConcurrentOperations = 10 });
            var t2vModels = new[] {
                new TextToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 30.0m, FixedCost_1080p = 37.5m, FixedCost_4k = 90.0m, AllowedWallet = "Standard", IsActive = true },
                new TextToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 15.0m, FixedCost_1080p = 22.5m, FixedCost_4k = 75.0m, AllowedWallet = "Standard", IsActive = true },
                new TextToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m, AllowedWallet = "Standard", IsActive = true },
                new TextToVideoModelPricing { ModelName = "bytedance/seedance2-0-mini-t2v", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 0.0143m, CostPerSecond_720p = 0.0286m, CostPerSecond_1080p = 0.0286m, CostPerSecond_4k = 0.0286m, AllowedWallet = "Standard", IsActive = true }
            };
            foreach (var m in t2vModels)
            {
                if (!await context.TextToVideoModelPricings.AnyAsync(x => x.ModelName == m.ModelName))
                    context.TextToVideoModelPricings.Add(m);
            }
            // Retire the removed "Veo 3.1 Quality" model on existing databases.
            var t2vQualityRows = await context.TextToVideoModelPricings.Where(p => p.ModelName == "veo 3.1 Quality").ToListAsync();
            if (t2vQualityRows.Count > 0)
            {
                context.TextToVideoModelPricings.RemoveRange(t2vQualityRows);
            }

            if (!await context.ImageToVideoSettings.AnyAsync())
                context.ImageToVideoSettings.Add(new ImageToVideoSetting { Id = 1, IsActive = true, MaxImageFileSizeMb = 25, MaxDurationSeconds = 20, MaxPromptLength = 5000, MaxConcurrentOperations = 10 });
            var i2vModels = new[] {
                new ImageToVideoModelPricing { ModelName = "veo 3.1 Fast", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 30.0m, FixedCost_1080p = 37.5m, FixedCost_4k = 90.0m, AllowedWallet = "Standard", IsActive = true },
                new ImageToVideoModelPricing { ModelName = "veo 3.1 Lite", ProviderName = "CrunAI", BillingType = "PerRequest", FixedCost_720p = 15.0m, FixedCost_1080p = 22.5m, FixedCost_4k = 75.0m, AllowedWallet = "Standard", IsActive = true },
                new ImageToVideoModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 2.4m, CostPerSecond_720p = 4.5m, CostPerSecond_1080p = 8.0m, AllowedWallet = "Standard", IsActive = true },
                new ImageToVideoModelPricing { ModelName = "bytedance/seedance2-0-mini-i2v", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 0.0143m, CostPerSecond_720p = 0.0286m, CostPerSecond_1080p = 0.0286m, CostPerSecond_4k = 0.0286m, AllowedWallet = "Standard", IsActive = true }
            };
            foreach (var m in i2vModels)
            {
                if (!await context.ImageToVideoModelPricings.AnyAsync(x => x.ModelName == m.ModelName))
                    context.ImageToVideoModelPricings.Add(m);
            }
            // Retire the removed "Veo 3.1 Quality" model on existing databases.
            var i2vQualityRows = await context.ImageToVideoModelPricings.Where(p => p.ModelName == "veo 3.1 Quality").ToListAsync();
            if (i2vQualityRows.Count > 0)
            {
                context.ImageToVideoModelPricings.RemoveRange(i2vQualityRows);
            }

            if (!await context.ReferenceToVideoSettings.AnyAsync())
                context.ReferenceToVideoSettings.Add(new ReferenceToVideoSetting { Id = 1, IsActive = true, MaxPromptLength = 5000, MaxDurationSeconds = 20, DefaultResolution = "720p", MaxConcurrentOperations = 10 });
            if (!await context.ReferenceToVideoModelPricings.AnyAsync(x => x.ModelName == "bytedance/seedance2-0-mini-r2v"))
                context.ReferenceToVideoModelPricings.Add(new ReferenceToVideoModelPricing { ModelName = "bytedance/seedance2-0-mini-r2v", ProviderName = "CrunAI", BillingType = "PerSecond", CostPerSecond_480p = 0.0089m, CostPerSecond_720p = 0.0179m, CostPerSecond_1080p = 0.0179m, CostPerSecond_4k = 0.0179m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.LipSyncSettings.AnyAsync())
                context.LipSyncSettings.Add(new LipSyncSetting { Id = 1, IsActive = true, MaxVideoFileSizeMb = 100, MaxAudioFileSizeMb = 25, MaxAudioDurationSeconds = 120, MaxConcurrentOperations = 10 });
            if (!await context.LipSyncModelPricings.AnyAsync())
                context.LipSyncModelPricings.Add(new LipSyncModelPricing { ModelName = "vidu-lipsync-audio", ProviderName = "CrunAI", BillingType = "Per5Seconds", BaseCost = 12.0m, CostPerSecond = 2.4m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.TextToImageSettings.AnyAsync())
                context.TextToImageSettings.Add(new TextToImageSetting { Id = 1, IsActive = true, MaxPromptLength = 5000, MaxConcurrentOperations = 10 });
            if (!await context.TextToImageModelPricings.AnyAsync())
                context.TextToImageModelPricings.Add(new TextToImageModelPricing { ModelName = "grok-imagine", ProviderName = "CrunAI", BillingType = "PerRequest", CostPerImage = 4.0m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.MotionControlSettings.AnyAsync())
                context.MotionControlSettings.Add(new MotionControlSetting { Id = 1, IsActive = true, MaxVideoFileSizeMb = 100, MaxImageFileSizeMb = 25, MaxDurationSeconds = 30, MaxConcurrentOperations = 10 });
            if (!await context.MotionControlModelPricings.AnyAsync())
                context.MotionControlModelPricings.Add(new MotionControlModelPricing { ModelName = "kling-motion-control", ProviderName = "KlingAI", BillingType = "FlatRate", CostPerGeneration = 20.0m, CostPerSecond = 2.0m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.VoiceToTextSettings.AnyAsync())
                context.VoiceToTextSettings.Add(new VoiceToTextSetting { Id = 1, IsActive = true, MaxAudioFileSizeMb = 25, MaxAudioDurationMinutes = 10, MaxConcurrentOperations = 10 });
            if (!await context.VoiceToTextModelPricings.AnyAsync())
                context.VoiceToTextModelPricings.Add(new VoiceToTextModelPricing { ModelName = "gpt-4o-mini-transcribe", ProviderName = "OpenAI", BillingType = "PerMinute", CostPerMinute = 1.0m, CostPerSecond = 0.0167m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true });

            if (!await context.TextToVoiceSettings.AnyAsync())
                context.TextToVoiceSettings.Add(new TextToVoiceSetting { Id = 1, IsActive = true, MaxTextLength = 5000, MaxConcurrentOperations = 10 });
            var t2vAudioModels = new[] {
                new TextToVoiceModelPricing { QualityLevel = "Standard", ModelName = "gemini-2.5-flash-preview-tts", ProviderName = "Gemini", BillingType = "PerCharacter", CostPerChar = 0.001m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true },
                new TextToVoiceModelPricing { QualityLevel = "High", ModelName = "gemini-3.1-flash-tts-preview", ProviderName = "Gemini", BillingType = "PerCharacter", CostPerChar = 0.010m, BaseCost = 0m, AllowedWallet = "Standard", IsActive = true }
            };
            foreach (var m in t2vAudioModels)
            {
                if (!await context.TextToVoiceModelPricings.AnyAsync(x => x.ModelName == m.ModelName))
                    context.TextToVoiceModelPricings.Add(m);
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.UserManager<ApplicationUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<Microsoft.AspNetCore.Identity.RoleManager<Microsoft.AspNetCore.Identity.IdentityRole<Guid>>>();

            var roles = new[] { "SuperAdmin", "Staff", "User" };
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new Microsoft.AspNetCore.Identity.IdentityRole<Guid>(role));
                }
            }

            var adminsToSeed = new[]
            {
                new { Email = "hamed3alii.3@gmail.com", Password = "CVZXcvzx1@" },
                new { Email = "fps60y@gmail.com", Password = "CVZXcvzxCVZX1@" }
            };

            foreach (var admin in adminsToSeed)
            {
                var adminUser = await userManager.FindByEmailAsync(admin.Email);
                if (adminUser == null)
                {
                    adminUser = new ApplicationUser
                    {
                        UserName = admin.Email,
                        Email = admin.Email,
                        EmailConfirmed = true,
                        FullName = "Super Admin",
                        IsVerified = true,
                        IsActive = true,
                        IsSuperAdmin = true,
                        IsStaff = true
                    };
                    var result = await userManager.CreateAsync(adminUser, admin.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRolesAsync(adminUser, new[] { "SuperAdmin", "Staff" });
                    }
                }
                else
                {
                    if (!adminUser.EmailConfirmed || !adminUser.IsVerified || !adminUser.IsSuperAdmin || !adminUser.IsStaff || !adminUser.IsActive)
                    {
                        adminUser.EmailConfirmed = true;
                        adminUser.IsVerified = true;
                        adminUser.IsSuperAdmin = true;
                        adminUser.IsStaff = true;
                        adminUser.IsActive = true;
                        await userManager.UpdateAsync(adminUser);
                    }

                    if (!await userManager.CheckPasswordAsync(adminUser, admin.Password))
                    {
                        var token = await userManager.GeneratePasswordResetTokenAsync(adminUser);
                        await userManager.ResetPasswordAsync(adminUser, token, admin.Password);
                    }

                    if (!await userManager.IsInRoleAsync(adminUser, "SuperAdmin"))
                        await userManager.AddToRoleAsync(adminUser, "SuperAdmin");
                    if (!await userManager.IsInRoleAsync(adminUser, "Staff"))
                        await userManager.AddToRoleAsync(adminUser, "Staff");
                }
            }
        }

        private static async Task SeedLegacyUsersAsync(ApplicationDbContext dbContext)
        {
            var seedFilePath = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "SeedData", "legacy_users.sql");
            if (!System.IO.File.Exists(seedFilePath))
            {
                seedFilePath = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "SeedData", "legacy_users.sql");
            }

            if (System.IO.File.Exists(seedFilePath))
            {
                // Only seed if we don't have many users (so it only runs on a fresh database)
                if (await dbContext.Users.CountAsync() < 10)
                {
                    var sql = await System.IO.File.ReadAllTextAsync(seedFilePath);
                    try
                    {
                        await dbContext.Database.ExecuteSqlRawAsync(sql);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error executing legacy_users.sql: {ex.Message}");
                    }
                }
            }
        }
    }
}