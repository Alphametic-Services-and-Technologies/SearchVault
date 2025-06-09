using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using Middleware.API.Configurations;
using Middleware.API.Services.Interfaces;
using Middleware.Data.Entities;
using Middleware.Data.Repositories.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Middleware.API.Services
{
    internal class AuthService(IRepository<User> userRepository, TokenConfiguration tokenConfiguration) : IAuthService
    {
        private readonly IRepository<User> _userRepository = userRepository;
        private readonly TokenConfiguration _tokenConfiguration = tokenConfiguration;

        public async Task<string> LoginAsync(LoginRequest request, CancellationToken cancellationToken)
        {
            var user = await _userRepository.GetByFilter(u => u.Email == request.Email && u.InactiveDate == null, cancellationToken);

            if (user == null)
                throw new Exception("Invalid credentials");

            var hasher = new PasswordHasher<User>();
            var result = hasher.VerifyHashedPassword(user, user.PasswordHash, request.Password);

            if (result == PasswordVerificationResult.Failed)
                throw new Exception("Invalid credentials");

            return GenerateJwtToken(user);
        }

        public async Task<string> RegisterAsync(RegisterRequest request, CancellationToken cancellationToken)
        {
            var exists = await _userRepository.Any(u => u.Email == request.Email, cancellationToken);
            if (exists) throw new Exception("User already exists");

            var hasher = new PasswordHasher<User>();

            var user = new User
            {
                ID = Guid.NewGuid(),
                Email = request.Email,
                Role = request.Role,
                TenantID = request.TenantId
            };

            user.PasswordHash = hasher.HashPassword(user, request.Password);

            await _userRepository.Insert(user, cancellationToken);
            await _userRepository.Commit(cancellationToken);

            return GenerateJwtToken(user);
        }

        private string GenerateJwtToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_tokenConfiguration.Secret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim("TenantId", user.TenantID.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _tokenConfiguration.Issuer,
                audience: _tokenConfiguration.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
