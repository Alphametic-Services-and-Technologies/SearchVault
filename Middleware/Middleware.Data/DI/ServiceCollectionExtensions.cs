﻿using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Middleware.Data.Configuration;
using Middleware.Data.Repositories;
using Middleware.Data.Repositories.Interfaces;
using System.Reflection;

namespace Middleware.Data.DI
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection InjectMiddlewareData(this IServiceCollection services, IConfigurationSection configurationSection)
        {
            var migrationsAssembly = typeof(MiddlewareDbContext).GetTypeInfo().Assembly.GetName().Name;

            services.AddDbContext<MiddlewareDbContext>(options =>
            options.UseNpgsql(GetDbConfiguration(configurationSection).ConnectionString,
            optionsBuilder =>
            {
                optionsBuilder.MigrationsAssembly(migrationsAssembly);
                optionsBuilder.EnableRetryOnFailure(maxRetryCount: 15,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorCodesToAdd: null);
            }));

            services.AddScoped<IMigrationRepository, MigrationRepository>();
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            return services;
        }

        private static DbConfiguration GetDbConfiguration(IConfigurationSection configurationSection)
        {
            var host = configurationSection["host"];
            var port = configurationSection["port"];
            var username = configurationSection["username"];
            var password = configurationSection["password"];
            var middlewareDbName = configurationSection["MiddlewareDbName"];
            return new DbConfiguration(host, port, username, password, middlewareDbName);
        }
    }
}
