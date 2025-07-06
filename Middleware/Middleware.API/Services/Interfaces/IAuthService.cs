namespace Middleware.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<(string, string)> LoginAsync(LoginRequest request, CancellationToken cancellationToken);
        Task<string> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken);
    }
}
