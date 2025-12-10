# Movie Explorer & Watchlist App

React + Vite app that lets you browse/search movies from TMDB, view full details, and manage watchlist/watched collections with localStorage persistence. UI uses Tailwind with shadcn-style cards, buttons, and skeleton loaders.

## Features
- Category browsing: Trending, Popular, Top Rated, Upcoming, Action, Comedy, Horror, Romance, Documentary
- Live Search (TMDB multi search, filtered to movies)
- Movie Detail page with full metadata (poster, year, genres, runtime, cast/crew, plot, TMDB rating, IMDB id when available)
- Watchlist and Watched pages with add/remove/mark-as-watched
- Inline toasts when adding/removing watchlist/watched
- Global state via Context API; persisted to `localStorage`
- Responsive, streaming-style grid with shadcn-like cards/buttons/skeletons

## Quick start
1) Install deps
```bash
cd Movie-Explorer
npm install
```
2) Run dev server
```bash
npm run dev
```
3) Open http://localhost:5173

**Troubleshooting:**
- Check the browser console (F12) for debugging information
- If you see rate limit messages from TMDB, wait a moment and try again

## Project structure
```
src/
├─ components/       # Navbar, MovieCard, MovieGrid, SearchBar, SkeletonCard
├─ pages/            # HomePage, SearchPage, MovieDetailPage, WatchlistPage, WatchedPage
├─ context/          # WatchlistProvider (watchlist + watched state)
├─ utils/            # api.js (RapidAPI helpers), storage.js (localStorage)
├─ App.jsx           # Routes
└─ main.jsx          # Entry with providers
```

## State model
```js
{
  watchlist: [], // movie objects (using TMDB id as unique identifier)
  watched: []    // movie objects (using TMDB id as unique identifier)
}
```
Persisted to `localStorage` under `movieExplorerState`.

## API helpers
- `getPopularMovies()` → TMDB `/trending/all/day` (filtered to movies with posters)
- `searchMovies(query)` → TMDB `/search/multi` (filtered to movies with posters)
- `fetchMovieDetails(movieId)` → TMDB `/movie/{id}?append_to_response=credits,external_ids`
- `getImageUrl(path)` → TMDB image CDN
- `fetchMoviesByCategory(categoryKey)` → TMDB endpoints for popular/top_rated/upcoming and genre-based discover queries

## Usage flow
1. Browse popular movies on Home page or search on Search page
2. Click any movie card to view full details
3. Add to Watchlist or mark as Watched from cards or detail page
4. Manage Watchlist/Watched pages (remove or toggle)
5. Movie detail shows poster, genres, cast/crew, runtime, TMDB rating, IMDB ID, plot

## Styling
- TailwindCSS with shadcn-inspired Card/Button/Input/Skeleton patterns
- Dark theme with slate color palette
- Responsive grid layouts for all screen sizes


