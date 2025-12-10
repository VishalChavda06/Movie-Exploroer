import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../utils/api';
import { useWatchlist } from '../context/WatchlistContext';

const DetailRow = ({ label, value }) => (
  <div className="text-sm text-slate-300">
    <span className="font-semibold text-white">{label}: </span>
    <span>{value || 'N/A'}</span>
  </div>
);

const MovieDetailPage = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const { state, addToWatchlist, removeFromWatchlist, addToWatched, removeFromWatched } =
    useWatchlist();

  const normalizeId = (val) => (val !== undefined && val !== null ? String(val) : '');
  const getMovieId = (m) => normalizeId(m.id || m.imdbid || m.imdbID);
  const currentId = normalizeId(movieId);
  const inWatchlist = state.watchlist.some((m) => getMovieId(m) === currentId);
  const inWatched = state.watched.some((m) => getMovieId(m) === currentId);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieDetails(movieId);
        setMovie(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieId]);

  if (loading) {
    return (
      <div className="container py-12">
        <div className="h-96 animate-pulse rounded-xl bg-slate-800" />
      </div>
    );
  }

  if (error && !movie) {
    return (
      <div className="container py-12">
        <div className="rounded-lg border border-yellow-500/50 bg-yellow-500/10 p-4 text-yellow-100">
          <p className="font-semibold mb-2">Limited information</p>
          <p className="text-sm mb-2">{error}</p>
          <p className="text-xs opacity-80">Try again later; API rate limit may have been reached.</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  };

  const handleWatchlist = () => {
    const currentMovieId = getMovieId(movie);
    if (inWatchlist) {
      removeFromWatchlist(currentMovieId);
      showToast('Removed from Watchlist');
    } else {
      addToWatchlist(movie);
      showToast('Added to Watchlist');
    }
  };

  const handleWatched = () => {
    const currentMovieId = getMovieId(movie);
    if (inWatched) {
      removeFromWatched(currentMovieId);
      showToast('Marked as Unwatched');
    } else {
      addToWatched(movie);
      showToast('Marked as Watched');
    }
  };

  // TMDB data extraction
  const posterUrl = getImageUrl(movie.poster_path);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : null;
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const directors = movie.credits?.crew
    ?.filter((p) => p.job === 'Director')
    .map((p) => p.name)
    .join(', ');
  const writers = movie.credits?.crew
    ?.filter((p) => ['Writer', 'Screenplay', 'Author'].includes(p.job))
    .map((p) => p.name)
    .join(', ');
  const cast = movie.credits?.cast?.slice(0, 5).map((p) => p.name).join(', ');
  const genres = movie.genres || [];
  const imdbRating = movie.vote_average ? `${movie.vote_average.toFixed(1)} / 10 (${movie.vote_count} votes)` : null;
  const plot = movie.overview;
  const language = movie.spoken_languages?.map((l) => l.english_name || l.name).join(', ');
  const country = movie.production_countries?.map((c) => c.name).join(', ');
  const imdbId = movie.external_ids?.imdb_id;
  const type = movie.media_type || 'Movie';

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[280px,1fr]">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-card">
          {posterUrl ? (
            <img src={posterUrl} alt={movie.title || movie.Title} className="w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-slate-500">No Poster</div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-white">{movie.title || movie.Title}</h1>
            {(releaseYear || runtime) && (
              <p className="text-slate-400">
                {releaseYear ? releaseYear : ''} {releaseYear && runtime ? '•' : ''} {runtime ? runtime : ''}
              </p>
            )}
          </div>

          {Array.isArray(genres) && genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span key={genre.id} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {plot && <p className="text-slate-200 leading-relaxed">{plot}</p>}

          <div className="grid gap-3 sm:grid-cols-2">
            {directors && <DetailRow label="Director" value={directors} />}
            {writers && <DetailRow label="Writer" value={writers} />}
            {cast && <DetailRow label="Cast" value={cast} />}
            {language && <DetailRow label="Language" value={language} />}
            {country && <DetailRow label="Country" value={country} />}
            {movie.release_date && <DetailRow label="Released" value={movie.release_date} />}
            {imdbId && <DetailRow label="IMDB ID" value={imdbId} />}
            {type && <DetailRow label="Type" value={type} />}
          </div>

          {imdbRating && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Ratings</h3>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-200">
                  TMDB: <span className="font-semibold">{imdbRating}</span>
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleWatchlist}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2 ${
                inWatchlist
                  ? 'bg-amber-200/15 text-amber-100 border border-amber-200/40'
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
            </button>
            <button
              onClick={handleWatched}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition flex items-center gap-2 ${
                inWatched
                  ? 'bg-emerald-200/15 text-emerald-100 border border-emerald-200/40'
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {inWatched ? '✓ Watched' : 'Mark as Watched'}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 rounded-lg bg-slate-900 text-white px-4 py-3 shadow-lg border border-slate-700">
          {toast}
        </div>
      )}
    </div>
  );
};

export default MovieDetailPage;

