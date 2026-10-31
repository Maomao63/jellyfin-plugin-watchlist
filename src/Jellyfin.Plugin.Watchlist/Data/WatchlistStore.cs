using System.Collections.Concurrent;
using System.Text.Json;
using MediaBrowser.Common.Configuration;
using Microsoft.Extensions.Logging;

namespace Jellyfin.Plugin.Watchlist.Data;

/// <summary>
/// Stores one JSON file per user in {DataPath}/watchlist/{userId}.json.
/// </summary>
public class WatchlistStore
{
    public const int MaxNameLength = 60;

    private static readonly JsonSerializerOptions s_jsonOptions = new() { WriteIndented = true };

    private readonly string _folder;
    private readonly ILogger<WatchlistStore> _logger;
    private readonly ConcurrentDictionary<Guid, SemaphoreSlim> _locks = new();

    public WatchlistStore(IApplicationPaths applicationPaths, ILogger<WatchlistStore> logger)
    {
        _folder = Path.Combine(applicationPaths.DataPath, "watchlist");
        _logger = logger;
        MigrateLegacyFolder(Path.Combine(applicationPaths.DataPath, "merkliste"));
    }

    /// <summary>
    /// Reads the list. New users get a default category.
    /// </summary>
    public async Task<UserWatchlist> GetAsync(Guid userId)
    {
        var gate = GetLock(userId);
        await gate.WaitAsync().ConfigureAwait(false);
        try
        {
            return await LoadAsync(userId).ConfigureAwait(false);
        }
        finally
        {
            gate.Release();
        }
    }

    /// <summary>
    /// Loads the list, applies a change and saves it atomically.
    /// </summary>
    public async Task<T> UpdateAsync<T>(Guid userId, Func<UserWatchlist, T> change)
    {
        var gate = GetLock(userId);
        await gate.WaitAsync().ConfigureAwait(false);
        try
        {
            var list = await LoadAsync(userId).ConfigureAwait(false);
            var result = change(list);
            await SaveAsync(userId, list).ConfigureAwait(false);
            return result;
        }
        finally
        {
            gate.Release();
        }
    }

    /// <summary>
    /// Version 1.0 was called "Merkliste" and stored its data in {DataPath}/merkliste.
    /// </summary>
    private void MigrateLegacyFolder(string legacyFolder)
    {
        try
        {
            if (Directory.Exists(legacyFolder) && !Directory.Exists(_folder))
            {
                Directory.Move(legacyFolder, _folder);
                _logger.LogInformation("Watchlist: moved data from {Old} to {New}", legacyFolder, _folder);
            }
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "Watchlist: could not move data from {Old}", legacyFolder);
        }
    }

    private SemaphoreSlim GetLock(Guid userId) => _locks.GetOrAdd(userId, _ => new SemaphoreSlim(1, 1));

    private string GetPath(Guid userId) => Path.Combine(_folder, userId.ToString("N") + ".json");

    private async Task<UserWatchlist> LoadAsync(Guid userId)
    {
        var path = GetPath(userId);
        if (!File.Exists(path))
        {
            var fresh = new UserWatchlist();
            var name = Plugin.Instance?.Configuration.DefaultCategoryName;
            fresh.Categories.Add(new Category { Name = string.IsNullOrWhiteSpace(name) ? "Watch later" : name.Trim() });
            return fresh;
        }

        try
        {
            await using var stream = File.OpenRead(path);
            var list = await JsonSerializer.DeserializeAsync<UserWatchlist>(stream, s_jsonOptions).ConfigureAwait(false);
            return list ?? new UserWatchlist();
        }
        catch (JsonException ex)
        {
            // Keep a broken file instead of overwriting it.
            var broken = path + ".broken-" + DateTime.UtcNow.ToString("yyyyMMddHHmmss", System.Globalization.CultureInfo.InvariantCulture);
            _logger.LogError(ex, "Watchlist file {Path} is broken, moved to {Broken}", path, broken);
            File.Move(path, broken);
            return new UserWatchlist();
        }
    }

    private async Task SaveAsync(Guid userId, UserWatchlist list)
    {
        Directory.CreateDirectory(_folder);
        var path = GetPath(userId);
        var tmp = path + ".tmp";
        await using (var stream = File.Create(tmp))
        {
            await JsonSerializer.SerializeAsync(stream, list, s_jsonOptions).ConfigureAwait(false);
        }

        File.Move(tmp, path, overwrite: true);
    }
}
