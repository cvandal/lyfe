using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Threading.Tasks;
using FluentAssertions;
using Lyfe.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;

namespace Lyfe.Tests
{
    public class UsersControllerTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        public UsersControllerTests(WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.CreateClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
        }

        [Fact]
        public async Task GetUser()
        {
            var accessToken = await Okta.GetAccessToken();
            accessToken.access_token.Should().NotBeNullOrEmpty();

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken.access_token);

            var response = await _httpClient.GetAsync($"/api/users/{Okta.Sub}");
            response.IsSuccessStatusCode.Should().BeTrue();

            var user = JsonConvert.DeserializeObject<User>(await response.Content.ReadAsStringAsync());
            user.Id.Should().Be(Okta.Sub);
        }
    }
}
