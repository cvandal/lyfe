using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Lyfe.Models;
using Newtonsoft.Json;

namespace Lyfe.Tests
{
    public static class OktaClient
    {
        public static async Task<string> GetAccessToken(Okta okta)
        {
            using var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(okta.Url);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));

            var formData = new List<string>
            {
                $"grant_type={Uri.EscapeDataString("client_credentials")}",
                $"scope={Uri.EscapeDataString("api")}",
                $"client_id={Uri.EscapeDataString(okta.ClientId)}",
                $"client_secret={Uri.EscapeDataString(okta.ClientSecret)}"
            };
            var body = new StringContent(string.Join("&", formData), Encoding.UTF8, "application/x-www-form-urlencoded");

            var response = await httpClient.PostAsync("v1/token", body);
            response.IsSuccessStatusCode.Should().BeTrue();

            var result = JsonConvert.DeserializeObject<AccessToken>(await response.Content.ReadAsStringAsync());

            return result.access_token;
        }
    }

    public class AccessToken
    {
        public string access_token { get; set; }
    }
}
