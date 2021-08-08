using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Lyfe.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using Newtonsoft.Json;
using Xunit;

namespace Lyfe.Tests
{
    [Collection("Setup Collection")]
    [TestCaseOrderer("Lyfe.Tests.TestPriorityOrderer", "Lyfe.Tests")]
    public class UserTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        private const string Id = "abc123";

        public UserTests(Setup setup, WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.CreateClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", setup.AccessToken);
        }

        [Fact, TestPriority(0)]
        public async Task CanCreateUser()
        {
            var user = new User()
            {
                Id = Id,
                GivenName = "Paige",
                FamilyName = "Turner",
                Weights = new List<Weight>(),
                Exercises = new List<Exercise>()
            };
            var body = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await _httpClient.PostAsync("/api/users/", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            var result = JsonConvert.DeserializeObject<User>(await response.Content.ReadAsStringAsync());
            result.Id.Should().Be(Id);
        }
    }
}
