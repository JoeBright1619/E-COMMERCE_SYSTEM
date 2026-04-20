namespace backend.DTOs
{
    public class DashboardStatsDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalOrders { get; set; }
        public int TotalCustomers { get; set; }
        public int TotalProducts { get; set; }
        public IEnumerable<BestSellerDto> TopProducts { get; set; } = new List<BestSellerDto>();
        public IEnumerable<OrderStatusCountDto> OrdersByStatus { get; set; } = new List<OrderStatusCountDto>();
    }

    public class BestSellerDto
    {
        public string ProductName { get; set; } = string.Empty;
        public int QuantitySold { get; set; }
        public decimal TotalRevenue { get; set; }
    }

    public class OrderStatusCountDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}
