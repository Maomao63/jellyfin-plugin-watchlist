/* Watchlist for Jellyfin: home screen tab + bookmark button next to the favorite heart. */
(function () {
    'use strict';

    if (window.__watchlistLoaded) return;
    window.__watchlistLoaded = true;

    var SESSION_KEY = 'watchlist-tab-active';
    var PREFS_KEY = 'watchlist-prefs';

    // ---------- Translations (English default, German if Jellyfin/browser is German) ----------
    var STRINGS = {
        en: {
            tab: 'Watchlist',
            add: 'Add to watchlist',
            onList: 'On your watchlist – change categories',
            dialogTitle: 'Add to watchlist',
            newCategory: 'New category …',
            create: 'Create',
            removeAll: 'Remove from watchlist',
            done: 'Done',
            noCategoriesDialog: 'No categories yet. Create one below.',
            exists: 'A category with this name already exists.',
            error: 'Watchlist: error ({0})',
            unknown: 'unknown',
            loading: 'Loading watchlist …',
            all: 'All',
            hidePlayed: 'Hide watched',
            sortNewest: 'Recently added',
            sortOldest: 'First added',
            sortTitle: 'Title A–Z',
            sortLabel: 'Sort',
            categories: 'Categories',
            noCategories: 'No categories yet. Create one under “Categories” above.',
            emptySection: 'Nothing here yet. Click the bookmark next to the heart on any movie, series, season or episode.',
            emptyCategory: 'Nothing in “{0}” yet.',
            changeCategories: 'Change categories',
            removeFrom: 'Remove from “{0}”',
            moveUp: 'Move up',
            moveDown: 'Move down',
            deleteCategory: 'Delete category',
            renameHint: 'To rename, edit the name and press Enter.',
            name: 'Name',
            confirmDelete: 'Delete category “{0}”?',
            confirmDeleteItems: ' The {0} items in it will be removed from this category.',
            removed: 'Removed',
            deleted: 'Category deleted',
            created: 'Category created',
            renamed: 'Renamed',
            defaultCategory: 'Watch later',
            movies: 'Movies',
            shows: 'Series',
            anime: 'Anime',
            other: 'Other',
            defaultLocked: 'The default category cannot be renamed or deleted.',
            showAll: 'Show all'
        },
        de: {
            tab: 'Merkliste',
            add: 'Zur Merkliste',
            onList: 'Auf der Merkliste – Kategorien ändern',
            dialogTitle: 'Zur Merkliste',
            newCategory: 'Neue Kategorie …',
            create: 'Anlegen',
            removeAll: 'Von der Merkliste entfernen',
            done: 'Fertig',
            noCategoriesDialog: 'Noch keine Kategorie. Lege unten eine an.',
            exists: 'Diese Kategorie gibt es schon.',
            error: 'Merkliste: Fehler ({0})',
            unknown: 'unbekannt',
            loading: 'Merkliste wird geladen …',
            all: 'Alle',
            hidePlayed: 'Gesehene ausblenden',
            sortNewest: 'Zuletzt hinzugefügt',
            sortOldest: 'Zuerst hinzugefügt',
            sortTitle: 'Titel A–Z',
            sortLabel: 'Sortierung',
            categories: 'Kategorien',
            noCategories: 'Noch keine Kategorien. Lege oben unter „Kategorien“ eine an.',
            emptySection: 'Hier ist noch nichts. Klicke bei einem Film, einer Serie, Staffel oder Folge auf das Lesezeichen neben dem Herz.',
            emptyCategory: 'In „{0}“ ist noch nichts.',
            changeCategories: 'Kategorien ändern',
            removeFrom: 'Aus „{0}“ entfernen',
            moveUp: 'Nach oben',
            moveDown: 'Nach unten',
            deleteCategory: 'Kategorie löschen',
            renameHint: 'Umbenennen: Namen ändern und Enter drücken.',
            name: 'Name',
            confirmDelete: 'Kategorie „{0}“ löschen?',
            confirmDeleteItems: ' Die {0} Einträge darin werden aus dieser Kategorie entfernt.',
            removed: 'Entfernt',
            deleted: 'Kategorie gelöscht',
            created: 'Kategorie angelegt',
            renamed: 'Umbenannt',
            defaultCategory: 'Später ansehen',
            movies: 'Filme',
            shows: 'Serien',
            anime: 'Anime',
            other: 'Sonstiges',
            defaultLocked: 'Die Standardkategorie kann nicht umbenannt oder gelöscht werden.',
            showAll: 'Alle anzeigen'
        }
    };

    function lang() {
        var l = (document.documentElement.getAttribute('lang') || navigator.language || 'en').toLowerCase();
        return l.indexOf('de') === 0 ? 'de' : 'en';
    }

    function t(key, arg) {
        var text = (STRINGS[lang()] || STRINGS.en)[key] || STRINGS.en[key] || key;
        return arg === undefined ? text : text.replace('{0}', arg);
    }
    var SKIP_TYPES = ['Person', 'Genre', 'MusicGenre', 'Studio', 'TvChannel', 'Program', 'Playlist', 'UserView', 'CollectionFolder'];

    var state = {
        userId: null,
        list: null,              // { categories: [{ id, name, items: [{ itemId, addedAt }] }] }
        itemCats: new Map(),     // itemId -> Set(categoryId)
        loading: null,
        filter: 'all',
        manage: false,
        lastPopstate: 0,
        urlOpened: null
    };

    var prefs = loadPrefs();

    // ---------- Helpers ----------

    function normId(id) {
        return (id || '').toString().replace(/-/g, '').toLowerCase();
    }

    function esc(text) {
        return (text == null ? '' : String(text))
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    // Only touch classes when needed: every class change wakes the MutationObserver.
    function setClass(el, cls, on) {
        if (el.classList.contains(cls) !== on) el.classList.toggle(cls, on);
    }

    function loadPrefs() {
        try {
            return Object.assign({ hidePlayed: false, sort: 'added-desc', collapsed: {} }, JSON.parse(localStorage.getItem(PREFS_KEY) || '{}'));
        } catch (e) {
            return { hidePlayed: false, sort: 'added-desc', collapsed: {} };
        }
    }

    function savePrefs() {
        try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefs)); } catch (e) { /* ignore */ }
    }

    function session(key, value) {
        try {
            if (value === undefined) return sessionStorage.getItem(key);
            sessionStorage.setItem(key, value);
        } catch (e) { /* ignore */ }
        return null;
    }

    function client() {
        return window.ApiClient;
    }

    function ready() {
        var c = client();
        return !!(c && c.accessToken && c.accessToken() && c.getCurrentUserId && c.getCurrentUserId());
    }

    function authHeader() {
        return 'MediaBrowser Token="' + client().accessToken() + '"';
    }

    function api(method, path, body) {
        var url = client().getUrl('Watchlist' + (path ? '/' + path : ''));
        var opts = { method: method, headers: { Authorization: authHeader() } };
        if (body !== undefined) {
            opts.headers['Content-Type'] = 'application/json';
            opts.body = JSON.stringify(body);
        }
        return fetch(url, opts).then(function (res) {
            if (!res.ok) {
                return res.text().then(function (body) {
                    var err = new Error(body || ('HTTP ' + res.status));
                    err.status = res.status;
                    throw err;
                });
            }
            return res.status === 204 ? null : res.json();
        });
    }

    function toast(text) {
        var el = document.createElement('div');
        el.className = 'wlToast';
        el.textContent = text;
        document.body.appendChild(el);
        requestAnimationFrame(function () { el.classList.add('wlToast-visible'); });
        setTimeout(function () {
            el.classList.remove('wlToast-visible');
            setTimeout(function () { el.remove(); }, 300);
        }, 2200);
    }

    function errorText(err) {
        if (err && err.status === 409) return t('exists');
        return t('error', (err && err.message) || t('unknown'));
    }

    // ---------- Data ----------

    function applyList(list) {
        state.list = list || { categories: [] };
        state.itemCats = new Map();
        state.list.categories.forEach(function (cat) {
            cat.items.forEach(function (entry) {
                var id = normId(entry.itemId);
                if (!state.itemCats.has(id)) state.itemCats.set(id, new Set());
                state.itemCats.get(id).add(cat.id);
            });
        });
        refreshButtons();
    }

    function loadList(force) {
        if (!ready()) return Promise.resolve(null);
        if (state.list && !force) return Promise.resolve(state.list);
        if (state.loading) return state.loading;
        state.loading = api('GET', '')
            .then(function (list) { applyList(list); return state.list; })
            .finally(function () { state.loading = null; });
        return state.loading;
    }

    function setItemCategories(itemId, categoryIds) {
        return api('POST', 'Items/' + encodeURIComponent(itemId), { categoryIds: categoryIds })
            .then(function (list) { applyList(list); rerenderTab(); return list; });
    }

    function createCategory(name) {
        return api('POST', 'Categories', { name: name }).then(function (cat) {
            return loadList(true).then(function () { rerenderTab(); return cat; });
        });
    }

    function fetchItems(ids) {
        var c = client();
        var chunks = [];
        for (var i = 0; i < ids.length; i += 80) chunks.push(ids.slice(i, i + 80));
        return Promise.all(chunks.map(function (chunk) {
            var url = c.getUrl('Items', {
                userId: c.getCurrentUserId(),
                ids: chunk.join(','),
                fields: 'PrimaryImageAspectRatio',
                enableUserData: true,
                enableImageTypes: 'Primary,Thumb'
            });
            return fetch(url, { headers: { Authorization: authHeader() } })
                .then(function (r) { return r.ok ? r.json() : { Items: [] }; })
                .then(function (r) { return r.Items || []; });
        })).then(function (parts) {
            var map = new Map();
            parts.forEach(function (items) {
                items.forEach(function (item) { map.set(normId(item.Id), item); });
            });
            return map;
        });
    }

    // ---------- Bookmark button next to the heart ----------

    function itemIdFor(ratingBtn) {
        var id = ratingBtn.getAttribute('data-id');
        if (id) return normId(id);
        // Details page: read the id from the URL
        if (ratingBtn.classList.contains('btnUserRating')) {
            var query = (location.hash.split('?')[1] || location.search.slice(1));
            return normId(new URLSearchParams(query).get('id'));
        }
        return '';
    }

    function isExcluded(ratingBtn) {
        if (ratingBtn.closest('.nowPlayingBar, .videoOsdBottom, #videoOsdPage, .osdControls, .wlOverlay')) return true;
        var type = ratingBtn.getAttribute('data-itemtype');
        return !!type && SKIP_TYPES.indexOf(type) !== -1;
    }

    function createBookmarkButton(ratingBtn) {
        var btn = document.createElement('button');
        btn.type = 'button';
        var classes = ratingBtn.className.split(/\s+/).filter(function (c) {
            return c && ['btnUserRating', 'hide', 'ratingbutton-withrating'].indexOf(c) === -1;
        });
        classes.push('wlBookmarkBtn');
        btn.className = classes.join(' ');
        btn.title = t('add');
        btn.setAttribute('aria-label', t('add'));
        // Gleicher innerer Aufbau wie das Herz, nur anderes Symbol
        btn.innerHTML = ratingBtn.innerHTML;
        var icon = btn.querySelector('.material-icons');
        if (icon) {
            icon.classList.remove('favorite', 'ratingbutton-icon-withrating');
            icon.classList.add('wlBookmarkIcon');
            icon.textContent = '';
        } else {
            btn.innerHTML = '<span class="material-icons wlBookmarkIcon" aria-hidden="true"></span>';
        }
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var id = itemIdFor(ratingBtn);
            if (id) openDialog(id);
        });
        return btn;
    }

    function scanButtons() {
        var ratingButtons = document.querySelectorAll('button[is="emby-ratingbutton"], button.btnUserRating');
        ratingButtons.forEach(function (ratingBtn) {
            if (isExcluded(ratingBtn)) return;
            var next = ratingBtn.nextElementSibling;
            var btn = next && next.classList.contains('wlBookmarkBtn') ? next : null;
            if (!btn) {
                btn = createBookmarkButton(ratingBtn);
                ratingBtn.insertAdjacentElement('afterend', btn);
            }
            setClass(btn, 'hide', ratingBtn.classList.contains('hide'));
            var id = itemIdFor(ratingBtn);
            if (btn.getAttribute('data-wl-id') !== id) btn.setAttribute('data-wl-id', id);
        });
    }

    function refreshButtons() {
        document.querySelectorAll('.wlBookmarkBtn').forEach(function (btn) {
            var id = btn.getAttribute('data-wl-id');
            var active = !!id && state.itemCats.has(id);
            setClass(btn, 'wlActive', active);
            var title = active ? t('onList') : t('add');
            if (btn.title !== title) btn.title = title;
        });
    }

    // ---------- Category dialog ----------

    function openDialog(itemId) {
        loadList().then(function () {
            showDialog(itemId);
        }).catch(function (err) { toast(errorText(err)); });
    }

    function showDialog(itemId) {
        var old = document.querySelector('.wlOverlay');
        if (old) old.remove();

        var overlay = document.createElement('div');
        overlay.className = 'wlOverlay';
        overlay.innerHTML =
            '<div class="wlDialog" role="dialog" aria-modal="true" aria-label="' + esc(t('dialogTitle')) + '">' +
            '  <div class="wlDialogHead">' +
            '    <span class="material-icons wlBookmarkIcon wlHeadIcon" aria-hidden="true"></span>' +
            '    <div><h3>' + esc(t('dialogTitle')) + '</h3><div class="wlDialogItem">&nbsp;</div></div>' +
            '  </div>' +
            '  <div class="wlCatList"></div>' +
            '  <form class="wlNewCat">' +
            '    <input type="text" maxlength="60" placeholder="' + esc(t('newCategory')) + '" aria-label="' + esc(t('newCategory')) + '">' +
            '    <button type="submit" class="wlBtn">' + esc(t('create')) + '</button>' +
            '  </form>' +
            '  <div class="wlDialogFoot">' +
            '    <button type="button" class="wlBtn wlBtnDanger wlRemoveAll">' + esc(t('removeAll')) + '</button>' +
            '    <button type="button" class="wlBtn wlBtnPrimary wlClose">' + esc(t('done')) + '</button>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(overlay);

        var listEl = overlay.querySelector('.wlCatList');
        var removeAll = overlay.querySelector('.wlRemoveAll');
        var busy = false;

        function current() {
            return Array.from(state.itemCats.get(itemId) || []);
        }

        function render() {
            var selected = current();
            if (!state.list.categories.length) {
                listEl.innerHTML = '<div class="wlEmptyCats">' + esc(t('noCategoriesDialog')) + '</div>';
            } else {
                listEl.innerHTML = state.list.categories.map(function (cat) {
                    var on = selected.indexOf(cat.id) !== -1;
                    return '<label class="wlCatRow' + (on ? ' wlCatRow-on' : '') + '">' +
                        '<input type="checkbox" data-cat="' + esc(cat.id) + '"' + (on ? ' checked' : '') + '>' +
                        '<span class="wlCatName">' + esc(catName(cat)) + '</span>' +
                        '<span class="wlCatCount">' + cat.items.length + '</span>' +
                        '</label>';
                }).join('');
            }
            removeAll.classList.toggle('hide', selected.length === 0);
        }

        function save(ids) {
            if (busy) return Promise.resolve();
            busy = true;
            overlay.classList.add('wlBusy');
            return setItemCategories(itemId, ids)
                .catch(function (err) { toast(errorText(err)); })
                .finally(function () { busy = false; overlay.classList.remove('wlBusy'); render(); });
        }

        function close() {
            document.removeEventListener('keydown', onKey, true);
            overlay.remove();
        }

        function onKey(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                close();
            }
        }

        listEl.addEventListener('change', function (e) {
            var box = e.target;
            if (!box.matches('input[type=checkbox]')) return;
            var ids = current().filter(function (id) { return id !== box.getAttribute('data-cat'); });
            if (box.checked) ids.push(box.getAttribute('data-cat'));
            save(ids);
        });

        overlay.querySelector('.wlNewCat').addEventListener('submit', function (e) {
            e.preventDefault();
            var input = e.target.querySelector('input');
            var name = input.value.trim();
            if (!name) return;
            createCategory(name).then(function (cat) {
                input.value = '';
                return save(current().concat([cat.id]));
            }).catch(function (err) { toast(errorText(err)); });
        });

        removeAll.addEventListener('click', function () { save([]); });
        overlay.querySelector('.wlClose').addEventListener('click', close);
        overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });
        document.addEventListener('keydown', onKey, true);

        render();
        var first = overlay.querySelector('input');
        if (first) first.focus({ preventScroll: true });

        // Load the item title
        fetchItems([itemId]).then(function (map) {
            var item = map.get(itemId);
            if (!item) return;
            overlay.querySelector('.wlDialogItem').textContent = titleFor(item).join(' – ');
        }).catch(function () { /* optional */ });
    }

    // ---------- Home screen tab ----------

    function homeActive() {
        // After visiting a library page Jellyfin may keep the old home page hidden in the DOM
        // next to the new one, so look for the visible one.
        var page = document.querySelector('#indexPage:not(.hide)');
        if (!page) return null;
        // The home page sets this class on the (in the Modern layout hidden) legacy header while it is active.
        var header = document.querySelector('.skinHeader');
        if (header && header.classList.contains('noHomeButtonHeader')) return page;
        // Fallback: decide by the URL
        return /^#\/home(\.html)?(\?|$)/.test(location.hash) ? page : null;
    }

    function ensureTab() {
        var page = homeActive();
        if (!page) return;
        var content = ensureContent(page);
        if (!content) return;

        var slider = document.querySelector('.skinHeader .headerTabs .emby-tabs-slider');
        if (!slider) return;

        var own = slider.querySelector('.wlTabButton');
        if (content.classList.contains('is-active') && !(own && own.classList.contains('emby-tab-button-active'))) {
            content.classList.remove('is-active');
        }
        if (own) return;
        var native = slider.querySelectorAll('.emby-tab-button:not(.wlTabButton)');
        if (native.length < 2) return;

        var index = native.length;
        content.setAttribute('data-index', String(index));

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'emby-tab-button emby-button wlTabButton';
        btn.setAttribute('data-index', String(index));
        btn.innerHTML = '<div class="emby-button-foreground">' + esc(t('tab')) + '</div>';
        // Themes like ElegantFin show icons in front of the tabs -> add one here too
        var before = getComputedStyle(native[0], '::before').content;
        if (before && before !== 'none' && before !== 'normal' && before !== '""') btn.classList.add('wlWithIcon');
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            activateTab();
        });
        slider.appendChild(btn);

        var tabs = slider.closest('[is="emby-tabs"], .emby-tabs');
        if (tabs && !tabs.__wlHooked) {
            tabs.__wlHooked = true;
            tabs.addEventListener('beforetabchange', function () {
                session(SESSION_KEY, '0');
                document.querySelectorAll('.wlTabContent').forEach(function (own) { own.classList.remove('is-active'); });
            });
        }

        // After going back from a details page, return to the watchlist tab
        if (session(SESSION_KEY) === '1' && Date.now() - state.lastPopstate < 4000) activateTab();
    }

    function ensureContent(page) {
        var existing = page.querySelector('.wlTabContent');
        if (existing) return existing;
        var homeTab = page.querySelector('#homeTab') || page.querySelector('.tabContent');
        if (!homeTab || !homeTab.parentNode) return null;
        var content = document.createElement('div');
        content.className = 'tabContent pageTabContent wlTabContent';
        content.setAttribute('data-index', '2');
        homeTab.parentNode.appendChild(content);
        return content;
    }

    function activateTab() {
        var page = homeActive();
        var content = page && page.querySelector('.wlTabContent');
        var btn = document.querySelector('.wlTabButton');
        if (!content) return;

        if (btn) {
            btn.parentNode.querySelectorAll('.emby-tab-button-active').forEach(function (b) {
                b.classList.remove('emby-tab-button-active');
            });
            btn.classList.add('emby-tab-button-active');
        }
        content.parentNode.querySelectorAll('.tabContent').forEach(function (tab) {
            tab.classList.toggle('is-active', tab === content);
        });
        session(SESSION_KEY, '1');
        renderTab(content);
    }

    // ---------- "Watchlist" link next to "Favorites" (Modern layout app bar, side menus) ----------
    // The Modern layout of Jellyfin 12 has no visible home tab bar; Favorites is a link to #/home?tab=1.
    // Our link points to #/home?tab=2, which opens the watchlist tab.

    var BOOKMARK_PATH = 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z';
    var BOOKMARK_FILLED_PATH = 'M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z';

    function homeTabParam() {
        var query = location.hash.split('?')[1] || '';
        return new URLSearchParams(query).get('tab');
    }

    function isFavoritesLink(a) {
        var href = a.getAttribute('href') || '';
        return /(^|\/)home(\.html)?\?tab=1$/.test(href.replace(/^#/, '')) && !a.classList.contains('wlNavLink');
    }

    function makeNavLink(fav) {
        // Side menus wrap the link in its own <li>: clone that wrapper too
        var host = fav.parentElement && fav.parentElement.tagName === 'LI' && fav.parentElement.children.length === 1 ? fav.parentElement : fav;
        var clone = host.cloneNode(true);
        var link = clone.tagName === 'A' ? clone : clone.querySelector('a');
        link.classList.add('wlNavLink');
        link.setAttribute('href', (fav.getAttribute('href') || '#/home?tab=1').replace(/tab=1$/, 'tab=2'));
        link.removeAttribute('aria-current');
        link.removeAttribute('id');

        // Icon: MUI svg or Jellyfin material-icons span
        var svgPath = link.querySelector('svg path');
        if (svgPath) {
            svgPath.setAttribute('d', BOOKMARK_PATH);
            svgPath.closest('svg').querySelectorAll('path').forEach(function (p, i) { if (i > 0) p.remove(); });
        }
        var icon = link.querySelector('.material-icons');
        if (icon) {
            icon.classList.remove('favorite');
            icon.classList.add('wlBookmarkIcon');
            icon.textContent = '';
        }

        // Label: first visible text node gets our name
        var walker = document.createTreeWalker(link, NodeFilter.SHOW_TEXT);
        var done = false;
        var node;
        while ((node = walker.nextNode())) {
            if (!node.nodeValue.trim() || node.parentElement.closest('svg, .material-icons')) continue;
            node.nodeValue = done ? '' : t('tab');
            done = true;
        }
        link.title = t('tab');

        link.addEventListener('click', function (e) {
            // Already on the home page: switch directly (the router ignores a link to the same page)
            if (homeActive() && homeTabParam() === '2') {
                e.preventDefault();
                activateTab();
            }
            // MUI side menu: close it like a normal navigation would
            var backdrop = document.querySelector('.MuiDrawer-root .MuiBackdrop-root');
            if (backdrop) setTimeout(function () { backdrop.click(); }, 0);
        });
        return clone;
    }

    function ensureNavLinks() {
        document.querySelectorAll('a[href*="tab=1"]').forEach(function (fav) {
            if (!isFavoritesLink(fav) || fav.closest('.wlPage, .wlOverlay')) return;
            var host = fav.parentElement && fav.parentElement.tagName === 'LI' && fav.parentElement.children.length === 1 ? fav.parentElement : fav;
            var next = host.nextElementSibling;
            if (next && (next.classList.contains('wlNavLink') || next.querySelector(':scope > .wlNavLink'))) return;
            // React may have moved our link: drop stale copies in this container
            host.parentElement.querySelectorAll(':scope > .wlNavLink, :scope > li > .wlNavLink').forEach(function (old) {
                (old.parentElement.tagName === 'LI' && old.parentElement !== host.parentElement ? old.parentElement : old).remove();
            });
            host.insertAdjacentElement('afterend', makeNavLink(fav));
        });

        // Highlight our link while the watchlist is shown
        var active = !!tabVisible();
        document.querySelectorAll('.wlNavLink').forEach(function (link) {
            setClass(link, 'wlNavLink-active', active);
            var path = link.querySelector('svg path');
            var d = active ? BOOKMARK_FILLED_PATH : BOOKMARK_PATH;
            if (path && path.getAttribute('d') !== d) path.setAttribute('d', d);
        });
    }

    // Open the tab when the URL says #/home?tab=2 (once per visit, so native tabs can still be chosen)
    function openFromUrl() {
        if (!homeActive()) {
            state.urlOpened = null;
            return;
        }
        if (homeTabParam() !== '2') {
            // Without a tab bar nothing else hides our content when the URL switches to another tab
            if (state.urlOpened && !document.querySelector('.wlTabButton')) {
                document.querySelectorAll('.wlTabContent.is-active').forEach(function (own) { own.classList.remove('is-active'); });
            }
            state.urlOpened = null;
            return;
        }
        if (state.urlOpened === location.hash) return;
        if (!homeActive().querySelector('.wlTabContent')) return;
        state.urlOpened = location.hash;
        activateTab();
    }

    function tabVisible() {
        var page = homeActive();
        return page ? page.querySelector('.wlTabContent.is-active') : null;
    }

    function rerenderTab() {
        var content = tabVisible();
        if (content) renderTab(content);
    }

    function titleFor(item) {
        if (item.Type === 'Episode') {
            var code = '';
            if (item.ParentIndexNumber != null) code += 'S' + item.ParentIndexNumber;
            if (item.IndexNumber != null) code += 'E' + item.IndexNumber;
            return [item.SeriesName || item.Name, (code ? code + ' · ' : '') + item.Name];
        }
        if (item.Type === 'Season') return [item.SeriesName || item.Name, item.Name];
        var sub = item.ProductionYear ? String(item.ProductionYear) : '';
        if (item.Type === 'Series' && item.EndDate && item.ProductionYear) {
            var end = new Date(item.EndDate).getFullYear();
            if (end && end !== item.ProductionYear) sub += '–' + end;
        }
        return [item.Name, sub];
    }

    function imageFor(item) {
        var c = client();
        var opts = { maxHeight: 480, quality: 90 };
        if (item.ImageTags && item.ImageTags.Primary && item.Type !== 'Episode') {
            return c.getUrl('Items/' + item.Id + '/Images/Primary', Object.assign({ tag: item.ImageTags.Primary }, opts));
        }
        if (item.SeriesId && item.SeriesPrimaryImageTag) {
            return c.getUrl('Items/' + item.SeriesId + '/Images/Primary', Object.assign({ tag: item.SeriesPrimaryImageTag }, opts));
        }
        if (item.ImageTags && item.ImageTags.Primary) {
            return c.getUrl('Items/' + item.Id + '/Images/Primary', Object.assign({ tag: item.ImageTags.Primary }, opts));
        }
        return '';
    }

    function sortEntries(entries, items) {
        var list = entries.slice();
        if (prefs.sort === 'added-asc') {
            list.sort(function (a, b) { return a.addedAt < b.addedAt ? -1 : 1; });
        } else if (prefs.sort === 'title') {
            list.sort(function (a, b) {
                var ia = items.get(normId(a.itemId)), ib = items.get(normId(b.itemId));
                return titleFor(ia).join(' ').localeCompare(titleFor(ib).join(' '), undefined, { numeric: true });
            });
        } else {
            list.sort(function (a, b) { return a.addedAt > b.addedAt ? -1 : 1; });
        }
        return list;
    }

    function visibleEntries(cat, items) {
        return sortEntries(cat.items.filter(function (e) {
            var item = items.get(normId(e.itemId));
            if (!item) return false;
            return !(prefs.hidePlayed && item.UserData && item.UserData.Played);
        }), items);
    }

    function cardHtml(item, cat) {
        var title = titleFor(item);
        var img = imageFor(item);
        var serverId = item.ServerId || client().serverId();
        var played = item.UserData && item.UserData.Played;
        var unplayed = item.UserData && item.UserData.UnplayedItemCount;
        var badge = played
            ? '<span class="wlBadge wlBadgePlayed"><span class="material-icons check" aria-hidden="true"></span></span>'
            : (unplayed ? '<span class="wlBadge">' + unplayed + '</span>' : '');
        return '<a class="wlCard" href="#/details?id=' + esc(item.Id) + '&serverId=' + esc(serverId) + '">' +
            '<div class="wlPoster"' + (img ? ' style="background-image:url(\'' + esc(img) + '\')"' : '') + '>' +
            (img ? '' : '<span class="material-icons wlNoImage" aria-hidden="true"></span>') +
            badge +
            '<div class="wlCardActions">' +
            '<button type="button" class="wlIconBtn" data-wl-edit="' + esc(normId(item.Id)) + '" title="' + esc(t('changeCategories')) + '"><span class="material-icons wlBookmarkIcon wlFilled" aria-hidden="true"></span></button>' +
            '<button type="button" class="wlIconBtn" data-wl-remove="' + esc(normId(item.Id)) + '" data-wl-cat="' + esc(cat.id) + '" title="' + esc(t('removeFrom', catName(cat))) + '"><span class="material-icons close" aria-hidden="true"></span></button>' +
            '</div></div>' +
            '<div class="wlCardTitle" title="' + esc(title[0]) + '">' + esc(title[0]) + '</div>' +
            '<div class="wlCardSub" title="' + esc(title[1]) + '">' + esc(title[1] || ' ') + '</div>' +
            '</a>';
    }

    function renderTab(content) {
        if (!content.__wlInit) {
            content.__wlInit = true;
            content.addEventListener('click', onTabClick);
            content.addEventListener('change', onTabChange);
            content.addEventListener('submit', onTabSubmit);
            content.addEventListener('toggle', onGroupToggle, true);
        }
        if (!content.querySelector('.wlPage')) {
            content.innerHTML = '<div class="wlPage"><div class="wlLoading">' + esc(t('loading')) + '</div></div>';
        }
        var token = content.__wlToken = (content.__wlToken || 0) + 1;

        loadList(true).then(function () {
            var ids = Array.from(state.itemCats.keys());
            if (!ids.length) return new Map();
            return Promise.all([fetchItems(ids), fetchAnimeIds()]).then(function (r) {
                r[1].forEach(function (id) {
                    var item = r[0].get(normId(id));
                    if (item) item.__wlAnime = true;
                });
                return r[0];
            });
        }).then(function (items) {
            if (token !== content.__wlToken) return;
            drawTab(content, items);
        }).catch(function (err) {
            content.innerHTML = '<div class="wlPage"><div class="wlEmpty">' + esc(errorText(err)) + '</div></div>';
        });
    }

    function catName(cat) {
        return cat.isDefault ? t('defaultCategory') : cat.name;
    }

    // Ids of watchlist items in an anime library (library name contains "anime"); empty on error
    function fetchAnimeIds() {
        return api('GET', 'Anime').then(function (ids) { return ids || []; }, function () { return []; });
    }

    // Groups inside the default category: anime by library, everything else by the Jellyfin item type
    var GROUPS = [
        { key: 'movies', label: 'movies', types: ['Movie'] },
        { key: 'shows', label: 'shows', types: ['Series', 'Season', 'Episode'] },
        { key: 'anime', label: 'anime', types: [] },
        { key: 'other', label: 'other', types: null }
    ];

    function groupOf(item) {
        if (item.__wlAnime) return 'anime';
        for (var i = 0; i < GROUPS.length; i++) {
            if (!GROUPS[i].types || GROUPS[i].types.indexOf(item.Type) !== -1) return GROUPS[i].key;
        }
        return 'other';
    }

    function gridHtml(cat, entries, items, row) {
        return '<div class="wlGrid' + (row ? ' wlRow' : '') + '">' + entries.map(function (e) { return cardHtml(items.get(normId(e.itemId)), cat); }).join('') + '</div>';
    }

    // "All" overview: only the most recently added items per category (per group in the default category)
    var PREVIEW_LIMIT = 8;

    // Picks the most recently added entries but keeps the order chosen in the sort menu
    function latest(entries, limit) {
        if (!limit || entries.length <= limit) return entries;
        var keep = new Set(entries.slice().sort(function (a, b) { return a.addedAt > b.addedAt ? -1 : 1; }).slice(0, limit));
        return entries.filter(function (e) { return keep.has(e); });
    }

    function entriesHtml(cat, entries, items, limit) {
        if (!cat.isDefault) return gridHtml(cat, latest(entries, limit), items, !!limit);
        var collapsed = prefs.collapsed || {};
        return GROUPS.map(function (g) {
            var all = entries.filter(function (e) { return groupOf(items.get(normId(e.itemId))) === g.key; });
            if (!all.length) return '';
            var list = latest(all, limit);
            return '<details class="wlGroup" data-wl-group="' + g.key + '"' + (collapsed[g.key] ? '' : ' open') + '>' +
                '<summary class="wlGroupTitle"><span class="material-icons wlChevron" aria-hidden="true"></span>' +
                esc(t(g.label)) + ' <span class="wlGroupCount">' + all.length + '</span></summary>' +
                gridHtml(cat, list, items, !!limit) +
                '</details>';
        }).join('');
    }

    function onGroupToggle(e) {
        var group = e.target.getAttribute && e.target.getAttribute('data-wl-group');
        if (!group) return;
        prefs.collapsed = prefs.collapsed || {};
        prefs.collapsed[group] = !e.target.open;
        savePrefs();
    }

    function drawTab(content, items) {
        var cats = state.list.categories;
        if (state.filter !== 'all' && !cats.some(function (c) { return c.id === state.filter; })) state.filter = 'all';

        var total = Array.from(state.itemCats.keys()).filter(function (id) { return items.has(id); }).length;
        var chips = '<button type="button" class="wlChip' + (state.filter === 'all' ? ' wlChip-on' : '') + '" data-wl-filter="all">' + esc(t('all')) + ' <span>' + total + '</span></button>' +
            cats.map(function (c) {
                var n = c.items.filter(function (e) { return items.has(normId(e.itemId)); }).length;
                return '<button type="button" class="wlChip' + (state.filter === c.id ? ' wlChip-on' : '') + '" data-wl-filter="' + esc(c.id) + '">' + esc(catName(c)) + ' <span>' + n + '</span></button>';
            }).join('');

        var toolbar =
            '<div class="wlToolbar">' +
            '<div class="wlChips">' + chips + '</div>' +
            '<div class="wlTools">' +
            '<label class="wlCheck"><input type="checkbox" data-wl-pref="hidePlayed"' + (prefs.hidePlayed ? ' checked' : '') + '> ' + esc(t('hidePlayed')) + '</label>' +
            '<select class="wlSelect" data-wl-pref="sort" aria-label="' + esc(t('sortLabel')) + '">' +
            '<option value="added-desc"' + (prefs.sort === 'added-desc' ? ' selected' : '') + '>' + esc(t('sortNewest')) + '</option>' +
            '<option value="added-asc"' + (prefs.sort === 'added-asc' ? ' selected' : '') + '>' + esc(t('sortOldest')) + '</option>' +
            '<option value="title"' + (prefs.sort === 'title' ? ' selected' : '') + '>' + esc(t('sortTitle')) + '</option>' +
            '</select>' +
            '<button type="button" class="wlBtn" data-wl-action="manage"><span class="material-icons settings" aria-hidden="true"></span> ' + esc(t('categories')) + '</button>' +
            '</div></div>';

        var manage = state.manage ? manageHtml() : '';

        var body;
        if (!cats.length) {
            body = '<div class="wlEmpty">' + esc(t('noCategories')) + '</div>';
        } else if (state.filter === 'all') {
            body = cats.map(function (cat) {
                var entries = visibleEntries(cat, items);
                var truncated = cat.isDefault
                    ? GROUPS.some(function (g) { return entries.filter(function (e) { return groupOf(items.get(normId(e.itemId))) === g.key; }).length > PREVIEW_LIMIT; })
                    : entries.length > PREVIEW_LIMIT;
                var more = truncated
                    ? '<button type="button" class="wlMore" data-wl-filter="' + esc(cat.id) + '">' + esc(t('showAll')) + ' (' + entries.length + ')<span class="material-icons wlChevron" aria-hidden="true"></span></button>'
                    : '';
                return '<section class="wlSection">' +
                    '<div class="wlSectionHead"><h2 class="wlSectionTitle"><button type="button" data-wl-filter="' + esc(cat.id) + '">' + esc(catName(cat)) + '</button> <span>' + entries.length + '</span></h2>' + more + '</div>' +
                    (entries.length
                        ? entriesHtml(cat, entries, items, PREVIEW_LIMIT)
                        : '<div class="wlEmptySmall">' + esc(t('emptySection')) + '</div>') +
                    '</section>';
            }).join('');
        } else {
            var cat = cats.filter(function (c) { return c.id === state.filter; })[0];
            var entries = visibleEntries(cat, items);
            body = entries.length
                ? entriesHtml(cat, entries, items)
                : '<div class="wlEmpty">' + esc(t('emptyCategory', catName(cat))) + '</div>';
        }

        content.innerHTML = '<div class="wlPage">' + toolbar + manage + body + '</div>';
    }

    function manageHtml() {
        var cats = state.list.categories;
        return '<div class="wlManage">' +
            '<form class="wlNewCat" data-wl-form="new">' +
            '<input type="text" maxlength="60" placeholder="' + esc(t('newCategory')) + '" aria-label="' + esc(t('newCategory')) + '">' +
            '<button type="submit" class="wlBtn wlBtnPrimary">' + esc(t('create')) + '</button>' +
            '</form>' +
            cats.map(function (c, i) {
                var locked = !!c.isDefault;
                return '<div class="wlManageRow' + (locked ? ' wlManageRow-default' : '') + '">' +
                    '<form data-wl-form="rename" data-wl-cat="' + esc(c.id) + '"><input type="text" maxlength="60" value="' + esc(catName(c)) + '" aria-label="' + esc(t('name')) + '"' + (locked ? ' disabled title="' + esc(t('defaultLocked')) + '"' : '') + '></form>' +
                    '<span class="wlManageCount">' + c.items.length + '</span>' +
                    '<button type="button" class="wlIconBtn" data-wl-move="-1" data-wl-cat="' + esc(c.id) + '"' + (i === 0 ? ' disabled' : '') + ' title="' + esc(t('moveUp')) + '"><span class="material-icons keyboard_arrow_up" aria-hidden="true"></span></button>' +
                    '<button type="button" class="wlIconBtn" data-wl-move="1" data-wl-cat="' + esc(c.id) + '"' + (i === cats.length - 1 ? ' disabled' : '') + ' title="' + esc(t('moveDown')) + '"><span class="material-icons keyboard_arrow_down" aria-hidden="true"></span></button>' +
                    (locked
                        ? '<span class="wlIconBtn wlLocked" title="' + esc(t('defaultLocked')) + '"><span class="material-icons lock" aria-hidden="true"></span></span>'
                        : '<button type="button" class="wlIconBtn wlDanger" data-wl-delete="' + esc(c.id) + '" title="' + esc(t('deleteCategory')) + '"><span class="material-icons delete" aria-hidden="true"></span></button>') +
                    '</div>';
            }).join('') +
            '<div class="wlHint">' + esc(t('renameHint')) + ' ' + esc(t('defaultLocked')) + '</div>' +
            '</div>';
    }

    function onTabClick(e) {
        var el = e.target.closest('[data-wl-filter],[data-wl-action],[data-wl-edit],[data-wl-remove],[data-wl-move],[data-wl-delete]');
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();

        if (el.hasAttribute('data-wl-filter')) {
            state.filter = el.getAttribute('data-wl-filter');
            rerenderTab();
        } else if (el.getAttribute('data-wl-action') === 'manage') {
            state.manage = !state.manage;
            rerenderTab();
        } else if (el.hasAttribute('data-wl-edit')) {
            openDialog(el.getAttribute('data-wl-edit'));
        } else if (el.hasAttribute('data-wl-remove')) {
            var id = el.getAttribute('data-wl-remove');
            var catId = el.getAttribute('data-wl-cat');
            var ids = Array.from(state.itemCats.get(id) || []).filter(function (c) { return c !== catId; });
            setItemCategories(id, ids).then(function () { toast(t('removed')); }).catch(function (err) { toast(errorText(err)); });
        } else if (el.hasAttribute('data-wl-move')) {
            var order = state.list.categories.map(function (c) { return c.id; });
            var from = order.indexOf(el.getAttribute('data-wl-cat'));
            var to = from + parseInt(el.getAttribute('data-wl-move'), 10);
            if (from < 0 || to < 0 || to >= order.length) return;
            order.splice(to, 0, order.splice(from, 1)[0]);
            api('POST', 'Categories/Order', { ids: order }).then(function () { rerenderTab(); }).catch(function (err) { toast(errorText(err)); });
        } else if (el.hasAttribute('data-wl-delete')) {
            var cat = state.list.categories.filter(function (c) { return c.id === el.getAttribute('data-wl-delete'); })[0];
            if (!cat) return;
            var question = t('confirmDelete', cat.name) + (cat.items.length ? t('confirmDeleteItems', cat.items.length) : '');
            if (!window.confirm(question)) return;
            api('DELETE', 'Categories/' + encodeURIComponent(cat.id)).then(function () {
                if (state.filter === cat.id) state.filter = 'all';
                toast(t('deleted'));
                rerenderTab();
            }).catch(function (err) { toast(errorText(err)); });
        }
    }

    function onTabChange(e) {
        var pref = e.target.getAttribute('data-wl-pref');
        if (!pref) return;
        prefs[pref] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        savePrefs();
        rerenderTab();
    }

    function onTabSubmit(e) {
        var form = e.target.closest('[data-wl-form]');
        if (!form) return;
        e.preventDefault();
        var input = form.querySelector('input');
        var name = input.value.trim();
        if (!name) return;
        if (form.getAttribute('data-wl-form') === 'new') {
            createCategory(name).then(function () { toast(t('created')); }).catch(function (err) { toast(errorText(err)); });
        } else {
            api('POST', 'Categories/' + encodeURIComponent(form.getAttribute('data-wl-cat')) + '/Rename', { name: name })
                .then(function () { toast(t('renamed')); rerenderTab(); })
                .catch(function (err) { toast(errorText(err)); });
        }
    }

    // ---------- Startup ----------

    // Light theme detection by text color, used as fallback when the theme has no palette variables.
    function updateThemeClass() {
        var m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(getComputedStyle(document.body || document.documentElement).color || '');
        if (!m) return;
        var luminance = (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255;
        setClass(document.documentElement, 'wl-light', luminance < 0.5);
    }

    var timer = null;
    function schedule() {
        if (timer) return;
        timer = setTimeout(function () {
            timer = null;
            if (!ready()) return;
            var uid = client().getCurrentUserId();
            if (uid !== state.userId) {
                // Another user signed in -> load their list
                state.userId = uid;
                state.list = null;
                state.itemCats = new Map();
                state.filter = 'all';
                loadList(true).catch(function () { /* retried next time */ });
            }
            updateThemeClass();
            scanButtons();
            refreshButtons();
            ensureTab();
            openFromUrl();
            ensureNavLinks();
        }, 120);
    }

    window.addEventListener('popstate', function () { state.lastPopstate = Date.now(); });
    window.addEventListener('hashchange', schedule);

    function start() {
        new MutationObserver(schedule).observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-id']
        });
        schedule();
    }

    if (document.body) start();
    else document.addEventListener('DOMContentLoaded', start);
})();
