using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Middleware.API.Configurations;
using Middleware.API.Services;
using Middleware.API.Services.Interfaces;
using System.Reflection;
using System.Text;

namespace Middleware.API.DI
{
    internal static class ServiceCollectionExtensions
    {
        public static void AddCustomAuthentication(this IServiceCollection services, TokenConfiguration tokenConfiguration)
        {
            services.AddSingleton(tokenConfiguration);

            // Add authentication
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = tokenConfiguration.Issuer,
                    ValidAudience = tokenConfiguration.Audience,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenConfiguration.Secret))
                };
            });
        }

        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                string assemblyVersion = string.Empty;
                var assembly = Assembly.GetEntryAssembly();

                if (assembly != null)
                {
                    var versionAttribute = assembly.GetCustomAttribute<AssemblyFileVersionAttribute>();
                    assemblyVersion = versionAttribute == null ? string.Empty : versionAttribute.Version;
                }

                options.SwaggerDoc("v1", new OpenApiInfo { Title = "SearchVault Middleware API", Version = assemblyVersion });
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Standard Authorization header using the Bearer scheme. Example: \"bearer {token}\"",
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });
        }

        public static IServiceCollection AddCors(this IServiceCollection services, string policyName)
        {
            return services.AddCors(o => o.AddPolicy(policyName, builder =>
            {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));
        }

        public static void AddServices(this IServiceCollection services)
        {
            //Scoped
            services.AddScoped<IMigrationService, MigrationService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IDocsService, DocsService>();
        }
    }
}
