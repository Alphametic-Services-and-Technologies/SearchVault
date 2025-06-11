using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Middleware.API.Configurations;

namespace Middleware.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IngestorConfiguration _ingestorConfiguration;

        public ChatController(
            IHttpClientFactory httpClientFactory,
            IOptions<IngestorConfiguration> ingestorConfiguration)
        {
            _httpClientFactory = httpClientFactory;
            _ingestorConfiguration = ingestorConfiguration.Value;
        }

        [HttpPost]
        public async Task ChatStream([FromBody] ChatRequest request, CancellationToken cancellationToken)
        {
            using var client = _httpClientFactory.CreateClient();
            var reqBody = JsonContent.Create(request);
            var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Post, $"http://{_ingestorConfiguration.URL}:{_ingestorConfiguration.Port}/chat")
            {
                Content = reqBody
            }, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            // HttpCompletionOption.ResponseHeadersRead: Works well with React’s EventSource or fetch + ReadableStream - ChatGPT style in streaming text back

            Response.ContentType = "text/event-stream";

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var reader = new StreamReader(stream);
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync(cancellationToken);
                if (!string.IsNullOrWhiteSpace(line))
                {
                    await Response.WriteAsync($"{line}\n\n", cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
        }
    }
}
