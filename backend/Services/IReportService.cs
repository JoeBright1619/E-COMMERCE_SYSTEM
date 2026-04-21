using backend.DTOs;

namespace backend.Services
{
    public interface IReportService
    {
        Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
        Task<ApiResponse<OrderSummaryReportDto>> GetOrderSummaryAsync(DateTime? startDate, DateTime? endDate);
    }
}
