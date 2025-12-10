const API_BASE = 'https://api.themoviedb.org/3';
const API_KEY = '5fc5a2fdfebe6088374581f9116207d7';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

const buildUrl = (endpoint, params = {}) => {
  const searchParams = new URLSearchParams({ api_key: API_KEY, language: 'en-US', ...params });
  return `${API_BASE}${endpoint}?${searchParams.toString()}`;
};

const handleResponse = async (res) => {
  if (!res.ok) {
    let message = `Request failed: ${res.status} ${res.statusText}`;
    try {
      const data = await res.json();
      if (data && data.status_message) message = data.status_message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }
  return res.json();
};

export const getImageUrl = (path) => {
  if (!path || typeof path !== 'string') return null;
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE}${path}`;
};

export const searchMovies = async (query) => {
  if (!query) return [];
  const url = buildUrl('/search/multi', { query });
  const data = await handleResponse(await fetch(url));
  return (data.results || []).filter(
    (item) => item.media_type === 'movie' && item.poster_path
  );
};

export const getPopularMovies = async () => {
  const url = buildUrl('/trending/all/day');
  const data = await handleResponse(await fetch(url));
  return (data.results || []).filter(
    (item) => item.media_type === 'movie' && item.poster_path
  );
};

const CATEGORY_ENDPOINTS = {
  trending: '/trending/all/day',
  popular: '/movie/popular',
  top_rated: '/movie/top_rated',
  upcoming: '/movie/upcoming',
  action: '/discover/movie?with_genres=28',
  comedy: '/discover/movie?with_genres=35',
  horror: '/discover/movie?with_genres=27',
  romance: '/discover/movie?with_genres=10749',
  documentary: '/discover/movie?with_genres=99',
};

export const fetchMoviesByCategory = async (categoryKey) => {
  const endpoint = CATEGORY_ENDPOINTS[categoryKey] || CATEGORY_ENDPOINTS.trending;
  const url = endpoint.startsWith('/discover')
    ? `${API_BASE}${endpoint}&api_key=${API_KEY}&language=en-US`
    : buildUrl(endpoint);

  const data = await handleResponse(await fetch(url));
  return (data.results || []).filter((item) => item.poster_path);
};

export const fetchMovieDetails = async (movieId) => {
  const url = buildUrl(`/movie/${movieId}`, { append_to_response: 'credits,external_ids' });
  return handleResponse(await fetch(url));
};

