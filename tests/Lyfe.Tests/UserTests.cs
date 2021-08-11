using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;
using Xunit.Sdk;

namespace Lyfe.Tests
{
    [Collection("Setup Collection")]
    public class UserTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        public UserTests(Setup setup, WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.CreateClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", setup.AccessToken);
        }

        [Fact]
        public async Task CanCreateUser()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);

            user.Id.Should().Be(id);
        }

        [Fact]
        public async Task CanNotCreateUserWithTheSameId()
        {
            var id = Guid.NewGuid().ToString();

            await LyfeClient.CreateUser(_httpClient, id);

            await Assert.ThrowsAsync<XunitException>(() => LyfeClient.CreateUser(_httpClient, id));
        }

        [Fact]
        public async Task CanGetUser()
        {
            var id = Guid.NewGuid().ToString();
            await LyfeClient.CreateUser(_httpClient, id);
            var user = await LyfeClient.GetUser(_httpClient, id);

            user.Id.Should().Be(id);
        }
    }
}
