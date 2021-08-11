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
    public class WeightTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        public WeightTests(Setup setup, WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.CreateClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", setup.AccessToken);
        }

        [Fact]
        public async Task CanCreateWeight()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);
            var weight = await LyfeClient.CreateWeight(_httpClient, user.Id, 80);

            weight.CurrentWeight.Should().Be(80);
        }

        [Fact]
        public async Task CanNotCreateWeightWithTheSameDateTime()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);

            await LyfeClient.CreateWeight(_httpClient, user.Id, 80);
            await Assert.ThrowsAsync<XunitException>(() => LyfeClient.CreateWeight(_httpClient, user.Id, 80));
        }

        [Fact]
        public async Task CanGetWeight()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);
            var weight = await LyfeClient.CreateWeight(_httpClient, user.Id, 80);

            weight = await LyfeClient.GetWeight(_httpClient, weight);
            weight.CurrentWeight.Should().Be(80);
        }

        [Fact]
        public async Task CanUpdateWeight()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);

            var weight = await LyfeClient.CreateWeight(_httpClient, user.Id, 80);
            weight.CurrentWeight.Should().Be(80);

            weight = await LyfeClient.UpdateWeight(_httpClient, weight.Id, user.Id, 70);
            weight.CurrentWeight.Should().Be(70);
        }
    }
}
