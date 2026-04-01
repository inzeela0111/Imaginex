import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Sparkles, User, LogOut } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Home', path: '/feed', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Generate', path: '/generate', icon: Sparkles },
    { name: 'Profile', path: '/profile/alexcreates', icon: User },
  ];

  return (
    <aside className="w-64 fixed h-[calc(100vh-64px)] overflow-y-auto border-r border-white/10 bg-background/50 backdrop-blur-sm hidden md:flex flex-col">
      <div className="p-6 flex-1 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <link.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              {link.name}
            </Link>
          );
        })}
      </div>

      <div className="p-6 mt-auto">
        <Link 
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
