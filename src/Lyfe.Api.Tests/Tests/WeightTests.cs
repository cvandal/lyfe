using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Mime;
using FluentAssertions;
using Lyfe.Core.Models;
using Xunit;

namespace Lyfe.Api.Tests.Tests;

public class WeightTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public WeightTests(CustomWebApplicationFactory<Program> factory)
    {
        var token = factory.GetAccessToken().Result;

        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
    }

    [Fact]
    public async Task GetWeightReturnsNonEmptyList()
    {
        var response = await _client.GetAsync("/api/weight");
        response.EnsureSuccessStatusCode();

        var weights = await response.Content.ReadFromJsonAsync<List<Weight>>();
        weights.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ExpectedWeightIsEquivalentToActualWeight()
    {
        var id = 1;
        var expectedWeight = new Weight()
        {
            Id = id,
            CurrentDate = DateTime.Parse("2022-12-29 06:06:06"),
            CurrentWeight = 89,
            GoalWeight = 75
        };

        var response = await _client.GetAsync($"/api/weight/{id}");
        response.EnsureSuccessStatusCode();

        var actualWeight = await response.Content.ReadFromJsonAsync<Weight>();
        actualWeight.Should().BeEquivalentTo(expectedWeight);
    }

    [Fact]
    public async Task CanCreateUpdateAndDeleteWeight()
    {
        var weight1 = new Weight()
        {
            CurrentDate = DateTime.Parse("2023-01-01 00:00:00"),
            CurrentWeight = 7,
            GoalWeight = 7
        };

        var weight2 = new Weight()
        {
            CurrentDate = DateTime.Parse("2023-01-01 00:00:00"),
            CurrentWeight = 7,
            GoalWeight = 8
        };

        var createResponse = await _client.PostAsJsonAsync("/api/weight", weight1);
        createResponse.EnsureSuccessStatusCode();

        var createDuplicateResponse = await _client.PostAsJsonAsync("/api/weight", weight1);
        createDuplicateResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var createdWeight = await createResponse.Content.ReadFromJsonAsync<Weight>();
        weight1.Id = createdWeight.Id;

        var patchResponse = await _client.PatchAsJsonAsync($"/api/weight/{weight1.Id}", weight2);
        patchResponse.EnsureSuccessStatusCode();

        var deleteResponse = await _client.DeleteAsync($"/api/weight/{weight1.Id}");
        deleteResponse.EnsureSuccessStatusCode();
    }
}
