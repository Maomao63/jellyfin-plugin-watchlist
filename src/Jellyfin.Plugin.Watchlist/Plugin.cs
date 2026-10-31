using Jellyfin.Plugin.Watchlist.Configuration;
using MediaBrowser.Common.Configuration;
using MediaBrowser.Common.Plugins;
using MediaBrowser.Model.Serialization;

namespace Jellyfin.Plugin.Watchlist;

/// <summary>
/// Watchlist: an extra tab on the home screen plus a bookmark button next to the favorite heart.
/// </summary>
public class Plugin : BasePlugin<PluginConfiguration>
{
    public Plugin(IApplicationPaths applicationPaths, IXmlSerializer xmlSerializer)
        : base(applicationPaths, xmlSerializer)
    {
        Instance = this;
    }

    public static Plugin? Instance { get; private set; }

    public override string Name => "Watchlist";

    public override Guid Id => Guid.Parse("941c7fff-f84c-452c-9d64-80d6b0ff62e6");

    public override string Description => "Personal watchlist with custom categories as a tab on the home screen.";
}
