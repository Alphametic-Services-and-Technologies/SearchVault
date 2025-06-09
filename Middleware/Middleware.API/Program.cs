using Middleware.API.Configurations;
using Middleware.API.DI;
using Middleware.API.Extensions;
using Middleware.Data.DI;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Text.Json;
using System.Text.Json.Serialization;

const string CORS_POLICY_NAME = "CorsPolicy";

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

builder.Services.AddControllers();
builder.Services.AddCustomAuthentication(GetTokenConfiguration());
var postgresqlSection = builder.Configuration.GetSection("PostgreSQL");
builder.Services.InjectMiddlewareData(postgresqlSection);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwagger();
builder.Services.AddCors(CORS_POLICY_NAME);
builder.Services.AddResponseCompression();
builder.Services.AddServices();

var app = builder.Build();

app.UseSwagger();

app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "SearchVault Middleware API");
    options.RoutePrefix = string.Empty;
    options.SupportedSubmitMethods([SubmitMethod.Delete, SubmitMethod.Get, SubmitMethod.Post, SubmitMethod.Put]);
    options.DocExpansion(DocExpansion.None);
});

app.UseAuthorization();
app.UseCors(CORS_POLICY_NAME);
app.MapControllers();
app.ApplyDbMigrations();
app.Run();

TokenConfiguration GetTokenConfiguration()
{
    string secret = builder.Configuration["JWT:Secret"] ?? string.Empty;
    string issuer = builder.Configuration["JWT:Issuer"] ?? string.Empty;
    string audience = builder.Configuration["JWT:Audience"] ?? string.Empty;

    if (string.IsNullOrWhiteSpace(issuer))
        throw new ArgumentNullException("Issuer name is not provided in the API JWT configurations section. Check the appsettings or configmaps.");

    return new TokenConfiguration(secret, issuer, audience);
}