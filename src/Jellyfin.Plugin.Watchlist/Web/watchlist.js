/* Watchlist for Jellyfin: home screen tab + bookmark button next to the favorite heart. */
(function () {
    'use strict';

    if (window.__watchlistLoaded) return;
    window.__watchlistLoaded = true;

    var SESSION_KEY = 'watchlist-tab-active';
    var PREFS_KEY = 'watchlist-prefs';

    // ---------- Translations: follows the display language set in Jellyfin, English as fallback ----------
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
        },
        fr: {
            tab: "Ma liste",
            add: "Ajouter à ma liste",
            onList: "Dans ma liste – modifier les catégories",
            dialogTitle: "Ajouter à ma liste",
            newCategory: "Nouvelle catégorie …",
            create: "Créer",
            removeAll: "Retirer de ma liste",
            done: "Terminé",
            noCategoriesDialog: "Aucune catégorie pour l’instant. Créez-en une ci-dessous.",
            exists: "Une catégorie portant ce nom existe déjà.",
            error: "Ma liste : erreur ({0})",
            unknown: "inconnue",
            loading: "Chargement de la liste …",
            all: "Tout",
            hidePlayed: "Masquer les vus",
            sortNewest: "Ajoutés récemment",
            sortOldest: "Ajoutés en premier",
            sortTitle: "Titre A–Z",
            sortLabel: "Trier",
            categories: "Catégories",
            noCategories: "Aucune catégorie pour l’instant. Créez-en une sous « Catégories » ci-dessus.",
            emptySection: "Rien ici pour l’instant. Cliquez sur le marque-page à côté du cœur d’un film, d’une série, d’une saison ou d’un épisode.",
            emptyCategory: "Rien dans « {0} » pour l’instant.",
            changeCategories: "Modifier les catégories",
            removeFrom: "Retirer de « {0} »",
            moveUp: "Monter",
            moveDown: "Descendre",
            deleteCategory: "Supprimer la catégorie",
            renameHint: "Pour renommer, modifiez le nom et appuyez sur Entrée.",
            name: "Nom",
            confirmDelete: "Supprimer la catégorie « {0} » ?",
            confirmDeleteItems: " Les {0} éléments qu’elle contient en seront retirés.",
            removed: "Retiré",
            deleted: "Catégorie supprimée",
            created: "Catégorie créée",
            renamed: "Renommée",
            defaultCategory: "À regarder plus tard",
            movies: "Films",
            shows: "Séries",
            anime: "Anime",
            other: "Autres",
            defaultLocked: "La catégorie par défaut ne peut être ni renommée ni supprimée.",
            showAll: "Tout afficher"
        },
        es: {
            tab: "Mi lista",
            add: "Añadir a mi lista",
            onList: "En tu lista – cambiar categorías",
            dialogTitle: "Añadir a mi lista",
            newCategory: "Nueva categoría …",
            create: "Crear",
            removeAll: "Quitar de mi lista",
            done: "Listo",
            noCategoriesDialog: "Aún no hay categorías. Crea una abajo.",
            exists: "Ya existe una categoría con este nombre.",
            error: "Mi lista: error ({0})",
            unknown: "desconocido",
            loading: "Cargando la lista …",
            all: "Todo",
            hidePlayed: "Ocultar vistos",
            sortNewest: "Añadidos recientemente",
            sortOldest: "Añadidos primero",
            sortTitle: "Título A–Z",
            sortLabel: "Ordenar",
            categories: "Categorías",
            noCategories: "Aún no hay categorías. Crea una arriba en «Categorías».",
            emptySection: "Aquí no hay nada todavía. Haz clic en el marcador junto al corazón de cualquier película, serie, temporada o episodio.",
            emptyCategory: "Todavía no hay nada en «{0}».",
            changeCategories: "Cambiar categorías",
            removeFrom: "Quitar de «{0}»",
            moveUp: "Subir",
            moveDown: "Bajar",
            deleteCategory: "Eliminar categoría",
            renameHint: "Para renombrar, edita el nombre y pulsa Intro.",
            name: "Nombre",
            confirmDelete: "¿Eliminar la categoría «{0}»?",
            confirmDeleteItems: " Los {0} elementos que contiene se quitarán de esta categoría.",
            removed: "Quitado",
            deleted: "Categoría eliminada",
            created: "Categoría creada",
            renamed: "Renombrada",
            defaultCategory: "Ver más tarde",
            movies: "Películas",
            shows: "Series",
            anime: "Anime",
            other: "Otros",
            defaultLocked: "La categoría predeterminada no se puede renombrar ni eliminar.",
            showAll: "Ver todo"
        },
        it: {
            tab: "La mia lista",
            add: "Aggiungi alla mia lista",
            onList: "Nella tua lista – cambia categorie",
            dialogTitle: "Aggiungi alla mia lista",
            newCategory: "Nuova categoria …",
            create: "Crea",
            removeAll: "Rimuovi dalla mia lista",
            done: "Fatto",
            noCategoriesDialog: "Ancora nessuna categoria. Creane una qui sotto.",
            exists: "Esiste già una categoria con questo nome.",
            error: "La mia lista: errore ({0})",
            unknown: "sconosciuto",
            loading: "Caricamento della lista …",
            all: "Tutto",
            hidePlayed: "Nascondi visti",
            sortNewest: "Aggiunti di recente",
            sortOldest: "Aggiunti per primi",
            sortTitle: "Titolo A–Z",
            sortLabel: "Ordina",
            categories: "Categorie",
            noCategories: "Ancora nessuna categoria. Creane una sopra in «Categorie».",
            emptySection: "Ancora niente qui. Fai clic sul segnalibro accanto al cuore di un film, una serie, una stagione o un episodio.",
            emptyCategory: "Ancora niente in «{0}».",
            changeCategories: "Cambia categorie",
            removeFrom: "Rimuovi da «{0}»",
            moveUp: "Sposta su",
            moveDown: "Sposta giù",
            deleteCategory: "Elimina categoria",
            renameHint: "Per rinominare, modifica il nome e premi Invio.",
            name: "Nome",
            confirmDelete: "Eliminare la categoria «{0}»?",
            confirmDeleteItems: " I {0} elementi al suo interno verranno rimossi da questa categoria.",
            removed: "Rimosso",
            deleted: "Categoria eliminata",
            created: "Categoria creata",
            renamed: "Rinominata",
            defaultCategory: "Guarda più tardi",
            movies: "Film",
            shows: "Serie TV",
            anime: "Anime",
            other: "Altro",
            defaultLocked: "La categoria predefinita non può essere rinominata né eliminata.",
            showAll: "Mostra tutto"
        },
        nl: {
            tab: "Kijklijst",
            add: "Aan kijklijst toevoegen",
            onList: "Op je kijklijst – categorieën wijzigen",
            dialogTitle: "Aan kijklijst toevoegen",
            newCategory: "Nieuwe categorie …",
            create: "Aanmaken",
            removeAll: "Van kijklijst verwijderen",
            done: "Klaar",
            noCategoriesDialog: "Nog geen categorieën. Maak er hieronder een aan.",
            exists: "Er bestaat al een categorie met deze naam.",
            error: "Kijklijst: fout ({0})",
            unknown: "onbekend",
            loading: "Kijklijst laden …",
            all: "Alles",
            hidePlayed: "Bekeken verbergen",
            sortNewest: "Recent toegevoegd",
            sortOldest: "Eerst toegevoegd",
            sortTitle: "Titel A–Z",
            sortLabel: "Sorteren",
            categories: "Categorieën",
            noCategories: "Nog geen categorieën. Maak er een aan onder ‘Categorieën’ hierboven.",
            emptySection: "Hier staat nog niets. Klik op de bladwijzer naast het hartje bij een film, serie, seizoen of aflevering.",
            emptyCategory: "Nog niets in ‘{0}’.",
            changeCategories: "Categorieën wijzigen",
            removeFrom: "Verwijderen uit ‘{0}’",
            moveUp: "Omhoog",
            moveDown: "Omlaag",
            deleteCategory: "Categorie verwijderen",
            renameHint: "Om te hernoemen: wijzig de naam en druk op Enter.",
            name: "Naam",
            confirmDelete: "Categorie ‘{0}’ verwijderen?",
            confirmDeleteItems: " De {0} items erin worden uit deze categorie verwijderd.",
            removed: "Verwijderd",
            deleted: "Categorie verwijderd",
            created: "Categorie aangemaakt",
            renamed: "Hernoemd",
            defaultCategory: "Later kijken",
            movies: "Films",
            shows: "Series",
            anime: "Anime",
            other: "Overig",
            defaultLocked: "De standaardcategorie kan niet worden hernoemd of verwijderd.",
            showAll: "Alles tonen"
        },
        pt: {
            tab: "Minha lista",
            add: "Adicionar à minha lista",
            onList: "Na sua lista – alterar categorias",
            dialogTitle: "Adicionar à minha lista",
            newCategory: "Nova categoria …",
            create: "Criar",
            removeAll: "Remover da minha lista",
            done: "Concluído",
            noCategoriesDialog: "Ainda não há categorias. Crie uma abaixo.",
            exists: "Já existe uma categoria com este nome.",
            error: "Minha lista: erro ({0})",
            unknown: "desconhecido",
            loading: "Carregando a lista …",
            all: "Tudo",
            hidePlayed: "Ocultar assistidos",
            sortNewest: "Adicionados recentemente",
            sortOldest: "Adicionados primeiro",
            sortTitle: "Título A–Z",
            sortLabel: "Ordenar",
            categories: "Categorias",
            noCategories: "Ainda não há categorias. Crie uma acima em “Categorias”.",
            emptySection: "Nada aqui ainda. Clique no marcador ao lado do coração de qualquer filme, série, temporada ou episódio.",
            emptyCategory: "Ainda não há nada em “{0}”.",
            changeCategories: "Alterar categorias",
            removeFrom: "Remover de “{0}”",
            moveUp: "Mover para cima",
            moveDown: "Mover para baixo",
            deleteCategory: "Excluir categoria",
            renameHint: "Para renomear, edite o nome e pressione Enter.",
            name: "Nome",
            confirmDelete: "Excluir a categoria “{0}”?",
            confirmDeleteItems: " Os {0} itens nela serão removidos desta categoria.",
            removed: "Removido",
            deleted: "Categoria excluída",
            created: "Categoria criada",
            renamed: "Renomeada",
            defaultCategory: "Assistir mais tarde",
            movies: "Filmes",
            shows: "Séries",
            anime: "Anime",
            other: "Outros",
            defaultLocked: "A categoria padrão não pode ser renomeada nem excluída.",
            showAll: "Ver tudo"
        },
        pl: {
            tab: "Do obejrzenia",
            add: "Dodaj do listy",
            onList: "Na Twojej liście – zmień kategorie",
            dialogTitle: "Dodaj do listy",
            newCategory: "Nowa kategoria …",
            create: "Utwórz",
            removeAll: "Usuń z listy",
            done: "Gotowe",
            noCategoriesDialog: "Brak kategorii. Utwórz ją poniżej.",
            exists: "Kategoria o tej nazwie już istnieje.",
            error: "Do obejrzenia: błąd ({0})",
            unknown: "nieznany",
            loading: "Wczytywanie listy …",
            all: "Wszystko",
            hidePlayed: "Ukryj obejrzane",
            sortNewest: "Ostatnio dodane",
            sortOldest: "Najdawniej dodane",
            sortTitle: "Tytuł A–Z",
            sortLabel: "Sortuj",
            categories: "Kategorie",
            noCategories: "Brak kategorii. Utwórz ją powyżej w sekcji „Kategorie”.",
            emptySection: "Nic tu jeszcze nie ma. Kliknij zakładkę obok serca przy dowolnym filmie, serialu, sezonie lub odcinku.",
            emptyCategory: "W „{0}” nic jeszcze nie ma.",
            changeCategories: "Zmień kategorie",
            removeFrom: "Usuń z „{0}”",
            moveUp: "Przesuń w górę",
            moveDown: "Przesuń w dół",
            deleteCategory: "Usuń kategorię",
            renameHint: "Aby zmienić nazwę, edytuj ją i naciśnij Enter.",
            name: "Nazwa",
            confirmDelete: "Usunąć kategorię „{0}”?",
            confirmDeleteItems: " Elementy w niej ({0}) zostaną usunięte z tej kategorii.",
            removed: "Usunięto",
            deleted: "Kategoria usunięta",
            created: "Kategoria utworzona",
            renamed: "Zmieniono nazwę",
            defaultCategory: "Obejrzyj później",
            movies: "Filmy",
            shows: "Seriale",
            anime: "Anime",
            other: "Inne",
            defaultLocked: "Domyślnej kategorii nie można zmienić nazwy ani usunąć.",
            showAll: "Pokaż wszystko"
        },
        sv: {
            tab: "Min lista",
            add: "Lägg till i min lista",
            onList: "I din lista – ändra kategorier",
            dialogTitle: "Lägg till i min lista",
            newCategory: "Ny kategori …",
            create: "Skapa",
            removeAll: "Ta bort från min lista",
            done: "Klar",
            noCategoriesDialog: "Inga kategorier ännu. Skapa en nedan.",
            exists: "Det finns redan en kategori med det namnet.",
            error: "Min lista: fel ({0})",
            unknown: "okänt",
            loading: "Läser in listan …",
            all: "Alla",
            hidePlayed: "Dölj sedda",
            sortNewest: "Senast tillagda",
            sortOldest: "Först tillagda",
            sortTitle: "Titel A–Ö",
            sortLabel: "Sortera",
            categories: "Kategorier",
            noCategories: "Inga kategorier ännu. Skapa en under ”Kategorier” ovan.",
            emptySection: "Här finns inget ännu. Klicka på bokmärket bredvid hjärtat på en film, serie, säsong eller ett avsnitt.",
            emptyCategory: "Inget i ”{0}” ännu.",
            changeCategories: "Ändra kategorier",
            removeFrom: "Ta bort från ”{0}”",
            moveUp: "Flytta upp",
            moveDown: "Flytta ned",
            deleteCategory: "Ta bort kategori",
            renameHint: "Byt namn genom att ändra namnet och trycka på Enter.",
            name: "Namn",
            confirmDelete: "Ta bort kategorin ”{0}”?",
            confirmDeleteItems: " De {0} objekten i den tas bort från kategorin.",
            removed: "Borttagen",
            deleted: "Kategorin togs bort",
            created: "Kategorin skapades",
            renamed: "Namnet ändrades",
            defaultCategory: "Titta senare",
            movies: "Filmer",
            shows: "Serier",
            anime: "Anime",
            other: "Övrigt",
            defaultLocked: "Standardkategorin kan inte byta namn eller tas bort.",
            showAll: "Visa alla"
        },
        da: {
            tab: "Min liste",
            add: "Føj til min liste",
            onList: "På din liste – skift kategorier",
            dialogTitle: "Føj til min liste",
            newCategory: "Ny kategori …",
            create: "Opret",
            removeAll: "Fjern fra min liste",
            done: "Færdig",
            noCategoriesDialog: "Ingen kategorier endnu. Opret en nedenfor.",
            exists: "Der findes allerede en kategori med dette navn.",
            error: "Min liste: fejl ({0})",
            unknown: "ukendt",
            loading: "Indlæser listen …",
            all: "Alle",
            hidePlayed: "Skjul sete",
            sortNewest: "Senest tilføjet",
            sortOldest: "Først tilføjet",
            sortTitle: "Titel A–Å",
            sortLabel: "Sortér",
            categories: "Kategorier",
            noCategories: "Ingen kategorier endnu. Opret en under »Kategorier« ovenfor.",
            emptySection: "Her er intet endnu. Klik på bogmærket ved siden af hjertet på en film, serie, sæson eller episode.",
            emptyCategory: "Intet i »{0}« endnu.",
            changeCategories: "Skift kategorier",
            removeFrom: "Fjern fra »{0}«",
            moveUp: "Flyt op",
            moveDown: "Flyt ned",
            deleteCategory: "Slet kategori",
            renameHint: "Omdøb ved at ændre navnet og trykke på Enter.",
            name: "Navn",
            confirmDelete: "Slet kategorien »{0}«?",
            confirmDeleteItems: " De {0} elementer i den fjernes fra kategorien.",
            removed: "Fjernet",
            deleted: "Kategori slettet",
            created: "Kategori oprettet",
            renamed: "Omdøbt",
            defaultCategory: "Se senere",
            movies: "Film",
            shows: "Serier",
            anime: "Anime",
            other: "Andet",
            defaultLocked: "Standardkategorien kan ikke omdøbes eller slettes.",
            showAll: "Vis alle"
        },
        nb: {
            tab: "Min liste",
            add: "Legg til i min liste",
            onList: "På listen din – endre kategorier",
            dialogTitle: "Legg til i min liste",
            newCategory: "Ny kategori …",
            create: "Opprett",
            removeAll: "Fjern fra min liste",
            done: "Ferdig",
            noCategoriesDialog: "Ingen kategorier ennå. Opprett en nedenfor.",
            exists: "Det finnes allerede en kategori med dette navnet.",
            error: "Min liste: feil ({0})",
            unknown: "ukjent",
            loading: "Laster inn listen …",
            all: "Alle",
            hidePlayed: "Skjul sette",
            sortNewest: "Sist lagt til",
            sortOldest: "Først lagt til",
            sortTitle: "Tittel A–Å",
            sortLabel: "Sorter",
            categories: "Kategorier",
            noCategories: "Ingen kategorier ennå. Opprett en under «Kategorier» ovenfor.",
            emptySection: "Ingenting her ennå. Klikk på bokmerket ved siden av hjertet på en film, serie, sesong eller episode.",
            emptyCategory: "Ingenting i «{0}» ennå.",
            changeCategories: "Endre kategorier",
            removeFrom: "Fjern fra «{0}»",
            moveUp: "Flytt opp",
            moveDown: "Flytt ned",
            deleteCategory: "Slett kategori",
            renameHint: "Gi nytt navn ved å endre navnet og trykke Enter.",
            name: "Navn",
            confirmDelete: "Slette kategorien «{0}»?",
            confirmDeleteItems: " De {0} elementene i den fjernes fra kategorien.",
            removed: "Fjernet",
            deleted: "Kategori slettet",
            created: "Kategori opprettet",
            renamed: "Nytt navn lagret",
            defaultCategory: "Se senere",
            movies: "Filmer",
            shows: "Serier",
            anime: "Anime",
            other: "Annet",
            defaultLocked: "Standardkategorien kan ikke få nytt navn eller slettes.",
            showAll: "Vis alle"
        },
        cs: {
            tab: "K zhlédnutí",
            add: "Přidat ke zhlédnutí",
            onList: "Na seznamu – změnit kategorie",
            dialogTitle: "Přidat ke zhlédnutí",
            newCategory: "Nová kategorie …",
            create: "Vytvořit",
            removeAll: "Odebrat ze seznamu",
            done: "Hotovo",
            noCategoriesDialog: "Zatím žádné kategorie. Vytvořte ji níže.",
            exists: "Kategorie s tímto názvem už existuje.",
            error: "K zhlédnutí: chyba ({0})",
            unknown: "neznámá",
            loading: "Načítání seznamu …",
            all: "Vše",
            hidePlayed: "Skrýt zhlédnuté",
            sortNewest: "Naposledy přidané",
            sortOldest: "Nejdříve přidané",
            sortTitle: "Název A–Z",
            sortLabel: "Řadit",
            categories: "Kategorie",
            noCategories: "Zatím žádné kategorie. Vytvořte ji výše v části „Kategorie“.",
            emptySection: "Zatím tu nic není. Klikněte na záložku vedle srdce u libovolného filmu, seriálu, řady nebo epizody.",
            emptyCategory: "V „{0}“ zatím nic není.",
            changeCategories: "Změnit kategorie",
            removeFrom: "Odebrat z „{0}“",
            moveUp: "Posunout nahoru",
            moveDown: "Posunout dolů",
            deleteCategory: "Smazat kategorii",
            renameHint: "Pro přejmenování upravte název a stiskněte Enter.",
            name: "Název",
            confirmDelete: "Smazat kategorii „{0}“?",
            confirmDeleteItems: " Položky v ní ({0}) budou z této kategorie odebrány.",
            removed: "Odebráno",
            deleted: "Kategorie smazána",
            created: "Kategorie vytvořena",
            renamed: "Přejmenováno",
            defaultCategory: "Podívat se později",
            movies: "Filmy",
            shows: "Seriály",
            anime: "Anime",
            other: "Ostatní",
            defaultLocked: "Výchozí kategorii nelze přejmenovat ani smazat.",
            showAll: "Zobrazit vše"
        },
        ru: {
            tab: "Буду смотреть",
            add: "Добавить в список",
            onList: "В вашем списке – изменить категории",
            dialogTitle: "Добавить в список",
            newCategory: "Новая категория …",
            create: "Создать",
            removeAll: "Удалить из списка",
            done: "Готово",
            noCategoriesDialog: "Категорий пока нет. Создайте её ниже.",
            exists: "Категория с таким названием уже существует.",
            error: "Буду смотреть: ошибка ({0})",
            unknown: "неизвестно",
            loading: "Загрузка списка …",
            all: "Все",
            hidePlayed: "Скрыть просмотренное",
            sortNewest: "Недавно добавленные",
            sortOldest: "Добавленные первыми",
            sortTitle: "Название А–Я",
            sortLabel: "Сортировка",
            categories: "Категории",
            noCategories: "Категорий пока нет. Создайте её выше в разделе «Категории».",
            emptySection: "Здесь пока ничего нет. Нажмите на закладку рядом с сердечком у любого фильма, сериала, сезона или эпизода.",
            emptyCategory: "В «{0}» пока ничего нет.",
            changeCategories: "Изменить категории",
            removeFrom: "Удалить из «{0}»",
            moveUp: "Переместить вверх",
            moveDown: "Переместить вниз",
            deleteCategory: "Удалить категорию",
            renameHint: "Чтобы переименовать, измените название и нажмите Enter.",
            name: "Название",
            confirmDelete: "Удалить категорию «{0}»?",
            confirmDeleteItems: " Элементы в ней ({0}) будут удалены из этой категории.",
            removed: "Удалено",
            deleted: "Категория удалена",
            created: "Категория создана",
            renamed: "Переименовано",
            defaultCategory: "Посмотреть позже",
            movies: "Фильмы",
            shows: "Сериалы",
            anime: "Аниме",
            other: "Другое",
            defaultLocked: "Категорию по умолчанию нельзя переименовать или удалить.",
            showAll: "Показать все"
        },
        uk: {
            tab: "До перегляду",
            add: "Додати до списку",
            onList: "У вашому списку – змінити категорії",
            dialogTitle: "Додати до списку",
            newCategory: "Нова категорія …",
            create: "Створити",
            removeAll: "Видалити зі списку",
            done: "Готово",
            noCategoriesDialog: "Категорій ще немає. Створіть її нижче.",
            exists: "Категорія з такою назвою вже існує.",
            error: "До перегляду: помилка ({0})",
            unknown: "невідомо",
            loading: "Завантаження списку …",
            all: "Усе",
            hidePlayed: "Приховати переглянуте",
            sortNewest: "Нещодавно додані",
            sortOldest: "Додані першими",
            sortTitle: "Назва А–Я",
            sortLabel: "Сортування",
            categories: "Категорії",
            noCategories: "Категорій ще немає. Створіть її вище в розділі «Категорії».",
            emptySection: "Тут поки нічого немає. Натисніть закладку поруч із сердечком у будь-якого фільму, серіалу, сезону чи епізоду.",
            emptyCategory: "У «{0}» поки нічого немає.",
            changeCategories: "Змінити категорії",
            removeFrom: "Видалити з «{0}»",
            moveUp: "Перемістити вгору",
            moveDown: "Перемістити вниз",
            deleteCategory: "Видалити категорію",
            renameHint: "Щоб перейменувати, змініть назву й натисніть Enter.",
            name: "Назва",
            confirmDelete: "Видалити категорію «{0}»?",
            confirmDeleteItems: " Елементи в ній ({0}) буде видалено з цієї категорії.",
            removed: "Видалено",
            deleted: "Категорію видалено",
            created: "Категорію створено",
            renamed: "Перейменовано",
            defaultCategory: "Переглянути пізніше",
            movies: "Фільми",
            shows: "Серіали",
            anime: "Аніме",
            other: "Інше",
            defaultLocked: "Категорію за замовчуванням не можна перейменувати чи видалити.",
            showAll: "Показати все"
        },
        tr: {
            tab: "İzleme listem",
            add: "İzleme listesine ekle",
            onList: "İzleme listende – kategorileri değiştir",
            dialogTitle: "İzleme listesine ekle",
            newCategory: "Yeni kategori …",
            create: "Oluştur",
            removeAll: "İzleme listesinden kaldır",
            done: "Tamam",
            noCategoriesDialog: "Henüz kategori yok. Aşağıdan bir tane oluştur.",
            exists: "Bu adda bir kategori zaten var.",
            error: "İzleme listesi: hata ({0})",
            unknown: "bilinmiyor",
            loading: "İzleme listesi yükleniyor …",
            all: "Tümü",
            hidePlayed: "İzlenenleri gizle",
            sortNewest: "Son eklenenler",
            sortOldest: "İlk eklenenler",
            sortTitle: "Başlık A–Z",
            sortLabel: "Sırala",
            categories: "Kategoriler",
            noCategories: "Henüz kategori yok. Yukarıdaki “Kategoriler” bölümünden bir tane oluştur.",
            emptySection: "Burada henüz bir şey yok. Herhangi bir film, dizi, sezon veya bölümde kalbin yanındaki yer işaretine tıkla.",
            emptyCategory: "“{0}” içinde henüz bir şey yok.",
            changeCategories: "Kategorileri değiştir",
            removeFrom: "“{0}” kategorisinden kaldır",
            moveUp: "Yukarı taşı",
            moveDown: "Aşağı taşı",
            deleteCategory: "Kategoriyi sil",
            renameHint: "Yeniden adlandırmak için adı düzenleyip Enter’a bas.",
            name: "Ad",
            confirmDelete: "“{0}” kategorisi silinsin mi?",
            confirmDeleteItems: " İçindeki {0} öğe bu kategoriden kaldırılacak.",
            removed: "Kaldırıldı",
            deleted: "Kategori silindi",
            created: "Kategori oluşturuldu",
            renamed: "Yeniden adlandırıldı",
            defaultCategory: "Sonra izle",
            movies: "Filmler",
            shows: "Diziler",
            anime: "Anime",
            other: "Diğer",
            defaultLocked: "Varsayılan kategori yeniden adlandırılamaz veya silinemez.",
            showAll: "Tümünü göster"
        },
        ja: {
            tab: "ウォッチリスト",
            add: "ウォッチリストに追加",
            onList: "ウォッチリスト登録済み – カテゴリを変更",
            dialogTitle: "ウォッチリストに追加",
            newCategory: "新しいカテゴリ …",
            create: "作成",
            removeAll: "ウォッチリストから削除",
            done: "完了",
            noCategoriesDialog: "カテゴリはまだありません。下で作成してください。",
            exists: "同じ名前のカテゴリがすでにあります。",
            error: "ウォッチリスト: エラー ({0})",
            unknown: "不明",
            loading: "ウォッチリストを読み込み中 …",
            all: "すべて",
            hidePlayed: "視聴済みを非表示",
            sortNewest: "追加が新しい順",
            sortOldest: "追加が古い順",
            sortTitle: "タイトル順",
            sortLabel: "並べ替え",
            categories: "カテゴリ",
            noCategories: "カテゴリはまだありません。上の「カテゴリ」から作成してください。",
            emptySection: "まだ何もありません。映画、シリーズ、シーズン、エピソードのハートの横にあるブックマークをクリックしてください。",
            emptyCategory: "「{0}」にはまだ何もありません。",
            changeCategories: "カテゴリを変更",
            removeFrom: "「{0}」から削除",
            moveUp: "上へ移動",
            moveDown: "下へ移動",
            deleteCategory: "カテゴリを削除",
            renameHint: "名前を変更するには、名前を編集して Enter を押してください。",
            name: "名前",
            confirmDelete: "カテゴリ「{0}」を削除しますか？",
            confirmDeleteItems: " 含まれている {0} 件はこのカテゴリから外されます。",
            removed: "削除しました",
            deleted: "カテゴリを削除しました",
            created: "カテゴリを作成しました",
            renamed: "名前を変更しました",
            defaultCategory: "あとで見る",
            movies: "映画",
            shows: "シリーズ",
            anime: "アニメ",
            other: "その他",
            defaultLocked: "デフォルトのカテゴリは名前の変更や削除ができません。",
            showAll: "すべて表示"
        },
        ko: {
            tab: "시청 목록",
            add: "시청 목록에 추가",
            onList: "시청 목록에 있음 – 카테고리 변경",
            dialogTitle: "시청 목록에 추가",
            newCategory: "새 카테고리 …",
            create: "만들기",
            removeAll: "시청 목록에서 제거",
            done: "완료",
            noCategoriesDialog: "아직 카테고리가 없습니다. 아래에서 만드세요.",
            exists: "같은 이름의 카테고리가 이미 있습니다.",
            error: "시청 목록: 오류 ({0})",
            unknown: "알 수 없음",
            loading: "시청 목록을 불러오는 중 …",
            all: "전체",
            hidePlayed: "시청한 항목 숨기기",
            sortNewest: "최근 추가순",
            sortOldest: "오래된 추가순",
            sortTitle: "제목순",
            sortLabel: "정렬",
            categories: "카테고리",
            noCategories: "아직 카테고리가 없습니다. 위의 “카테고리”에서 만드세요.",
            emptySection: "아직 아무것도 없습니다. 영화, 시리즈, 시즌, 에피소드의 하트 옆 북마크를 클릭하세요.",
            emptyCategory: "“{0}”에 아직 아무것도 없습니다.",
            changeCategories: "카테고리 변경",
            removeFrom: "“{0}”에서 제거",
            moveUp: "위로 이동",
            moveDown: "아래로 이동",
            deleteCategory: "카테고리 삭제",
            renameHint: "이름을 바꾸려면 이름을 수정하고 Enter 키를 누르세요.",
            name: "이름",
            confirmDelete: "“{0}” 카테고리를 삭제할까요?",
            confirmDeleteItems: " 안에 있는 항목 {0}개가 이 카테고리에서 제거됩니다.",
            removed: "제거됨",
            deleted: "카테고리를 삭제했습니다",
            created: "카테고리를 만들었습니다",
            renamed: "이름을 변경했습니다",
            defaultCategory: "나중에 볼 항목",
            movies: "영화",
            shows: "시리즈",
            anime: "애니메이션",
            other: "기타",
            defaultLocked: "기본 카테고리는 이름을 바꾸거나 삭제할 수 없습니다.",
            showAll: "모두 보기"
        },
        'zh-cn': {
            tab: "待看清单",
            add: "加入待看清单",
            onList: "已在待看清单中 – 更改分类",
            dialogTitle: "加入待看清单",
            newCategory: "新分类 …",
            create: "创建",
            removeAll: "从待看清单移除",
            done: "完成",
            noCategoriesDialog: "还没有分类。请在下方创建。",
            exists: "已存在同名分类。",
            error: "待看清单：出错（{0}）",
            unknown: "未知",
            loading: "正在加载待看清单 …",
            all: "全部",
            hidePlayed: "隐藏已看",
            sortNewest: "最近添加",
            sortOldest: "最早添加",
            sortTitle: "按标题",
            sortLabel: "排序",
            categories: "分类",
            noCategories: "还没有分类。请在上方“分类”中创建。",
            emptySection: "这里还没有内容。点击任意电影、剧集、季或集的爱心旁边的书签即可添加。",
            emptyCategory: "“{0}”中还没有内容。",
            changeCategories: "更改分类",
            removeFrom: "从“{0}”移除",
            moveUp: "上移",
            moveDown: "下移",
            deleteCategory: "删除分类",
            renameHint: "要重命名，请修改名称后按 Enter。",
            name: "名称",
            confirmDelete: "删除分类“{0}”？",
            confirmDeleteItems: " 其中的 {0} 个项目将从此分类中移除。",
            removed: "已移除",
            deleted: "分类已删除",
            created: "分类已创建",
            renamed: "已重命名",
            defaultCategory: "稍后观看",
            movies: "电影",
            shows: "剧集",
            anime: "动漫",
            other: "其他",
            defaultLocked: "默认分类无法重命名或删除。",
            showAll: "显示全部"
        },
        'zh-tw': {
            tab: "待看清單",
            add: "加入待看清單",
            onList: "已在待看清單中 – 變更分類",
            dialogTitle: "加入待看清單",
            newCategory: "新分類 …",
            create: "建立",
            removeAll: "從待看清單移除",
            done: "完成",
            noCategoriesDialog: "還沒有分類。請在下方建立。",
            exists: "已有同名的分類。",
            error: "待看清單：發生錯誤（{0}）",
            unknown: "未知",
            loading: "正在載入待看清單 …",
            all: "全部",
            hidePlayed: "隱藏已看",
            sortNewest: "最近加入",
            sortOldest: "最早加入",
            sortTitle: "依標題",
            sortLabel: "排序",
            categories: "分類",
            noCategories: "還沒有分類。請在上方「分類」中建立。",
            emptySection: "這裡還沒有內容。點選任何電影、影集、季或集的愛心旁邊的書籤即可加入。",
            emptyCategory: "「{0}」中還沒有內容。",
            changeCategories: "變更分類",
            removeFrom: "從「{0}」移除",
            moveUp: "上移",
            moveDown: "下移",
            deleteCategory: "刪除分類",
            renameHint: "若要重新命名，請修改名稱後按 Enter。",
            name: "名稱",
            confirmDelete: "刪除分類「{0}」？",
            confirmDeleteItems: " 其中的 {0} 個項目將從此分類移除。",
            removed: "已移除",
            deleted: "已刪除分類",
            created: "已建立分類",
            renamed: "已重新命名",
            defaultCategory: "稍後觀看",
            movies: "電影",
            shows: "影集",
            anime: "動畫",
            other: "其他",
            defaultLocked: "預設分類無法重新命名或刪除。",
            showAll: "顯示全部"
        }
    };

    // Jellyfin sets <html lang> to the user's display language (e.g. "de", "pt-BR", "zh-CN").
    function lang() {
        var l = (document.documentElement.getAttribute('lang') || navigator.language || 'en').toLowerCase().replace('_', '-');
        if (STRINGS[l]) return l;
        var base = l.split('-')[0];
        if (base === 'zh') return /-(tw|hk|mo|hant)/.test(l) ? 'zh-tw' : 'zh-cn';
        if (base === 'no' || base === 'nn') return 'nb';
        return STRINGS[base] ? base : 'en';
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
        urlOpened: null,
        seriesOf: new Map(),     // itemId -> seriesId of an episode ('' = not an episode / unknown)
        seriesPending: new Set()
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
            var id = dialogIdFor(btn) || itemIdFor(ratingBtn);
            if (id) openDialog(id);
        });
        return btn;
    }

    // Episodes count as on the list when their series is. Their series id is looked up once per episode.
    function itemTypeFor(ratingBtn) {
        var card = ratingBtn.closest('[data-type]');
        return ratingBtn.getAttribute('data-itemtype') || (card && card.getAttribute('data-type')) || '';
    }

    function seriesIdFor(ratingBtn, id) {
        if (!id) return '';
        var type = itemTypeFor(ratingBtn);
        // Details page buttons carry no type -> look it up as well
        if (type !== 'Episode' && !(type === '' && ratingBtn.classList.contains('btnUserRating'))) return '';
        var series = state.seriesOf.get(id);
        if (series === undefined) {
            requestSeries(id);
            return '';
        }
        return series;
    }

    var seriesTimer = null;
    function requestSeries(id) {
        if (state.seriesPending.has(id)) return;
        state.seriesPending.add(id);
        if (seriesTimer) return;
        seriesTimer = setTimeout(function () {
            seriesTimer = null;
            var ids = Array.from(state.seriesPending);
            fetchItems(ids).then(function (items) {
                ids.forEach(function (eid) {
                    var item = items.get(eid);
                    state.seriesOf.set(eid, item && item.Type === 'Episode' && item.SeriesId ? normId(item.SeriesId) : '');
                });
            }).catch(function () {
                ids.forEach(function (eid) { state.seriesOf.set(eid, ''); });
            }).finally(function () {
                ids.forEach(function (eid) { state.seriesPending.delete(eid); });
                scanButtons();
                refreshButtons();
            });
        }, 50);
    }

    // The episode itself if it is on the list, else its series if that is, else the episode (to add it)
    function dialogIdFor(btn) {
        var id = btn.getAttribute('data-wl-id');
        var series = btn.getAttribute('data-wl-series');
        if (id && !state.itemCats.has(id) && series && state.itemCats.has(series)) return series;
        return id;
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
            var series = seriesIdFor(ratingBtn, id);
            if ((btn.getAttribute('data-wl-series') || '') !== series) {
                if (series) btn.setAttribute('data-wl-series', series);
                else btn.removeAttribute('data-wl-series');
            }
        });
    }

    function refreshButtons() {
        document.querySelectorAll('.wlBookmarkBtn').forEach(function (btn) {
            var id = btn.getAttribute('data-wl-id');
            var series = btn.getAttribute('data-wl-series');
            var active = (!!id && state.itemCats.has(id)) || (!!series && state.itemCats.has(series));
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
