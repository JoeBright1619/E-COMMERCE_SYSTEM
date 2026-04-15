using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        [Required]
        public int Quantity { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;

        // Foreign keys
        public int UserId { get; set; }
        public int ProductId { get; set; }

        // Navigation properties
        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; } = null!;

        [ForeignKey(nameof(ProductId))]
        public virtual Product Product { get; set; } = null!;
    }
}
