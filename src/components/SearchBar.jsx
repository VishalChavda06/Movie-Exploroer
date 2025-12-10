const SearchBar = ({ value, onChange, placeholder = 'Search movies...' }) => {
  return (
    <div className="flex w-full items-center space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <span className="text-slate-500 text-sm whitespace-nowrap">Live search</span>
    </div>
  );
};

export default SearchBar;

