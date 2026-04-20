using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/reports")]
    [Authorize(Roles = "Admin")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public ReportsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        [HttpGet("dashboard")]
        public async Task<ActionResult<ApiResponse<DashboardStatsDto>>> GetDashboardStats()
        {
            try
            {
                var result = await _reportService.GetDashboardStatsAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ApiResponse<DashboardStatsDto>.ErrorResult($"Internal server error: {ex.Message}"));
            }
        }
    }
}
