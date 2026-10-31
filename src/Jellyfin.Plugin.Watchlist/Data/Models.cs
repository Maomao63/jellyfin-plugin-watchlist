using System.Text.Json.Serialization;

namespace Jellyfin.Plugin.Watchlist.Data;

/// <summary>
/// Watchlist of one user.
/// </summary>
public class UserWatchlist
{
    [JsonPropertyName("version")]
    public int Version { get; set; } = 1;

    [JsonPropertyName("categories")]
    public List<Category> Categories { get; set; } = new();
}

/// <summary>
/// A category created by the user.
/// </summary>
public class Category
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; } = Guid.NewGuid();

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [JsonPropertyName("items")]
    public List<Entry> Items { get; set; } = new();
}

/// <summary>
/// A bookmarked Jellyfin item (movie, series, season, episode ...).
/// </summary>
public class Entry
{
    [JsonPropertyName("itemId")]
    public Guid ItemId { get; set; }

    [JsonPropertyName("addedAt")]
    public DateTime AddedAt { get; set; } = DateTime.UtcNow;
}

public class NameRequest
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
}

public class OrderRequest
{
    [JsonPropertyName("ids")]
    public List<Guid> Ids { get; set; } = new();
}

public class SetItemRequest
{
    [JsonPropertyName("categoryIds")]
    public List<Guid> CategoryIds { get; set; } = new();
}
