import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { NAV_ITEMS } from '../constants';
import { useAuth } from '../context/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-900/70 backdrop-blur-md flex flex-col border-r border-white/10 text-slate-300">
      <div className="py-8 flex flex-col items-center text-center">
        <img src="https://ik.imagekit.io/xr12i05xn/astro%20logo.png?updatedAt=1751123974369" alt="AstroClub Logo" className="h-40 w-40 mb-4 bg-slate-800 rounded-full p-4" />
        <span className="text-xl font-bold text-slate-100">AstroClub Portal</span>
      </div>
      <nav className="flex-1 px-4 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 my-1 rounded-lg transition-all duration-200 group ${
                isActive
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors duration-200'}>{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
         {currentUser && (
          <div className="text-center mb-4">
            <p className="text-sm font-semibold text-slate-100">{currentUser.name}</p>
            <p className="text-xs text-slate-400">{currentUser.role}</p>
          </div>
         )}
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-white/5 hover:bg-white/20 text-slate-300 font-semibold transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
        <div className="text-center mt-4 text-xs text-slate-500">
            <span>© 2024 HKUST SU AstroClub</span>
            <Link to="/admin/accounts" className="ml-2 text-slate-400 hover:text-brand-accent">Admin Panel</Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
