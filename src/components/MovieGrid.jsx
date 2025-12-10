import MovieCard from './MovieCard';

import { getImageUrl } from '../utils/api';

const MovieGrid = ({ movies, emptyText = 'No movies found', showActions = true }) => {
  // Only render cards that have a usable image URL to avoid console 404 noise
  const validMovies = (movies || []).filter((movie) => {
    const posterUrl =
      movie.poster_path ||
      movie.imageurl ||
      movie.posterurl ||
      movie.poster ||
      movie.image;
    const url = getImageUrl(posterUrl);
    return url && typeof url === 'string' && url.startsWith('http');
  });

  if (!validMovies || validMovies.length === 0) {
    return <div className="text-center text-slate-400 py-12">{emptyText}</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {validMovies.map((movie) => {
        // Use imdbid (RapidAPI format) or fallback to id
        const movieId = movie.imdbid || movie.imdbID || movie.id || `movie-${Math.random()}`;
        return (
          <MovieCard key={movieId} movie={movie} showActions={showActions} />
        );
      })}
    </div>
  );
};

export default MovieGrid;

