import { useEffect, useState } from 'react';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import SkeletonCard from '../components/SkeletonCard';
import { searchMovies } from '../utils/api';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const run = async () => {
        if (!query) {
          setMovies([]);
          return;
        }
        setLoading(true);
        setError(null);
        try {
          const results = await searchMovies(query);
          setMovies(results);
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };
      run();
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold text-white">Search</h1>
        <div className="w-full md:w-2/3">
          <SearchBar value={query} onChange={setQuery} />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-100">
          <p className="font-semibold mb-2">Error searching movies:</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <MovieGrid movies={movies} emptyText="Try searching for another title." />
      )}
    </div>
  );
};

export default SearchPage;

