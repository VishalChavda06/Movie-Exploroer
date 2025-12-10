import MovieGrid from '../components/MovieGrid';
import { useWatchlist } from '../context/WatchlistContext';

const WatchedPage = () => {
  const { state } = useWatchlist();

  return (
    <div className="container py-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Watched</h1>
        <p className="text-slate-400 text-sm">{state.watched.length} completed</p>
      </div>
      <MovieGrid movies={state.watched} emptyText="No movies marked as watched." />
    </div>
  );
};

export default WatchedPage;

