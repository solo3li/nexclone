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
    }
}
