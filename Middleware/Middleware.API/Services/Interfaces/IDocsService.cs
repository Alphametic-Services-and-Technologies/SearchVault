using Middleware.API.DTOs;

namespace Middleware.API.Services.Interfaces
{
    public interface IDocsService
    {
        Task UploadAsync(DocumentUploadRequest request, string uploadedByEmail, Guid tenantId, CancellationToken cancellationToken);
        Task<List<DocumentDto>> GetDocumentsForTenantAsync(Guid tenantId, CancellationToken cancellationToken);
    }
}
