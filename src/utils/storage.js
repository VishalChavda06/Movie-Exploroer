const STORAGE_KEY = 'movieExplorerState';

export const loadState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { watchlist: [], watched: [] };
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load state', e);
    return { watchlist: [], watched: [] };
  }
};

export const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
};

