using MediaBrowser.Model.Plugins;

namespace Jellyfin.Plugin.Watchlist.Configuration;

/// <summary>
/// Plugin settings. The watchlists themselves are stored per user in {DataPath}/watchlist/.
/// </summary>
public class PluginConfiguration : BasePluginConfiguration
{
    /// <summary>
    /// Gets or sets the name of the category that is created for new users.
    /// </summary>
    public string DefaultCategoryName { get; set; } = "Watch later";
}
