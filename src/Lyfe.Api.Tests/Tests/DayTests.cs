using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Mime;
using FluentAssertions;
using Lyfe.Core.Models;
using Xunit;

namespace Lyfe.Api.Tests.Tests;

public class DayTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public DayTests(CustomWebApplicationFactory<Program> factory)
    {
        var token = factory.GetAccessToken().Result;

        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
    }

    [Fact]
    public async Task GetDayReturnsNonEmptyList()
    {
        var response = await _client.GetAsync("/api/day");
        response.EnsureSuccessStatusCode();

        var days = await response.Content.ReadFromJsonAsync<List<Day>>();
        days.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ExpectedDayIsEquivalentToActualDay()
    {
        var id = 32;
        var expectedDay = new Day()
        {
            Id = id,
            Name = "Monday",
            Description = "Chest, Shoulders & Triceps",
            Exercises = new List<Exercise>()
            {
                new Exercise()
                {
                    Id = 10,
                    DayId = 32,
                    Name = "Triceps Rope Pressdown",
                    Weight = 0.0,
                    Reps = 12,
                    Sets = 3
                }
            }
        };

        var response = await _client.GetAsync($"/api/day/{id}");
        response.EnsureSuccessStatusCode();

        var actualDay = await response.Content.ReadFromJsonAsync<Day>();
        actualDay.Should().BeEquivalentTo(expectedDay);
    }

    [Fact]
    public async Task CanCreateAndDeleteDay()
    {
        var day = new Day()
        {
            Name = "Foo",
            Description = "Bar"
        };

        var createResponse = await _client.PostAsJsonAsync("/api/day", day);
        createResponse.EnsureSuccessStatusCode();

        var createDuplicateResponse = await _client.PostAsJsonAsync("/api/day", day);
        createDuplicateResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var createdDay = await createResponse.Content.ReadFromJsonAsync<Day>();
        day.Id = createdDay.Id;

        var deleteResponse = await _client.DeleteAsync($"/api/day/{day.Id}");
        deleteResponse.EnsureSuccessStatusCode();
    }
}
