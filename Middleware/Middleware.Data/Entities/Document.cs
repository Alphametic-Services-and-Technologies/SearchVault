using Middleware.Data.Entities.Infrastructure;

namespace Middleware.Data.Entities
{
    internal class Document : BaseEntity
    {
        public Guid TenantID { get; set; }
        public Tenant Tenant { get; set; } = default!;

        public string Title { get; set; } = default!;
        public string FileName { get; set; } = default!;
        public string? Language { get; set; }
        public List<string>? Tags { get; set; }
    }
}
