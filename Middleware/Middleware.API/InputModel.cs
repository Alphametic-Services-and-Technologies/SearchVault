namespace Middleware.API
{
    public record RegisterRequest(string Email, string Password, string Role, Guid TenantId);
    public record LoginRequest(string Email, string Password);
}
