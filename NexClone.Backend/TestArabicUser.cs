using System;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity;
using NexClone.Backend.Core.Entities;
using NexClone.Backend.Infrastructure.Data;

namespace NexClone.Backend {
    public class TestArabicUser {
        public static async Task Run(IServiceProvider sp) {
            using var scope = sp.CreateScope();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            
            var user = new ApplicationUser {
                UserName = "testarabic@test.com",
                Email = "testarabic@test.com",
                FullName = "أحمد محمد"
            };
            
            var result = await userManager.CreateAsync(user, "Password123!");
            Console.WriteLine("Create Result: " + result.Succeeded);
            
            // Now try to change password (simulate admin panel)
            var removeResult = await userManager.RemovePasswordAsync(user);
            Console.WriteLine("Remove Password Result: " + removeResult.Succeeded);
            
            var addResult = await userManager.AddPasswordAsync(user, "NewPassword123!");
            Console.WriteLine("Add Password Result: " + addResult.Succeeded);
            if (!addResult.Succeeded) {
                foreach (var err in addResult.Errors) {
                    Console.WriteLine("Error: " + err.Description);
                }
            }
        }
    }
}
