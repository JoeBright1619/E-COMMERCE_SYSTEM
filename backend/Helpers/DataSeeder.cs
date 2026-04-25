using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Helpers
{
    public static class DataSeeder
    {
        public static async Task SeedAllAsync(AppDbContext context)
        {
            await SeedUsersAsync(context);
            await SeedCategoriesAndProductsAsync(context);
        }

        private static async Task SeedUsersAsync(AppDbContext context)
        {
            if (!await context.Users.AnyAsync(u => u.Role == "Admin"))
            {
                context.Users.Add(new User
                {
                    Name = "System Admin",
                    Email = "admin@cagura.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                });
            }

            if (!await context.Users.AnyAsync(u => u.Role == "User"))
            {
                context.Users.Add(new User
                {
                    Name = "Demo User",
                    Email = "user@cagura.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                    Role = "User",
                    CreatedAt = DateTime.UtcNow
                });
            }

            await context.SaveChangesAsync();
        }

        private static async Task SeedCategoriesAndProductsAsync(AppDbContext context)
        {
            if (await context.Categories.AnyAsync())
            {
                return; // Already seeded
            }

            var categories = new List<Category>
            {
                new Category { Name = "Footwear", Description = "Everyday shoes and sneakers." },
                new Category { Name = "Audio", Description = "Headphones, earbuds, and speakers." },
                new Category { Name = "Wearables", Description = "Smartwatches and fitness trackers." },
                new Category { Name = "Accessories", Description = "Wallets, chargers, and everyday carry." },
                new Category { Name = "Bags", Description = "Backpacks, totes, and luggage." }
            };

            context.Categories.AddRange(categories);
            await context.SaveChangesAsync(); // Save to generate IDs

            var products = new List<Product>
            {
                new Product { Name = "Minimalist Smart Watch", Description = "A clean time-piece with vital health tracking.", Price = 189.99m, StockQuantity = 50, CategoryId = categories.First(c => c.Name == "Wearables").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788999/product_watch_1776467103171_ijmbqs.jpg" },
                new Product { Name = "Titanium Smart Ring", Description = "Discreet fitness and sleep tracking in a premium finish.", Price = 249.00m, StockQuantity = 25, CategoryId = categories.First(c => c.Name == "Wearables").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788978/titanium_smart_ring_1776712869520_yo4nt8.jpg" },
                new Product { Name = "Over-Ear NC Headphones", Description = "Block out the noise with deep, rich audio quality.", Price = 299.50m, StockQuantity = 30, CategoryId = categories.First(c => c.Name == "Audio").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788978/product_headphones_1776467120598_wfw5de.jpg" },
                new Product { Name = "Premium Wireless Earbuds", Description = "Compact sound for everyday commutes.", Price = 129.99m, StockQuantity = 100, CategoryId = categories.First(c => c.Name == "Audio").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788977/premium_earbuds_1776712916481_ybefzd.jpg" },
                new Product { Name = "Urban Commuter Backpack", Description = "Weather-resistant, structured tech bag.", Price = 95.00m, StockQuantity = 40, CategoryId = categories.First(c => c.Name == "Bags").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788999/urban_backpack_1776712967683_qpluzj.jpg" },
                new Product { Name = "Everyday Sneakers", Description = "Ultra-comfortable lightweight sneakers.", Price = 75.00m, StockQuantity = 120, CategoryId = categories.First(c => c.Name == "Footwear").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788979/product_sneakers_1776467199864_ba1xwd.jpg" },
                new Product { Name = "Minimal Smart Wallet", Description = "Holds your essentials securely.", Price = 45.00m, StockQuantity = 200, CategoryId = categories.First(c => c.Name == "Accessories").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788997/smart_wallet_1776713017275_p2eyyi.jpg" },
                new Product { Name = "MagSafe Wireless Charger", Description = "Fast, reliable power for your desk.", Price = 35.50m, StockQuantity = 80, CategoryId = categories.First(c => c.Name == "Accessories").Id, ImageUrl = "https://res.cloudinary.com/dj8kwwxzo/image/upload/v1776788978/wireless_charger_u7v6ij.jpg" }
            };

            context.Products.AddRange(products);
            await context.SaveChangesAsync();
        }
    }
}
