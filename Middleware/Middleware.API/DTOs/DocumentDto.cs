namespace Middleware.API.DTOs
{
    public class DocumentDto
    {
        public Guid ID { get; set; }
        public string Title { get; set; } = default!;
        public string FileName { get; set; } = default!;
        public string? Language { get; set; }
        public List<string>? Tags { get; set; }
        public DateTime UploadedAt { get; set; }
    }
}
