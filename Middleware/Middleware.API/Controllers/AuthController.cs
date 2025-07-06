using Microsoft.AspNetCore.Mvc;
using Middleware.API.Services.Interfaces;

namespace Middleware.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request, CancellationToken cancellationToken)
        {
            var result = await _authService.RegisterAsync(request, cancellationToken);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request, CancellationToken cancellationToken)
        {
            var loninResult = await _authService.LoginAsync(request, cancellationToken);
            return Ok(new { loninResult.Item1, tenantid = loninResult.Item2 });
        }
    }
}
