using Microsoft.EntityFrameworkCore;
using Middleware.Data.Entities;
using Middleware.Data.Entities.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace Middleware.Data
{
    internal class MiddlewareDbContext : DbContext
    {
        public DbSet<Tenant> Tenants => Set<Tenant>();
        public DbSet<User> Users => Set<User>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<ChatLog> ChatLogs => Set<ChatLog>();

        public MiddlewareDbContext(DbContextOptions<MiddlewareDbContext> options)
            : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Document>().Property(d => d.Tags).HasColumnType("text[]"); // PostgreSQL array mapping
            modelBuilder.Entity<Document>().Property(b => b.RawVersion).IsRowVersion();

            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();
            modelBuilder.Entity<User>().Property(b => b.RawVersion).IsRowVersion();

            modelBuilder.Entity<Tenant>().HasIndex(t => t.Name).IsUnique();
            modelBuilder.Entity<Tenant>().Property(b => b.RawVersion).IsRowVersion();

            modelBuilder.Entity<ChatLog>().Property(b => b.RawVersion).IsRowVersion();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                HandleAuditableChangeSet();
                HandleValidationErrors();
                return await base.SaveChangesAsync(cancellationToken);
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new Exception("Concurrency Exception Occurred.");
            }
            catch (DbUpdateException exception)
            {
                string errorMessage = "";
                foreach (var entry in exception.Entries)
                {
                    // Rollback changes
                    switch (entry.State)
                    {
                        case EntityState.Added:
                            entry.State = EntityState.Detached;
                            break;
                        case EntityState.Modified:
                            entry.CurrentValues.SetValues(entry.OriginalValues);
                            entry.State = EntityState.Unchanged;
                            break;
                    }

                    errorMessage += $"Entity: '{entry.Entity}'\n";
                }

                Exception ex = exception;
                while (ex.InnerException != null)
                {
                    ex = ex.InnerException;
                }

                throw new Exception(errorMessage + ex.Message);
            }
        }

        private void HandleValidationErrors()
        {
            string errorMessage = string.Empty;
            foreach (var entry in ChangeTracker.Entries().Where(e => (e.State == EntityState.Added) || (e.State == EntityState.Modified)))
            {
                var entity = entry.Entity;
                var context = new ValidationContext(entity);
                var results = new List<ValidationResult>();
                if (Validator.TryValidateObject(entity, context, results, true) == false)
                {
                    foreach (var result in results.Where(r => r != ValidationResult.Success))
                    {
                        errorMessage = "Validation errors found:\n";
                        foreach (var field in result.MemberNames)
                        {
                            errorMessage += ($"Property: '{field}'; Error: '{result.ErrorMessage}'\n");
                        }
                    }
                }
            }
            if (!string.IsNullOrEmpty(errorMessage))
                throw new Exception(errorMessage);
        }

        private void HandleAuditableChangeSet()
        {
            var changeSet = ChangeTracker.Entries<IAuditable>();
            DateTime currentDateTime = DateTime.UtcNow;

            if (changeSet != null)
            {
                foreach (var entry in changeSet.Where(c => c.State == EntityState.Added || c.State == EntityState.Modified))
                {
                    if (entry.State == EntityState.Added)
                    {
                        entry.Entity.CreatedAt = currentDateTime;
                        entry.Entity.CreatedBy = "To be defined";
                    }
                    else if (entry.State == EntityState.Modified)
                    {
                        entry.Entity.ModifiedAt = currentDateTime;
                        entry.Entity.ModifiedBy = "To be defined";
                    }
                }
            }
        }
    }
}
