#!/usr/bin/env bash
# Downloads the jellyfin-web stylesheets, themes and icon font used by test.html from a Jellyfin server.
# Usage: ./fetch-jellyfin-css.sh http://your-jellyfin:8096
# The file names contain build hashes; adjust test.html if your jellyfin-web version differs.
set -euo pipefail
BASE="${1:?Jellyfin URL, e.g. http://localhost:8096}/web"
cd "$(dirname "$0")"
mkdir -p web/themes/{dark,light,appletv,purplehaze}
for f in 1133.03edf3bb7ee048ee10be.css main.jellyfin.d0fe7ebed50c35511f89.css books.6b7ab6a1096d9e9f9f51.css \
         90993.4504a59950367db8b4f3.css 47472.ead193e1e4096120377c.css home-tsx.d3bf094b69e3b7e9a426.css \
         MaterialIcons-Regular.2d8017489da689caedc1.woff2 MaterialIcons-Regular.08cefa1bc6566a650da7.woff; do
    curl -fsS -o "web/$f" "$BASE/$f"
done
for t in dark light appletv purplehaze; do curl -fsS -o "web/themes/$t/theme.css" "$BASE/themes/$t/theme.css"; done
curl -fsS -o web/themes/purplehaze/bg.jpg "$BASE/themes/purplehaze/bg.jpg" || true
# Optional: ElegantFin for the "elegantfin" theme
curl -fsSL -o web/elegantfin.css "https://cdn.jsdelivr.net/gh/lscambo13/ElegantFin@main/Theme/ElegantFin-jellyfin-theme-build-latest-minified.css" || true
cp test.html web/test.html
ln -sf ../../../src/Jellyfin.Plugin.Watchlist/Web/watchlist.js web/watchlist.js
ln -sf ../../../src/Jellyfin.Plugin.Watchlist/Web/watchlist.css web/watchlist.css
echo "Ready: open web/test.html?theme=dark&mode=tab (see README.md)"
