using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Middleware.API.Services.Interfaces;
using System.Security.Claims;

namespace Middleware.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class DocsController : ControllerBase
    {
        private readonly IDocsService _docsService;

        public DocsController(IDocsService docsService)
        {
            _docsService = docsService;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload([FromForm] DocumentUploadRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.Email)!;
            var tenantId = Guid.Parse(User.FindFirst("TenantId")!.Value);
            await _docsService.UploadAsync(request, userId, tenantId, cancellationToken);
            return Ok(new { status = "uploaded" });
        }

        [HttpGet]
        public async Task<IActionResult> List(CancellationToken cancellationToken)
        {
            var tenantId = Guid.Parse(User.FindFirst("TenantId")!.Value);
            var docs = await _docsService.GetDocumentsForTenantAsync(tenantId, cancellationToken);
            return Ok(docs);
        }
    }
}
