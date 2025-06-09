using Middleware.Data.Entities.Infrastructure;

namespace Middleware.Data.Entities
{
    public class Tenant : BaseEntity
    {
        public Tenant()
        {
            Users = new HashSet<User>();
            Documents = new HashSet<Document>();
        }

        public string Name { get; set; } = default!;

        public ICollection<User> Users { get; set; }
        public ICollection<Document> Documents { get; set; }
    }
}
