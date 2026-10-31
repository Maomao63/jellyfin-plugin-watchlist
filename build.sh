#!/usr/bin/env bash
# Builds the plugin and creates dist/watchlist_<version>.zip (installable by Jellyfin).
set -euo pipefail
cd "$(dirname "$0")"
export DOTNET_CLI_TELEMETRY_OPTOUT=1 DOTNET_NOLOGO=1

CSPROJ=src/Jellyfin.Plugin.Watchlist/Jellyfin.Plugin.Watchlist.csproj
VERSION=$(sed -n 's:.*<Version>\(.*\)</Version>.*:\1:p' "$CSPROJ")
TARGET_ABI=$(python3 -c "import json;print(json.load(open('build.json'))['targetAbi'])")
OUT="dist/Watchlist_${VERSION}"

rm -rf dist build-tmp
dotnet publish "$CSPROJ" -c Release -o build-tmp --nologo
mkdir -p "$OUT"
cp build-tmp/Jellyfin.Plugin.Watchlist.dll "$OUT/"
cp logo.png "$OUT/"
rm -rf build-tmp

python3 - "$OUT/meta.json" "$VERSION" "$TARGET_ABI" <<'PY'
import json, sys, datetime
path, version, abi = sys.argv[1:]
info = json.load(open('build.json'))
json.dump({
    "category": info["category"],
    "changelog": info["changelog"],
    "description": info["description"],
    "guid": info["guid"],
    "name": info["name"],
    "overview": info["overview"],
    "owner": info["owner"],
    "targetAbi": abi,
    "timestamp": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
    "version": version,
    "status": "Active",
    "autoUpdate": True,
    "imagePath": "",
    "assemblies": ["Jellyfin.Plugin.Watchlist.dll"],
}, open(path, "w"), indent=2, ensure_ascii=False)
PY

# Files at the zip root, like JPRM does it
python3 - "$OUT" "dist/watchlist_${VERSION}.zip" <<'PY'
import os, sys, zipfile
src, dst = sys.argv[1:]
with zipfile.ZipFile(dst, "w", zipfile.ZIP_DEFLATED) as z:
    for name in sorted(os.listdir(src)):
        z.write(os.path.join(src, name), name)
PY
echo "Built: $OUT and dist/watchlist_${VERSION}.zip"
