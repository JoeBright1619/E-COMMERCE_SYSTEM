using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Helpers
{
    public static class DataSeeder
    {
        public static async Task SeedAdminUserAsync(AppDbContext context)
        {
            // Check if any admin exists
            if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
            {
                var admin = new User
                {
                    Name = "System Admin",
                    Email = "admin@cagura.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), // Default password, should be changed
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                };

                context.Users.Add(admin);
                await context.SaveChangesAsync();
                Console.WriteLine("Admin user seeded successfully: admin@cagura.com / Admin@123");
            }
        }
    }
}
