
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/1ac7e119-4db3-4206-bcc5-268540db3115.png" 
              alt="Sri Aadhavan Silks Logo" 
              className="h-12 w-12"
            />
            <span className="text-2xl font-bold text-burgundy-700 font-['Cormorant_Garamond']">
              Sri Adhavan Silks
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-gold-600 transition-colors">
              Home
            </Link>
            <Link to="/catalog" className="text-gray-700 hover:text-gold-600 transition-colors">
              Catalog
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/admin/dashboard" className="text-gray-700 hover:text-gold-600 transition-colors">
                  Admin Panel
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-700 hover:text-gold-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/admin/login" className="text-gray-700 hover:text-gold-600 transition-colors">
               
              </Link>
            )}
          </div>
          
          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 pb-3">
              <Link
                to="/"
                className="text-gray-700 hover:text-gold-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/catalog"
                className="text-gray-700 hover:text-gold-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Catalog
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="text-gray-700 hover:text-gold-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-700 hover:text-gold-600 transition-colors text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/admin/login"
                  className="text-gray-700 hover:text-gold-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
