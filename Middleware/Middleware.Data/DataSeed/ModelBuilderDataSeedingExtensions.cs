using Microsoft.EntityFrameworkCore;
using Middleware.Data.Entities;

namespace Middleware.Data.DataSeed
{
    internal static class ModelBuilderDataSeedingExtensions
    {
        internal static void SeedData(this ModelBuilder modelBuilder)
        {
            var timestamp = new DateTime(2025, 06, 9, 0, 0, 0, DateTimeKind.Utc);
            var abcTenantID = new Guid("7D444840-9DC0-408C-8994-ACC51B013188");
            var xyzTenantID = new Guid("7a205d0c-8d84-431f-918f-6ea66d1d4a50");

            modelBuilder.Entity<Tenant>().HasData(
                    new Tenant
                    {
                        ID = abcTenantID,
                        Name = "ABC",
                        CreatedBy = "Data-Seed",
                        ModifiedBy = "Data-Seed",
                        CreatedAt = timestamp,
                        ModifiedAt = timestamp
                    }
                );

            modelBuilder.Entity<Tenant>().HasData(
                    new Tenant
                    {
                        ID = xyzTenantID,
                        Name = "XYZ",
                        CreatedBy = "Data-Seed",
                        ModifiedBy = "Data-Seed",
                        CreatedAt = timestamp,
                        ModifiedAt = timestamp
                    }
                );
        }
    }
}
