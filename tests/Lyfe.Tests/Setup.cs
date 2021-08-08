using System;
using Lyfe.Data;
using Lyfe.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xunit;

namespace Lyfe.Tests
{
    public class Setup : IDisposable
    {
        public string AccessToken { get; }

        public Setup()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", false)
                .AddJsonFile("appsettings.Development.json", true)
                .Build();

            var context = CreateDbContext();
            context.Database.Migrate();

            var okta = configuration.GetSection("Okta").Get<Okta>();
            AccessToken = OktaClient.GetAccessToken(okta).Result;
        }

        public void Dispose()
        {
            var context = CreateDbContext();
            context.Database.EnsureDeleted();
        }

        private static LyfeDbContext CreateDbContext()
        {
            var optionsBuilder = new DbContextOptionsBuilder<LyfeDbContext>();
            optionsBuilder.UseSqlite("Data Source=Lyfe.db;");

            return new LyfeDbContext(optionsBuilder.Options);
        }
    }

    [CollectionDefinition("Setup Collection")]
    public class SetupCollection : ICollectionFixture<Setup>
    {
    }
}
