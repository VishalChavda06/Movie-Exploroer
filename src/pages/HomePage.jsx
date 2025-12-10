import { useEffect, useState } from 'react';
import MovieGrid from '../components/MovieGrid';
import SkeletonCard from '../components/SkeletonCard';
import { fetchMoviesByCategory } from '../utils/api';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('trending');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const results = await fetchMoviesByCategory(category);
        if (results && results.length > 0) {
          setMovies(results);
        }
      } catch (e) {
        // Silently handle errors - don't show notice
        console.warn('Failed to load movies:', e.message);
        // Keep existing movies if any
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [category]);

  const categories = [
    { key: 'trending', label: 'Trending' },
    { key: 'popular', label: 'Popular' },
    { key: 'top_rated', label: 'Top Rated' },
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'action', label: 'Action' },
    { key: 'comedy', label: 'Comedy' },
    { key: 'horror', label: 'Horror' },
    { key: 'romance', label: 'Romance' },
    { key: 'documentary', label: 'Documentary' },
  ];

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Browse Movies</h1>
          <p className="text-sm text-slate-400">Pick a category</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategory(cat.key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                category === cat.key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {loading && movies.length === 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <MovieGrid movies={movies} emptyText="No movies found." />
      )}
    </div>
  );
};

export default HomePage;

