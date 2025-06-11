using Microsoft.Extensions.Options;
using Middleware.API.Configurations;
using Middleware.API.DTOs;
using Middleware.API.Services.Interfaces;
using Middleware.Data.Entities;
using Middleware.Data.Repositories.Interfaces;

namespace Middleware.API.Services
{
    internal class DocsService(
        IRepository<Document> documentRepository,
        IRepository<User> userRepository,
        IHttpClientFactory httpClientFactory,
        IOptions<IngestorConfiguration> ingestorConfiguration) : IDocsService
    {
        private readonly IRepository<Document> _documentRepository = documentRepository;
        private readonly IRepository<User> _userRepository = userRepository;
        private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
        private readonly IngestorConfiguration _ingestorConfiguration = ingestorConfiguration.Value;

        public async Task<List<DocumentDto>> GetDocumentsForTenantAsync(Guid tenantId, CancellationToken cancellationToken)
        {
            var documents = await _documentRepository.GetMany(d => d.TenantID == tenantId && d.InactiveDate == null, cancellationToken);
            return [.. documents.OrderByDescending(d => d.CreatedAt).Select(d => new DocumentDto
            {
                ID = d.ID,
                FileName = d.FileName,
                Language = d.Language,
                Tags = d.Tags,
                Title = d.Title,
                UploadedAt = d.CreatedAt
            })];
        }

        public async Task UploadAsync(DocumentUploadRequest request, string uploadedByEmail, Guid tenantId, CancellationToken cancellationToken)
        {
            var uploader = await _userRepository.GetByFilter(u => u.Email == uploadedByEmail, cancellationToken);
            if (uploader == null) throw new Exception("Uploader not found");

            var document = new Document
            {
                ID = Guid.NewGuid(),
                TenantID = tenantId,
                Title = request.File.FileName,
                FileName = request.File.FileName,
                Language = request.Language,
                Tags = request.Tags?.ToList()
            };

            await _documentRepository.Insert(document, cancellationToken);
            await _documentRepository.Commit(cancellationToken);

            // Send to Ingestor
            using var client = _httpClientFactory.CreateClient();
            var content = new MultipartFormDataContent
            {
                { new StreamContent(request.File.OpenReadStream()), "file", request.File.FileName },
                { new StringContent(tenantId.ToString()), "tenant_id" },
                { new StringContent(Path.GetFileNameWithoutExtension(request.File.FileName)), "doc_title" }
            };

            var response = await client.PostAsync($"http://{_ingestorConfiguration.URL}:{_ingestorConfiguration.Port}/ingest", content);
            response.EnsureSuccessStatusCode();
        }
    }
}
