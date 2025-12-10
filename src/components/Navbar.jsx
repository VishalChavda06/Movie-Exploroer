import { Link, NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/search', label: 'Search' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/watched', label: 'Watched' },
];

const Navbar = () => {
  return (
    <header className="border-b border-slate-800 bg-card/80 backdrop-blur">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="text-xl font-bold text-white">
          🎬 Movie Explorer
        </Link>
        <nav className="flex items-center space-x-4 text-sm text-slate-300">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md hover:text-white hover:bg-slate-800 ${
                  isActive ? 'bg-slate-800 text-white' : ''
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;

