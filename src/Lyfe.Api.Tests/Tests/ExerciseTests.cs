using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Net.Mime;
using FluentAssertions;
using Lyfe.Core.Models;
using Xunit;

namespace Lyfe.Api.Tests.Tests;

public class ExerciseTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public ExerciseTests(CustomWebApplicationFactory<Program> factory)
    {
        var token = factory.GetAccessToken().Result;

        _client = factory.CreateClient();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        _client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
    }

    [Fact]
    public async Task GetExerciseReturnsNonEmptyList()
    {
        var response = await _client.GetAsync("/api/exercise");
        response.EnsureSuccessStatusCode();

        var exercises = await response.Content.ReadFromJsonAsync<List<Exercise>>();
        exercises.Should().NotBeEmpty();
    }

    [Fact]
    public async Task ExpectedExerciseIsEquivalentToActualExercise()
    {
        var id = 10;
        var expectedExercise = new Exercise()
        {
            Id = id,
            DayId = 32,
            Name = "Triceps Rope Pressdown",
            Weight = 0.0,
            Reps = 12,
            Sets = 3
        };

        var response = await _client.GetAsync($"/api/exercise/{id}");
        response.EnsureSuccessStatusCode();

        var actualExercise = await response.Content.ReadFromJsonAsync<Exercise>();
        actualExercise.Should().BeEquivalentTo(expectedExercise);
    }

    [Fact]
    public async Task CanCreateUpdateAndDeleteExercise()
    {
        var exercise1 = new Exercise()
        {
            DayId = 32,
            Name = "Foo",
            Weight = 0.0,
            Reps = 0,
            Sets = 0
        };

        var exercise2 = new Exercise()
        {
            DayId = 32,
            Name = "Bar",
            Weight = 1.0,
            Reps = 1,
            Sets = 1
        };

        var createResponse = await _client.PostAsJsonAsync("/api/exercise", exercise1);
        createResponse.EnsureSuccessStatusCode();

        var createDuplicateResponse = await _client.PostAsJsonAsync("/api/exercise", exercise1);
        createDuplicateResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var createdExercise = await createResponse.Content.ReadFromJsonAsync<Exercise>();
        exercise1.Id = createdExercise.Id;

        var patchResponse = await _client.PatchAsJsonAsync($"/api/exercise/{exercise1.Id}", exercise2);
        patchResponse.EnsureSuccessStatusCode();

        var deleteResponse = await _client.DeleteAsync($"/api/exercise/{exercise1.Id}");
        deleteResponse.EnsureSuccessStatusCode();
    }
}
