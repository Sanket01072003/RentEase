using Microsoft.EntityFrameworkCore;
using RentEaseLogger.Models;

namespace RentEaseLogger.Data
{
    public class LoggerDbContext : DbContext
    {
        public LoggerDbContext(DbContextOptions<LoggerDbContext> options)
            : base(options) { }

        public DbSet<ApiLog> ApiLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApiLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Service).HasMaxLength(100);
                entity.Property(e => e.Method).HasMaxLength(10);
                entity.Property(e => e.Endpoint).HasMaxLength(500);
                entity.Property(e => e.UserMail).HasMaxLength(200);
                entity.Property(e => e.UserRole).HasMaxLength(50);
                entity.Property(e => e.Level).HasMaxLength(20);
                entity.Property(e => e.RequestBody).HasMaxLength(2000);
                entity.Property(e => e.ResponseMessage).HasMaxLength(1000);
            });
        }
    }
}
