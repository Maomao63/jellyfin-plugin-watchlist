#!/usr/bin/env bash
# Builds, uploads a GitHub release and adds the version to manifest.json.
# Usage: ./release.sh   (version from the .csproj, changelog from build.json)
# Versioning: small changes/fixes bump the third part (1.4.0.0 -> 1.4.1.0 -> 1.4.2.0),
# new features the second (1.5.0.0), breaking changes the first.
set -euo pipefail
cd "$(dirname "$0")"
REPO=Maomao63/jellyfin-plugin-watchlist

./build.sh
VERSION=$(sed -n 's:.*<Version>\(.*\)</Version>.*:\1:p' src/Jellyfin.Plugin.Watchlist/Jellyfin.Plugin.Watchlist.csproj)
ZIP="dist/watchlist_${VERSION}.zip"
TAG="v${VERSION}"
URL="https://github.com/${REPO}/releases/download/${TAG}/watchlist_${VERSION}.zip"
CHANGELOG=$(python3 -c "import json;print(json.load(open('build.json'))['changelog'])")

if gh release view "$TAG" --repo "$REPO" >/dev/null 2>&1; then
    echo "Release $TAG already exists - raise <Version> in the .csproj first." >&2
    exit 1
fi

git push origin HEAD
gh release create "$TAG" "$ZIP" --repo "$REPO" --title "Watchlist $VERSION" --notes "$CHANGELOG"

python3 - "$ZIP" "$VERSION" "$URL" <<'PY'
import hashlib, json, sys, datetime
zip_path, version, url = sys.argv[1:]
info = json.load(open("build.json"))
entry = {
    "version": version,
    "changelog": info["changelog"],
    "targetAbi": info["targetAbi"],
    "sourceUrl": url,
    "checksum": hashlib.md5(open(zip_path, "rb").read()).hexdigest(),
    "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
}
try:
    manifest = json.load(open("manifest.json"))
except FileNotFoundError:
    manifest = []
if not manifest:
    manifest = [{"versions": []}]
plugin = manifest[0]
plugin.update({
    "guid": info["guid"],
    "name": info["name"],
    "description": info["description"],
    "overview": info["overview"],
    "owner": info["owner"],
    "category": info["category"],
    "imageUrl": "https://raw.githubusercontent.com/Maomao63/jellyfin-plugin-watchlist/main/logo.png",
})
plugin["versions"] = [entry] + [v for v in plugin.get("versions", []) if v["version"] != version]
manifest = [plugin]
json.dump(manifest, open("manifest.json", "w"), indent=2, ensure_ascii=False)
open("manifest.json", "a").write("\n")
PY

git add manifest.json
git commit -m "Release ${VERSION}"
git push origin HEAD
echo "Released $TAG"
