using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class CartAddDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class CartUpdateDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }

    public class CartItemResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public string? ProductDescription { get; set; }
        public decimal ProductPrice { get; set; }
        public string? ProductImageUrl { get; set; }
        public int ProductStockQuantity { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
        public DateTime AddedAt { get; set; }
    }

    public class CartResponseDto
    {
        public IEnumerable<CartItemResponseDto> Items { get; set; } = new List<CartItemResponseDto>();
        public int TotalItems { get; set; }
        public decimal TotalAmount { get; set; }
    }
}
