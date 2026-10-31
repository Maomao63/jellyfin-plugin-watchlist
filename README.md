<p align="center"><img src="logo.png" alt="Watchlist for Jellyfin" width="640"></p>

# Watchlist for Jellyfin

A personal **watchlist with categories** for Jellyfin.

- Adds a **Watchlist** tab next to *Home* and *Favorites* on the home screen
- Adds a **bookmark button** right next to every favorite heart – on details pages, in season/episode lists and on cards
- Clicking the bookmark opens a small dialog: tick one or more categories or create a new one on the spot
- Works for movies, series, seasons and episodes
- Create, rename, reorder and delete categories
- Filter by category, hide watched items, sort by date added or title
- Every user has their own list
- English UI, German when Jellyfin is set to German
- Follows the colors of your Jellyfin theme

## Compatibility

- **Layouts:** the default *Modern* layout of Jellyfin 12 and the *Legacy* layouts (desktop/mobile)
- **Built-in themes:** Dark, Light, Apple TV, Blue Radiance, Purple Haze, WMC – colors are taken from the theme palette
- **CSS themes:** tested with [ElegantFin](https://github.com/lscambo13/ElegantFin) (the tab gets a matching icon);
  other CSS themes should work as long as they keep Jellyfin's standard tab and button classes
- **TV layout:** should work, but has not been tested on TV devices or with a remote yet

## Requirements

- Jellyfin **12.4** or newer
- The [File Transformation](https://github.com/IAmParadox27/jellyfin-plugin-file-transformation) plugin
  (used to load the watchlist script into the web UI without modifying Jellyfin's files)

## Installation

1. In Jellyfin open **Dashboard → Plugins → Repositories** (in older layouts: *Catalog → ⚙ Settings*) and add these two repositories
   (skip the second one if you already use File Transformation):

   | Name | URL |
   | --- | --- |
   | Watchlist | `https://raw.githubusercontent.com/Maomao63/jellyfin-plugin-watchlist/main/manifest.json` |
   | IAmParadox27 | `https://www.iamparadox.dev/jellyfin/plugins/manifest.json` |

2. Open the catalog and install **File Transformation** and **Watchlist**.
3. Restart Jellyfin.
4. Reload the web UI (Ctrl+F5). The **Watchlist** tab appears on the home screen.

No configuration is needed.

## Where is the data stored?

One JSON file per user in `<jellyfin data>/watchlist/<user id>.json` (in Docker usually `/config/data/watchlist/`).
The data stays when the plugin is updated.

## Clients

The watchlist tab and bookmark buttons are part of the **web UI** (browser, Jellyfin Media Player and other
clients that use jellyfin-web). Native apps with their own UI (e.g. Swiftfin, Findroid, Android TV) do not show them.

## Building

Requires the .NET 10 SDK.

```bash
./build.sh      # -> dist/watchlist_<version>.zip
./release.sh    # maintainers: GitHub release + manifest.json update
```

## API

All endpoints require a signed-in user and only touch that user's list.

| Method | Path | Body |
| --- | --- | --- |
| GET | `/Watchlist` | – |
| POST | `/Watchlist/Categories` | `{ "name": "..." }` |
| POST | `/Watchlist/Categories/{id}/Rename` | `{ "name": "..." }` |
| DELETE | `/Watchlist/Categories/{id}` | – |
| POST | `/Watchlist/Categories/Order` | `{ "ids": ["...", "..."] }` |
| POST | `/Watchlist/Items/{itemId}` | `{ "categoryIds": ["..."] }` (empty = remove) |

## License

GPL-3.0
