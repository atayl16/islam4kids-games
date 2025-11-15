import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-emerald-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with gradient badge */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                <span className="text-white text-xl font-bold">I4K</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 animate-pulse"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-violet-500 bg-clip-text text-transparent">
              Islam4Kids Games
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className={`relative text-lg font-medium transition-colors duration-200 group ${
                location.pathname === '/' ? 'text-emerald-600' : 'text-slate-700 hover:text-emerald-500'
              }`}
            >
              Home
              <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 to-violet-500 transition-transform duration-300 ${
                location.pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
            <Link
              to="/about"
              className={`relative text-lg font-medium transition-colors duration-200 group ${
                location.pathname === '/about' ? 'text-violet-600' : 'text-slate-700 hover:text-violet-500'
              }`}
            >
              About
              <span className={`absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-emerald-500 transition-transform duration-300 ${
                location.pathname === '/about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};
