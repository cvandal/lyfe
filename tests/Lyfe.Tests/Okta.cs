using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using FluentAssertions;
using Newtonsoft.Json;

namespace Lyfe.Tests
{
    public static class Okta
    {
        private const string BaseAddress = "https://dev-15114775.okta.com/oauth2/default";
        public const string Sub = "";
        private const string ClientId = "0oa1bo6xlhRpmmMSP5d7";
        private const string ClientSecret = "";

        public static async Task<AccessToken> GetAccessToken()
        {
            using var httpClient = new HttpClient();
            httpClient.BaseAddress = new Uri(BaseAddress);
            httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue(MediaTypeNames.Application.Json));

            var content = new List<string>
            {
                $"grant_type={Uri.EscapeDataString("client_credentials")}",
                $"scope={Uri.EscapeDataString("api")}",
                $"client_id={Uri.EscapeDataString(ClientId)}",
                $"client_secret={Uri.EscapeDataString(ClientSecret)}"
            };

            var response = await httpClient.PostAsync("v1/token", new StringContent(string.Join("&", content), Encoding.UTF8, "application/x-www-form-urlencoded"));
            response.IsSuccessStatusCode.Should().BeTrue();

            var accessToken = JsonConvert.DeserializeObject<AccessToken>(await response.Content.ReadAsStringAsync());

            return accessToken;
        }
    }

    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public class AccessToken
    {
        public string token_type { get; set; }
        public int expires_in { get; set; }
        public string access_token { get; set; }
        public string scope { get; set; }
    }
}
