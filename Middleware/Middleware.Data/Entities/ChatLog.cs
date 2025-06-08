using Middleware.Data.Entities.Infrastructure;

namespace Middleware.Data.Entities
{
    internal class ChatLog : BaseEntity
    {
        public Guid TenantID { get; set; }
        public Tenant Tenant { get; set; } = default!;

        public Guid? UserID { get; set; }
        public User? User { get; set; }

        public string Question { get; set; } = default!;
        public string? Answer { get; set; }
    }
}
