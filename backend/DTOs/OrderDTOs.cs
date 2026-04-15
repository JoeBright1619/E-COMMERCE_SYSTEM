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
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal Subtotal { get; set; }
    }

    public class OrderResponseDto
    {
        public int Id { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string ShippingAddress { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public IEnumerable<OrderItemResponseDto> Items { get; set; } = new List<OrderItemResponseDto>();
    }
}
