using Middleware.API.Services.Interfaces;
using Middleware.Data.Repositories.Interfaces;

namespace Middleware.API.Services
{
    internal class MigrationService(IMigrationRepository migrationRepository) : IMigrationService
    {
        private readonly IMigrationRepository _migrationRepository = migrationRepository;

        public void ApplyMigrations()
        {
            _migrationRepository.ApplyMigrations();
        }
    }
}
