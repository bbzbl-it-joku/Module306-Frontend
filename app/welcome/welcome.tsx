import * as React from "react";
import { Link } from "react-router";

export function Welcome() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-800 relative overflow-hidden">
      {/* Floating Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-white/5 rounded-full animate-bounce" style={{ animationDuration: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header Navigation */}
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
              <Link
                to="/dashboard"
                className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:-translate-y-0.5 relative group"
              >
                Dashboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/kanban"
                className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:-translate-y-0.5 relative group"
              >
                Kanban Board
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/tickets"
                className="text-white/90 hover:text-white font-medium transition-all duration-200 hover:-translate-y-0.5 relative group"
              >
                All Tickets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors duration-200"
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
                <Link 
                  to="/dashboard" 
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/kanban" 
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Kanban Board
                </Link>
                <Link 
                  to="/tickets" 
                  className="text-white/90 hover:text-white font-medium transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  All Tickets
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Main Welcome Section */}
      <main className="pt-20 min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto animate-slideUp">
          {/* Welcome Title */}
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              Trackify
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-white/90 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
            Streamline your project management with powerful issue tracking and team collaboration tools
          </p>

          {/* Description */}
          <p className="text-lg text-white/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            From kanban boards to detailed analytics, organize your workflow and keep your team aligned with comprehensive issue tracking capabilities.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/dashboard"
              className="group relative px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/30 hover:-translate-y-1 hover:shadow-2xl min-w-[200px] overflow-hidden"
            >
              <span className="relative z-10">View Dashboard</span>
              <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
            </Link>

            <Link
              to="/kanban"
              className="group px-8 py-4 border-2 border-white/50 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 min-w-[200px]"
            >
              <span>Kanban Board</span>
              <svg className="inline-block ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Feature Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <div className="text-white/80 text-sm md:text-base">Project Analytics</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h2.5l1.5 6H4zm18.5-3c.28 0 .5.22.5.5s-.22.5-.5.5-.5-.22-.5-.5.22-.5.5-.5z"/>
                  <path d="M12.5 11H11V9.5c0-.28-.22-.5-.5-.5s-.5.22-.5.5V11H8.5c-.28 0-.5.22-.5.5s.22.5.5.5H10v1.5c0 .28.22.5.5.5s.5-.22.5-.5V12h1.5c.28 0 .5-.22.5-.5s-.22-.5-.5-.5z"/>
                </svg>
              </div>
              <div className="text-white/80 text-sm md:text-base">Team Collaboration</div>
            </div>
            <div className="text-center group cursor-pointer">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-200">
                <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
                </svg>
              </div>
              <div className="text-white/80 text-sm md:text-base">Issue Tracking</div>
            </div>
          </div>
        </div>
      </main>

      {/* Animation Styles */}
      <style >{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 1s ease-out forwards;
        }
      `}</style>
    </div>
  );
}