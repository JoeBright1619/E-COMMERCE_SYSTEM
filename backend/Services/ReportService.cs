using backend.DTOs;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    public class ReportService : IReportService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUserRepository _userRepository;
        private readonly IProductRepository _productRepository;

        public ReportService(
            IOrderRepository orderRepository, 
            IUserRepository userRepository, 
            IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _userRepository = userRepository;
            _productRepository = productRepository;
        }

        public async Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync()
        {
            try
            {
                var orders = (await _orderRepository.GetAllAsync()).ToList();
                var users = await _userRepository.GetAllAsync();
                var products = await _productRepository.GetAllAsync();

                var confirmedOrders = orders.Where(o => o.Status != "Cancelled" && o.Status != "Pending").ToList();

                var stats = new DashboardStatsDto
                {
                    TotalRevenue = confirmedOrders.Sum(o => o.TotalAmount),
                    TotalOrders = orders.Count,
                    TotalCustomers = users.Count(u => u.Role == "Client"),
                    TotalProducts = products.Count(),
                    
                    OrdersByStatus = orders
                        .GroupBy(o => o.Status)
                        .Select(g => new OrderStatusCountDto
                        {
                            Status = g.Key,
                            Count = g.Count()
                        }).ToList(),

                    TopProducts = orders
                        .SelectMany(o => o.OrderItems ?? new List<OrderItem>())
                        .GroupBy(oi => oi.Product != null ? oi.Product.Name : "Unknown")
                        .Select(g => new BestSellerDto
                        {
                            ProductName = g.Key,
                            QuantitySold = g.Sum(oi => oi.Quantity),
                            TotalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice)
                        })
                        .OrderByDescending(x => x.QuantitySold)
                        .Take(5)
                        .ToList()
                };

                return ApiResponse<DashboardStatsDto>.SuccessResult(stats, "Dashboard statistics generated.");
            }
            catch (Exception ex)
            {
                return ApiResponse<DashboardStatsDto>.ErrorResult($"Failed to generate stats: {ex.Message}");
            }
        }
    }
}
