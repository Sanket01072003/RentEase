namespace RentEaseLogger.Models
{
    public class LogRequest
    {
        public string Service { get; set; } = string.Empty;
        public string Method { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public int StatusCode { get; set; }
        public string? UserMail { get; set; }
        public string? UserRole { get; set; }
        public string? RequestBody { get; set; }
        public string? ResponseMessage { get; set; }
        public long DurationMs { get; set; }
    }
}
