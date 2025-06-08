using Middleware.Data.Entities.Infrastructure;

namespace Middleware.Data.Entities
{
    internal class User : BaseEntity
    {
        public Guid TenantID { get; set; }
        public Tenant Tenant { get; set; } = default!;

        public string Email { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Role { get; set; } = "User"; // or "Admin"
    }
}
