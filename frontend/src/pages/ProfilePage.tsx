import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const navItems = [
  { to: '/', label: <><Home className="inline-block mr-2 -mt-1" size={18}/>Home</>, isHome: true },
  { to: '/profile/business', label: 'Business Details' },
  // { to: '/profile/quotation', label: 'Quotation' },
  // { to: '/profile/orders', label: 'Track Orders' },
];

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-50 pt-28">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-emerald-700 tracking-tight">My Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
          >
            Logout
          </button>
        </div>
        <nav className="flex space-x-4 mb-8 bg-white/80 rounded-xl shadow p-4">
          {navItems.map(item =>
            item.isHome ? (
              <Link
                key="home"
                to={item.to}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-emerald-700 hover:bg-emerald-100 flex items-center"
                onClick={scrollToTop}
              >
                {item.label}
              </Link>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${isActive ? 'bg-emerald-600 text-white shadow' : 'text-emerald-700 hover:bg-emerald-100'}`
                }
                end
                onClick={scrollToTop}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>
        <div className="bg-white/90 rounded-xl shadow-lg p-6 min-h-[350px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 