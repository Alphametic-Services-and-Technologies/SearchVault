namespace Middleware.API
{
    public record RegisterRequest(string Email, string Password, string Role, Guid TenantId);
    public record LoginRequest(string Email, string Password);

    public class DocumentUploadRequest
    {
        public IFormFile File { get; set; } = default!;
        public string? Language { get; set; }
        public string[]? Tags { get; set; }
    }

    public class ChatRequest
    {
        public string Question { get; set; } = default!;
        public Guid TenantId { get; set; }
        public string LLMProvider { get; set; } = "local";
    }
}
