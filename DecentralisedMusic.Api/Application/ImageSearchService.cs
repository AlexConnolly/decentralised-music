using HtmlAgilityPack;
using Newtonsoft.Json.Linq;

namespace DecentralisedMusic.Api.Application
{
    public static class ImageSearchService
    {
        private static readonly HttpClient client = new HttpClient();

        static ImageSearchService()
        {
            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3");
            client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
            client.DefaultRequestHeaders.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
        }

        public static async Task<string> GetFirstImageUrlAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                searchTerm = "";

            string searchUrl = $"https://duckduckgo.com/?q={Uri.EscapeDataString(searchTerm)}&iax=images&ia=images";
            var response = await client.GetStringAsync(searchUrl);

            HtmlDocument doc = new HtmlDocument();
            doc.LoadHtml(response);

            var scriptNode = doc.DocumentNode.SelectSingleNode("//script[contains(text(),'var results =')]");
            if (scriptNode == null) return null;

            var scriptText = scriptNode.InnerText;
            var startIndex = scriptText.IndexOf("var results =", StringComparison.Ordinal);
            if (startIndex == -1) return null;

            startIndex = scriptText.IndexOf('[', startIndex);
            var endIndex = scriptText.IndexOf(";", startIndex);
            var jsonText = scriptText.Substring(startIndex, endIndex - startIndex);

            var jsonData = JArray.Parse(jsonText);
            return jsonData[0]["image"].ToString();
        }
    }
}
