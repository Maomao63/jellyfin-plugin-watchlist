using System.Reflection;
using Jellyfin.Plugin.Watchlist.Data;
using MediaBrowser.Controller.Library;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Jellyfin.Plugin.Watchlist.Api;

/// <summary>
/// REST API of the watchlist. Every user only sees their own list.
/// </summary>
[ApiController]
[Route("Watchlist")]
[Authorize]
public class WatchlistController : ControllerBase
{
    // Claim that holds the Jellyfin user id (InternalClaimTypes.UserId).
    private const string UserIdClaim = "Jellyfin-UserId";

    private readonly WatchlistStore _store;
    private readonly ILibraryManager _libraryManager;

    public WatchlistController(WatchlistStore store, ILibraryManager libraryManager)
    {
        _store = store;
        _libraryManager = libraryManager;
    }

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<UserWatchlist>> Get()
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        return await _store.GetAsync(userId).ConfigureAwait(false);
    }

    [HttpPost("Categories")]
    public async Task<ActionResult<Category>> CreateCategory([FromBody] NameRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var name = CleanName(request.Name);
        if (name is null)
        {
            return BadRequest("Name is missing or too long.");
        }

        Category? created = null;
        var duplicate = await _store.UpdateAsync(userId, list =>
        {
            if (list.Categories.Any(c => string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            created = new Category { Name = name };
            list.Categories.Add(created);
            return false;
        }).ConfigureAwait(false);

        if (duplicate)
        {
            return Conflict("A category with this name already exists.");
        }

        return created!;
    }

    [HttpPost("Categories/{categoryId}/Rename")]
    public async Task<ActionResult> RenameCategory([FromRoute] Guid categoryId, [FromBody] NameRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var name = CleanName(request.Name);
        if (name is null)
        {
            return BadRequest("Name is missing or too long.");
        }

        var result = await _store.UpdateAsync(userId, list =>
        {
            var category = list.Categories.FirstOrDefault(c => c.Id == categoryId);
            if (category is null)
            {
                return StatusCodes.Status404NotFound;
            }

            if (list.Categories.Any(c => c.Id != categoryId && string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase)))
            {
                return StatusCodes.Status409Conflict;
            }

            category.Name = name;
            return StatusCodes.Status204NoContent;
        }).ConfigureAwait(false);

        return StatusCode(result);
    }

    [HttpDelete("Categories/{categoryId}")]
    public async Task<ActionResult> DeleteCategory([FromRoute] Guid categoryId)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var removed = await _store.UpdateAsync(userId, list => list.Categories.RemoveAll(c => c.Id == categoryId)).ConfigureAwait(false);
        return removed > 0 ? NoContent() : NotFound();
    }

    [HttpPost("Categories/Order")]
    public async Task<ActionResult> OrderCategories([FromBody] OrderRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        await _store.UpdateAsync(userId, list =>
        {
            // Ignore unknown ids, append categories that are missing.
            var ordered = request.Ids
                .Distinct()
                .Select(id => list.Categories.FirstOrDefault(c => c.Id == id))
                .Where(c => c is not null)
                .Cast<Category>()
                .ToList();
            ordered.AddRange(list.Categories.Where(c => !ordered.Contains(c)));
            list.Categories = ordered;
            return true;
        }).ConfigureAwait(false);

        return NoContent();
    }

    /// <summary>
    /// Sets the categories of an item. An empty list removes the item everywhere.
    /// </summary>
    [HttpPost("Items/{itemId}")]
    public async Task<ActionResult<UserWatchlist>> SetItem([FromRoute] Guid itemId, [FromBody] SetItemRequest request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        if (request.CategoryIds.Count > 0 && _libraryManager.GetItemById(itemId) is null)
        {
            return NotFound("Item not found.");
        }

        var wanted = request.CategoryIds.ToHashSet();
        return await _store.UpdateAsync(userId, list =>
        {
            foreach (var category in list.Categories)
            {
                var has = category.Items.Any(i => i.ItemId == itemId);
                if (wanted.Contains(category.Id) && !has)
                {
                    category.Items.Add(new Entry { ItemId = itemId });
                }
                else if (!wanted.Contains(category.Id) && has)
                {
                    category.Items.RemoveAll(i => i.ItemId == itemId);
                }
            }

            return list;
        }).ConfigureAwait(false);
    }

    [HttpGet("client.js")]
    [AllowAnonymous]
    public ActionResult GetScript() => Resource("watchlist.js", "application/javascript");

    [HttpGet("client.css")]
    [AllowAnonymous]
    public ActionResult GetStyle() => Resource("watchlist.css", "text/css");

    private ActionResult Resource(string name, string contentType)
    {
        var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream($"Jellyfin.Plugin.Watchlist.Web.{name}");
        if (stream is null)
        {
            return NotFound();
        }

        Response.Headers.CacheControl = "public, max-age=3600";
        return File(stream, contentType + "; charset=utf-8");
    }

    private static string? CleanName(string? name)
    {
        var trimmed = name?.Trim();
        return string.IsNullOrEmpty(trimmed) || trimmed.Length > WatchlistStore.MaxNameLength ? null : trimmed;
    }

    private bool TryGetUserId(out Guid userId)
    {
        var value = User.FindFirst(UserIdClaim)?.Value;
        return Guid.TryParse(value, out userId) && userId != Guid.Empty;
    }
}
