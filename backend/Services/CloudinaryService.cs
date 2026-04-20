using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Configuration;

namespace backend.Services
{
    public class CloudinaryService : ICloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(IConfiguration configuration)
        {
            var cloudinarySettings = configuration.GetSection("CloudinarySettings");
            var account = new Account(
                cloudinarySettings["CloudName"] ?? "demo",
                cloudinarySettings["ApiKey"] ?? "key",
                cloudinarySettings["ApiSecret"] ?? "secret"
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<string?> UploadImageAsync(Stream fileStream, string fileName)
        {
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(fileName, fileStream),
                Folder = "cagura/products",
                PublicId = $"{Path.GetFileNameWithoutExtension(fileName)}_{DateTime.UtcNow.Ticks}"
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);

            if (uploadResult.Error != null)
            {
                Console.WriteLine($"Cloudinary Upload Error: {uploadResult.Error.Message}");
                return null;
            }

            return uploadResult.SecureUrl.ToString();
        }

        public async Task<bool> DeleteImageAsync(string publicId)
        {
            var deletionParams = new DeletionParams(publicId);
            var deletionResult = await _cloudinary.DestroyAsync(deletionParams);

            return deletionResult.Result == "ok";
        }
    }
}
