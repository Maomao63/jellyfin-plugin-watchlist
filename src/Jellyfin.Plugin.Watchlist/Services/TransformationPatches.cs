using Newtonsoft.Json;

namespace Jellyfin.Plugin.Watchlist.Services;

/// <summary>
/// Called by the File Transformation plugin whenever index.html is served.
/// </summary>
public static class TransformationPatches
{
    public static string IndexHtml(PatchRequestPayload payload)
    {
        var contents = payload.Contents ?? string.Empty;
        if (contents.Contains("Watchlist/client.js", StringComparison.Ordinal))
        {
            return contents;
        }

        var version = typeof(Plugin).Assembly.GetName().Version?.ToString() ?? "1";

        // Relative to /web/ so it also works with a base URL.
        var css = $"<link rel=\"stylesheet\" href=\"../Watchlist/client.css?v={version}\">";
        var js = $"<script defer src=\"../Watchlist/client.js?v={version}\"></script>";

        return contents
            .Replace("</head>", css + "</head>", StringComparison.Ordinal)
            .Replace("</body>", js + "</body>", StringComparison.Ordinal);
    }
}

/// <summary>
/// Payload format used by File Transformation.
/// </summary>
public class PatchRequestPayload
{
    [JsonProperty("contents")]
    public string? Contents { get; set; }
}
