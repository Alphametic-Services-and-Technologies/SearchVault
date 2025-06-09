using Microsoft.AspNetCore.Mvc;

namespace Middleware.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public ChatController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpPost]
        public async Task ChatStream([FromBody] ChatRequest request, CancellationToken cancellationToken)
        {
            using var client = _httpClientFactory.CreateClient();
            var reqBody = JsonContent.Create(request);
            var response = await client.SendAsync(new HttpRequestMessage(HttpMethod.Post, "http://localhost:8000/chat")
            {
                Content = reqBody
            }, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            // HttpCompletionOption.ResponseHeadersRead: Works well with React’s EventSource or fetch + ReadableStream - ChatGPT style in streaming text back

            Response.ContentType = "text/event-stream";

            await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var reader = new StreamReader(stream);
            while(!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync(cancellationToken);
                if (!string.IsNullOrWhiteSpace(line))
                {
                    await Response.WriteAsync($"data: {line}\n\n", cancellationToken);
                    await Response.Body.FlushAsync(cancellationToken);
                }
            }
        }
    }
}
