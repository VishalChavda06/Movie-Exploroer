import { createContext, useContext, useEffect, useReducer } from 'react';
import { loadState, saveState } from '../utils/storage';

const WatchlistContext = createContext();

const ACTIONS = {
  LOAD: 'LOAD',
  ADD_WATCHLIST: 'ADD_WATCHLIST',
  REMOVE_WATCHLIST: 'REMOVE_WATCHLIST',
  ADD_WATCHED: 'ADD_WATCHED',
  REMOVE_WATCHED: 'REMOVE_WATCHED',
};

const initialState = {
  watchlist: [],
  watched: [],
};

const getMovieId = (movie) => movie.imdbid || movie.imdbID || movie.id;

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD:
      return action.payload;
    case ACTIONS.ADD_WATCHLIST:
      const watchlistId = getMovieId(action.payload);
      if (state.watchlist.find((m) => getMovieId(m) === watchlistId)) return state;
      return { ...state, watchlist: [...state.watchlist, action.payload] };
    case ACTIONS.REMOVE_WATCHLIST:
      return { ...state, watchlist: state.watchlist.filter((m) => getMovieId(m) !== action.payload) };
    case ACTIONS.ADD_WATCHED:
      const watchedId = getMovieId(action.payload);
      if (state.watched.find((m) => getMovieId(m) === watchedId)) return state;
      return {
        ...state,
        watched: [...state.watched, action.payload],
        watchlist: state.watchlist.filter((m) => getMovieId(m) !== watchedId),
      };
    case ACTIONS.REMOVE_WATCHED:
      return { ...state, watched: state.watched.filter((m) => getMovieId(m) !== action.payload) };
    default:
      return state;
  }
};

export const WatchlistProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = loadState();
    dispatch({ type: ACTIONS.LOAD, payload: stored });
  }, []);

  useEffect(() => {
    if (state === initialState) return;
    saveState(state);
  }, [state]);

  const addToWatchlist = (movie) => dispatch({ type: ACTIONS.ADD_WATCHLIST, payload: movie });
  const removeFromWatchlist = (movieId) =>
    dispatch({ type: ACTIONS.REMOVE_WATCHLIST, payload: movieId });
  const addToWatched = (movie) => dispatch({ type: ACTIONS.ADD_WATCHED, payload: movie });
  const removeFromWatched = (movieId) =>
    dispatch({ type: ACTIONS.REMOVE_WATCHED, payload: movieId });

  return (
    <WatchlistContext.Provider
      value={{ state, addToWatchlist, removeFromWatchlist, addToWatched, removeFromWatched }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const ctx = useContext(WatchlistContext);
  if (!ctx) {
    throw new Error('useWatchlist must be used within WatchlistProvider');
  }
  return ctx;
};

