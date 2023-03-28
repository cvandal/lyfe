using Auth0.AuthenticationApi;
using Auth0.AuthenticationApi.Models;
using Lyfe.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Lyfe.Api.Tests;

public class CustomWebApplicationFactory<TProgram> :
    WebApplicationFactory<TProgram> where TProgram : class
{
    private readonly IConfiguration _configuration;

    public CustomWebApplicationFactory()
    {
        _configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile("appsettings.Development.json", optional: true, reloadOnChange: true)
            .Build();
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.AddSingleton<ILyfeDbContextOptions>(new LyfeDbContextOptions()
            {
                DbPath = "lyfe.test.db"
            });
        });
    }

    public async Task<string> GetAccessToken()
    {
        var client = new AuthenticationApiClient(_configuration["Auth0:Domain"]);
        var request = new ClientCredentialsTokenRequest()
        {
            ClientId = _configuration["Auth0:ClientId"],
            ClientSecret = _configuration["Auth0:ClientSecret"],
            Audience = _configuration["Auth0:Audience"]
        };
        var response = await client.GetTokenAsync(request);

        return response.AccessToken;
    }
}
