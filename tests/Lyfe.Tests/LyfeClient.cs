using System;
using System.Net.Http;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Lyfe.Models;
using Newtonsoft.Json;

namespace Lyfe.Tests
{
    public class LyfeClient
    {
        public static async Task<User> CreateUser(HttpClient httpClient, string id)
        {
            var user = new User()
            {
                Id = id,
                GivenName = "Paige",
                FamilyName = "Turner"
            };
            var body = new StringContent(JsonConvert.SerializeObject(user), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await httpClient.PostAsync("/api/users/", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<User>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<User> GetUser(HttpClient httpClient, string id)
        {
            var response = await httpClient.GetAsync($"/api/users/{id}");
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<User>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Weight> CreateWeight(HttpClient httpClient, string userId, double currentWeight)
        {
            var weight = new Weight()
            {
                UserId = userId,
                DateTime = DateTime.Today,
                CurrentWeight = currentWeight,
                GoalWeight = 70
            };
            var body = new StringContent(JsonConvert.SerializeObject(weight), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await httpClient.PostAsync("/api/weights/", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Weight>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Weight> GetWeight(HttpClient httpClient, Weight weight)
        {
            var response = await httpClient.GetAsync($"/api/weights/{weight.Id}");
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Weight>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Weight> UpdateWeight(HttpClient httpClient, int weightId, string userId, double currentWeight)
        {
            var weight = new Weight()
            {
                Id = weightId,
                UserId = userId,
                DateTime = DateTime.Today,
                CurrentWeight = currentWeight,
                GoalWeight = 70
            };
            var body = new StringContent(JsonConvert.SerializeObject(weight), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await httpClient.PutAsync($"/api/weights/{weightId}", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Weight>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Exercise> CreateExercise(HttpClient httpClient, string userId, string name)
        {
            var exercise = new Exercise()
            {
                UserId = userId,
                Name = name,
                Weight = 80,
                Reps = 8,
                Sets = 4,
                DayOfWeek = DayOfWeek.Monday
            };
            var body = new StringContent(JsonConvert.SerializeObject(exercise), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await httpClient.PostAsync("/api/exercises/", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Exercise>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Exercise> GetExercise(HttpClient httpClient, Exercise exercise)
        {
            var response = await httpClient.GetAsync($"/api/exercises/{exercise.Id}");
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Exercise>(await response.Content.ReadAsStringAsync());
        }

        public static async Task<Exercise> UpdateExercise(HttpClient httpClient, int exerciseId, string userId, string name)
        {
            var exercise = new Exercise()
            {
                Id = exerciseId,
                UserId = userId,
                Name = name,
                Weight = 80,
                Reps = 8,
                Sets = 4,
                DayOfWeek = DayOfWeek.Monday
            };
            var body = new StringContent(JsonConvert.SerializeObject(exercise), Encoding.UTF8, MediaTypeNames.Application.Json);

            var response = await httpClient.PutAsync($"/api/exercises/{exerciseId}", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            return JsonConvert.DeserializeObject<Exercise>(await response.Content.ReadAsStringAsync());
        }
    }
}
