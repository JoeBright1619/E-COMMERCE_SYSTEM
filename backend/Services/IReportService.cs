using backend.DTOs;

namespace backend.Services
{
    public interface IReportService
    {
        Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
    }
}
