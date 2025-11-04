import React, { useState, useEffect } from 'react';
import { Menu, X, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/IMG_20250714_151848.jpg';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem('access_token');
  const userType = localStorage.getItem('user_type');
  const isAdmin = userType === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('admin_id');
    localStorage.removeItem('user_role');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (isAdmin) {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: sectionId } });
      setIsMobileMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-md'
    } border-b border-green-100`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
                <img src={logo} alt="Amber Global Trade Logo" className="h-20 w-auto mr-3 rounded-lg shadow-sm object-contain" style={{maxHeight:80}} />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Get a Quote
            </button>
            <Link 
              to="/products"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Products
            </Link>
            <Link 
              to="/blogs"
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Blogs
            </Link>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              View Us
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-700 hover:text-green-600 transition-colors font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Auth Links */}
            {!isLoggedIn && (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-600 transition-colors font-medium px-3 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all hover:scale-105 font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
            {isLoggedIn && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="p-2 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow transition flex items-center justify-center"
                  title={isAdmin ? "Admin Dashboard" : "Profile"}
                >
                  <User className="text-emerald-700" size={28} />
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-600 transition-colors font-medium px-3 py-2"
                >
                  Logout
                </button>
              </div>
            )}
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-100 bg-white/95 backdrop-blur-md">
            <nav className="space-y-2">
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                Get a Quote
              </button>
              <Link 
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                Products
              </Link>
              <Link 
                to="/blogs"
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                Blogs
              </Link>
              <button 
                onClick={() => scrollToSection('about')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                View Us
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
              >
                Contact
              </button>
              {/* Mobile Auth Links */}
              {!isLoggedIn ? (
                <div className="px-4 py-2 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2">
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    {isAdmin ? "Admin Dashboard" : "Profile"}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;