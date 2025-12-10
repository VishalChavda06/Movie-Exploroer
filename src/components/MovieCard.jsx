import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { getImageUrl } from '../utils/api';

const Badge = ({ children }) => (
  <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-200">
    {children}
  </span>
);

const MovieCard = ({ movie, showActions = true, onImageError }) => {
  const { state, addToWatchlist, removeFromWatchlist, addToWatched, removeFromWatched } =
    useWatchlist();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // TMDB uses numeric id; keep fallbacks for safety
  const movieId = movie.id || movie.imdbid || movie.imdbID;
  const inWatchlist = state.watchlist.some((m) => (m.id || m.imdbid || m.imdbID) === movieId);
  const inWatched = state.watched.some((m) => (m.id || m.imdbid || m.imdbID) === movieId);

  const handleWatchlistToggle = () => {
    if (inWatchlist) removeFromWatchlist(movieId);
    else addToWatchlist(movie);
  };

  const handleWatchedToggle = () => {
    if (inWatched) removeFromWatched(movieId);
    else addToWatched(movie);
  };

  // TMDB response: poster_path
  const imageUrl = movie.poster_path || movie.imageurl || movie.posterurl || movie.poster || movie.image;
  const posterUrl = getImageUrl(imageUrl);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;
  const movieTitle = movie.title || movie.Title || 'Untitled';

  const handleImageError = () => {
    setImageError(true);
    if (onImageError) onImageError();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Don't render if no valid image URL or if image fails
  if (!posterUrl || imageError) {
    return null;
  }

  // Render but hide until image loads successfully
  if (!imageLoaded) {
    // Render hidden image to trigger load
    return (
      <div className="hidden">
        <img
          src={posterUrl}
          alt=""
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      </div>
    );
  }

  // Render full card only after image loads
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-800 bg-card shadow-lg shadow-black/30 transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/movie/${movieId}`}>
        <div className="aspect-[2/3] overflow-hidden bg-slate-900">
          <img
            src={posterUrl}
            alt={movieTitle}
            className="h-full w-full object-cover transition duration-300 hover:scale-105"
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <Badge>{movie.media_type === 'tv' ? 'TV' : 'Movie'}</Badge>
          {releaseYear ? <span>{releaseYear}</span> : <span className="opacity-0">.</span>}
        </div>
        <Link to={`/movie/${movieId}`} className="text-lg font-semibold text-white line-clamp-2">
          {movieTitle}
        </Link>
        {showActions && (
          <div className="mt-auto flex space-x-2 text-xs">
            <button
              onClick={handleWatchlistToggle}
              className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
                inWatchlist
                  ? 'bg-amber-200/10 text-amber-200 border border-amber-200/40'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {inWatchlist ? 'Remove' : 'Watchlist'}
            </button>
            <button
              onClick={handleWatchedToggle}
              className={`flex-1 rounded-lg px-3 py-2 font-medium transition ${
                inWatched
                  ? 'bg-emerald-200/10 text-emerald-200 border border-emerald-200/40'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {inWatched ? 'Unwatch' : 'Watched'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;

