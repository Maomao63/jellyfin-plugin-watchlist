# UI test page

Static page that rebuilds the Jellyfin 12.4 home screen (tab bar, Modern top bar, cards, details button)
with a mocked `ApiClient`/server, so `watchlist.js`/`watchlist.css` can be checked against the real
jellyfin-web stylesheets and themes without signing in.

```bash
./fetch-jellyfin-css.sh http://your-jellyfin:8096
./shot.sh dark-tab   "theme=dark&mode=tab"
./shot.sh light-dlg  "theme=light&mode=dialog"
./shot.sh modern     "theme=dark&modern=1&mode=modernnav&lang=de"
```

Query parameters:

| Parameter | Values |
| --- | --- |
| `theme` | `dark`, `light`, `appletv`, `purplehaze`, `elegantfin` |
| `mode` | `home`, `tab`, `manage`, `dialog`, `legacyback`, `modernnav`, `modernfav` |
| `modern=1` | Modern layout top bar, legacy header hidden (`noskin=1`: legacy header removed) |
| `lang=de` | German UI |

`shot.sh` prints a JSON result (tab injected, bookmark buttons, visible tab content, nav links) and saves a
screenshot in `out/`. `web/` and `out/` are not committed.
