import { Link, useNavigate } from 'react-router-dom';
import { Hotel, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">HotelBooking</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/search" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Search Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  My Bookings
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  {user.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/search" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
              Search Hotels
            </Link>
            {user ? (
              <>
                <Link to="/my-bookings" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                  My Bookings
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to="/admin" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </Link>
                <button onClick={handleLogout} className="block w-full text-left text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium" onClick={() => setMobileMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="block bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-base font-medium text-center" onClick={() => setMobileMenuOpen(false)}>
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
