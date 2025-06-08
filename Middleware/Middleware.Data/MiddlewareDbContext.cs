using Microsoft.EntityFrameworkCore;
using Middleware.Data.Entities;

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
    }
}
