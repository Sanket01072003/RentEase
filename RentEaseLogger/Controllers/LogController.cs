using Microsoft.AspNetCore.Mvc;
using RentEaseLogger.Models;
using RentEaseLogger.Services;

namespace RentEaseLogger.Controllers
{
    [ApiController]
    [Route("api/logs")]
    public class LogController : ControllerBase
    {
        private readonly ILogService _logService;

        public LogController(ILogService logService)
        {
            _logService = logService;
        }

        // ── Called by Spring Boot after every API request ──────
        // POST /api/logs
        [HttpPost]
        public async Task<IActionResult> SaveLog([FromBody] LogRequest request)
        {
            if (request == null)
                return BadRequest("Log request is null");

            await _logService.SaveLogAsync(request);
            return Ok(new { message = "Log saved successfully" });
        }

        // ── Get all logs ───────────────────────────────────────
        // GET /api/logs
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var logs = await _logService.GetAllLogsAsync();
            return Ok(logs);
        }

        // ── Get recent N logs ─────────────────────────────────
        // GET /api/logs/recent?count=50
        [HttpGet("recent")]
        public async Task<IActionResult> GetRecent([FromQuery] int count = 50)
        {
            var logs = await _logService.GetRecentLogsAsync(count);
            return Ok(logs);
        }

        // ── Get logs by service name ───────────────────────────
        // GET /api/logs/service/UserService
        [HttpGet("service/{service}")]
        public async Task<IActionResult> GetByService(string service)
        {
            var logs = await _logService.GetLogsByServiceAsync(service);
            return Ok(logs);
        }

        // ── Get logs by level ──────────────────────────────────
        // GET /api/logs/level/ERROR
        [HttpGet("level/{level}")]
        public async Task<IActionResult> GetByLevel(string level)
        {
            var logs = await _logService.GetLogsByLevelAsync(level);
            return Ok(logs);
        }

        // ── Get logs by user email ─────────────────────────────
        // GET /api/logs/user/amit@gmail.com
        [HttpGet("user/{mail}")]
        public async Task<IActionResult> GetByUser(string mail)
        {
            var logs = await _logService.GetLogsByUserAsync(mail);
            return Ok(logs);
        }

        // ── Get stats ──────────────────────────────────────────
        // GET /api/logs/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var stats = await _logService.GetStatsAsync();
            return Ok(stats);
        }

        // ── Delete old logs ────────────────────────────────────
        // DELETE /api/logs/cleanup?daysOld=30
        [HttpDelete("cleanup")]
        public async Task<IActionResult> Cleanup([FromQuery] int daysOld = 30)
        {
            await _logService.DeleteOldLogsAsync(daysOld);
            return Ok(new { message = $"Logs older than {daysOld} days deleted." });
        }
    }
}
