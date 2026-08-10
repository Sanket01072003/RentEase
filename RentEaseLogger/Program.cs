using Microsoft.EntityFrameworkCore;
using RentEaseLogger.Data;
using RentEaseLogger.Services;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// ── Serilog Configuration ──────────────────────────────────────
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        path: "Logs/rentease-log-.txt",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 14,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// ── Services ────────────────────────────────────────────────────
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "RentEase Logger Microservice",
        Version = "v1",
        Description = "Centralized logging service for RentEase Spring Boot microservices"
    });
});

// ── Database (MySQL) ─────────────────────────────────────
// builder.Services.AddDbContext<LoggerDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<LoggerDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    ));

// ── Dependency Injection ──────────────────────────────────────
builder.Services.AddScoped<ILogService, LogService>();

// ── CORS — Allow Spring Boot + React to call this service ─────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ── Auto-create DB + tables on startup ─────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<LoggerDbContext>();
    db.Database.EnsureCreated();
}

// ── Middleware Pipeline ─────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "RentEase Logger API v1");
        c.RoutePrefix = string.Empty; // Swagger UI at root: http://localhost:5000
    });
}

app.UseSerilogRequestLogging(); // Logs every HTTP request to this service itself
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

Log.Information("🚀 RentEase Logger Microservice started on port 5000");

app.Run();
