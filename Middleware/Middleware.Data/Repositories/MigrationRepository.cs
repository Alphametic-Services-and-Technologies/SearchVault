using Microsoft.EntityFrameworkCore;
using Middleware.Data.Repositories.Interfaces;

namespace Middleware.Data.Repositories
{
    internal class MigrationRepository(MiddlewareDbContext dbContext) : IMigrationRepository
    {
        private readonly MiddlewareDbContext _dbContext = dbContext;

        public void ApplyMigrations()
        {
            _dbContext.Database.Migrate();
        }
    }
}
