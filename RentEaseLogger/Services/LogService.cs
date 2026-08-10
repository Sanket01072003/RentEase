using RentEaseLogger.Data;
using RentEaseLogger.Models;
using Microsoft.EntityFrameworkCore;

namespace RentEaseLogger.Services
{
    // ── Interface ──────────────────────────────────────────────
    public interface ILogService
    {
        Task SaveLogAsync(LogRequest request);
        Task<List<ApiLog>> GetAllLogsAsync();
        Task<List<ApiLog>> GetLogsByServiceAsync(string service);
        Task<List<ApiLog>> GetLogsByLevelAsync(string level);
        Task<List<ApiLog>> GetLogsByUserAsync(string mail);
        Task<List<ApiLog>> GetRecentLogsAsync(int count);
        Task<object> GetStatsAsync();
        Task DeleteOldLogsAsync(int daysOld);
    }

    // ── Implementation ─────────────────────────────────────────
    public class LogService : ILogService
    {
        private readonly LoggerDbContext _db;
        private readonly ILogger<LogService> _logger;

        public LogService(LoggerDbContext db, ILogger<LogService> logger)
        {
            _db     = db;
            _logger = logger;
        }

        // Save incoming log from Spring Boot
        public async Task SaveLogAsync(LogRequest request)
        {
            // Determine log level based on status code
            string level = request.StatusCode switch
            {
                >= 500 => "ERROR",
                >= 400 => "WARN",
                _      => "INFO"
            };

            var log = new ApiLog
            {
                Service         = request.Service,
                Method          = request.Method.ToUpper(),
                Endpoint        = request.Endpoint,
                StatusCode      = request.StatusCode,
                UserMail        = request.UserMail,
                UserRole        = request.UserRole,
                RequestBody     = request.RequestBody,
                ResponseMessage = request.ResponseMessage,
                DurationMs      = request.DurationMs,
                Level           = level,
                Timestamp       = DateTime.UtcNow,
            };

            _db.ApiLogs.Add(log);
            await _db.SaveChangesAsync();

            // Also log to Serilog (file + console)
            var msg = $"[{log.Service}] {log.Method} {log.Endpoint} → {log.StatusCode} ({log.DurationMs}ms) | User: {log.UserMail ?? "anonymous"}";

            if (level == "ERROR")       _logger.LogError(msg);
            else if (level == "WARN")   _logger.LogWarning(msg);
            else                        _logger.LogInformation(msg);
        }

        public async Task<List<ApiLog>> GetAllLogsAsync()
            => await _db.ApiLogs.OrderByDescending(l => l.Timestamp).ToListAsync();

        public async Task<List<ApiLog>> GetLogsByServiceAsync(string service)
            => await _db.ApiLogs
                .Where(l => l.Service.ToLower() == service.ToLower())
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

        public async Task<List<ApiLog>> GetLogsByLevelAsync(string level)
            => await _db.ApiLogs
                .Where(l => l.Level.ToUpper() == level.ToUpper())
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

        public async Task<List<ApiLog>> GetLogsByUserAsync(string mail)
            => await _db.ApiLogs
                .Where(l => l.UserMail == mail)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();

        public async Task<List<ApiLog>> GetRecentLogsAsync(int count)
            => await _db.ApiLogs
                .OrderByDescending(l => l.Timestamp)
                .Take(count)
                .ToListAsync();

        public async Task<object> GetStatsAsync()
        {
            var total   = await _db.ApiLogs.CountAsync();
            var errors  = await _db.ApiLogs.CountAsync(l => l.Level == "ERROR");
            var warns   = await _db.ApiLogs.CountAsync(l => l.Level == "WARN");
            var infos   = await _db.ApiLogs.CountAsync(l => l.Level == "INFO");
            var avgMs   = await _db.ApiLogs.AverageAsync(l => (double)l.DurationMs);

            var byService = await _db.ApiLogs
                .GroupBy(l => l.Service)
                .Select(g => new { Service = g.Key, Count = g.Count() })
                .ToListAsync();

            var byEndpoint = await _db.ApiLogs
                .GroupBy(l => l.Endpoint)
                .Select(g => new { Endpoint = g.Key, Count = g.Count() })
                .OrderByDescending(g => g.Count)
                .Take(5)
                .ToListAsync();

            return new
            {
                Total         = total,
                Errors        = errors,
                Warnings      = warns,
                Info          = infos,
                AvgDurationMs = Math.Round(avgMs, 2),
                ByService     = byService,
                TopEndpoints  = byEndpoint,
            };
        }

        public async Task DeleteOldLogsAsync(int daysOld)
        {
            var cutoff = DateTime.UtcNow.AddDays(-daysOld);
            var old    = await _db.ApiLogs.Where(l => l.Timestamp < cutoff).ToListAsync();
            _db.ApiLogs.RemoveRange(old);
            await _db.SaveChangesAsync();
            _logger.LogInformation($"Deleted {old.Count} logs older than {daysOld} days.");
        }
    }
}
