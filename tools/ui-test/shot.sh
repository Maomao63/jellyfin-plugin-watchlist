#!/usr/bin/env bash
# Headless screenshot + result check. Usage: ./shot.sh <name> "<query>"   e.g. ./shot.sh light-tab "theme=light&mode=tab"
D=$(cd "$(dirname "$0")" && pwd)
BROWSER=${BROWSER:-$(command -v chromium || command -v brave || command -v google-chrome-stable)}
URL="file://$D/web/test.html?$2"
mkdir -p "$D/out"
"$BROWSER" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files --window-size=${SIZE:-1300,860} --virtual-time-budget=5000 --screenshot="$D/out/$1.png" "$URL" >/dev/null 2>&1
"$BROWSER" --headless=new --disable-gpu --allow-file-access-from-files --virtual-time-budget=5000 --dump-dom "$URL" 2>/dev/null | grep -o '<title>RESULT[^<]*' | sed 's/&quot;/"/g; s/<title>//'
