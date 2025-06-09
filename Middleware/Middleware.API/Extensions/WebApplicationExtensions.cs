using Middleware.API.Services.Interfaces;

namespace Middleware.API.Extensions
{
    internal static class WebApplicationExtensions
    {
        public static void ApplyDbMigrations(this WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var migrationService = scope.ServiceProvider.GetRequiredService<IMigrationService>();
            migrationService.ApplyMigrations();
        }
    }
}
