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
    public class ExerciseTests : IClassFixture<WebApplicationFactory<Startup>>
    {
        private readonly HttpClient _httpClient;

        public ExerciseTests(Setup setup, WebApplicationFactory<Startup> factory)
        {
            _httpClient = factory.CreateClient();
            _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", setup.AccessToken);
        }

        [Fact]
        public async Task CanCreateExercise()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);
            var exercise = await LyfeClient.CreateExercise(_httpClient, user.Id, "Bench Press");

            exercise.Name.Should().Be("Bench Press");
        }

        [Fact]
        public async Task CanNotCreateExerciseWithTheSameNameAndDayOfWeek()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);

            await LyfeClient.CreateExercise(_httpClient, user.Id, "Bench Press");
            await Assert.ThrowsAsync<XunitException>(() => LyfeClient.CreateExercise(_httpClient, user.Id, "Bench Press"));
        }

        [Fact]
        public async Task CanGetExercise()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);
            var exercise = await LyfeClient.CreateExercise(_httpClient, user.Id, "Bench Press");

            exercise = await LyfeClient.GetExercise(_httpClient, exercise);
            exercise.Name.Should().Be("Bench Press");
        }

        [Fact]
        public async Task CanUpdateExercise()
        {
            var id = Guid.NewGuid().ToString();
            var user = await LyfeClient.CreateUser(_httpClient, id);

            var exercise = await LyfeClient.CreateExercise(_httpClient, user.Id, "Bench Press");
            exercise.Name.Should().Be("Bench Press");

            exercise = await LyfeClient.UpdateExercise(_httpClient, exercise.Id, user.Id, "Deadlift");
            exercise.Name.Should().Be("Deadlift");
        }
    }
}
