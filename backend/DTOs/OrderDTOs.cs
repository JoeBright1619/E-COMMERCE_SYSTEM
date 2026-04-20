using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class OrderCreateDto
    {
        [Required]
        [StringLength(500)]
        public string ShippingAddress { get; set; } = string.Empty;
    }

    public class OrderItemResponseDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal UnitPrice { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal => UnitPrice * Quantity;
    }

    public class OrderResponseDto
    {
        public int OrderId { get; set; }
        public int? UserId { get; set; }
        public string CustomerName { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int ItemCount { get; set; }
        public IEnumerable<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }

    public class UpdateStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        public string Status { get; set; }
    }
}
