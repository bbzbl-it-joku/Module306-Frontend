// components/navigation/Navigation.tsx
import * as React from "react";
import { Link } from "react-router";

interface NavigationProps {
  currentPath?: string;
}

export function Navigation({ currentPath }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  // Navigation items configuration
  const navigationItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Kanban Board', path: '/kanban' },

  ];

  const isActivePath = (path: string) => currentPath === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-white tracking-tight hover:scale-105 transition-transform duration-200"
          >
            Trackify
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-all duration-200 hover:-translate-y-0.5 relative group ${isActivePath(item.path)
                  ? 'text-white'
                  : 'text-white/90 hover:text-white'
                  }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-0.5 bg-white transition-all duration-300 ${isActivePath(item.path)
                  ? 'w-full'
                  : 'w-0 group-hover:w-full'
                  }`}></span>
              </Link>
            ))}
            {/* Create Ticket Button */}
            <Link
              to="/createTicket"
              className="ml-6 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors duration-200"
            >
              Create Ticket
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-4 pt-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`font-medium transition-colors duration-200 ${isActivePath(item.path)
                    ? 'text-white'
                    : 'text-white/90 hover:text-white'
                    }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Create Ticket Button for mobile */}
              <Link
                to="/createTicket"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition-colors duration-200 text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
               Create Ticket
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}