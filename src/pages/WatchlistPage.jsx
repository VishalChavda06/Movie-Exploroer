import MovieGrid from '../components/MovieGrid';
import { useWatchlist } from '../context/WatchlistContext';

const WatchlistPage = () => {
  const { state } = useWatchlist();

  return (
    <div className="container py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Watchlist</h1>
        <p className="text-slate-400 text-sm">{state.watchlist.length} saved</p>
      </div>
      <MovieGrid movies={state.watchlist} emptyText="No movies in your watchlist." />
    </div>
  );
};

export default WatchlistPage;

