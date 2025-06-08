using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Middleware.Data.Entities.Infrastructure
{
    internal abstract class BaseEntity : IAuditable
    {
        [Key]
        public Guid ID { get; set; }

        [Required]
        [Column(TypeName = "timestamp without time zone")]
        public DateTime CreatedAt { get; set; }

        [Column(TypeName = "timestamp without time zone")]
        public DateTime? ModifiedAt { get; set; }

        [Required]
        [MaxLength(50)]
        public string CreatedBy { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? ModifiedBy { get; set; }

        [ScaffoldColumn(false)]
        [Column(TypeName = "timestamp without time zone")]
        public DateTime? InactiveDate { get; set; }

        [Timestamp]
        public uint RawVersion { get; set; }
    }
}
