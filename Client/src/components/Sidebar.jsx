import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Compass, Sparkles, User, LogOut, ShieldAlert, Zap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';
import { useState } from 'react';
import CreditRequestModal from './CreditRequestModal';

export default function Sidebar() {
  const location = useLocation();

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {user} = useSelector(state => state.auth)
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/feed', icon: Home },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Generate', path: '/generate', icon: Sparkles },
    { name: 'Profile', path: `/profile/${user?.name}`, icon: User },
  ];

  if (user?.isAdmin) {
    links.push({ name: 'Admin', path: '/admin', icon: ShieldAlert });
  }

  const handleLogout = () => {
   dispatch(logoutUser())
   navigate("/login")
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 fixed h-[calc(100vh-64px)] overflow-y-auto border-r border-white/10 bg-background/50 backdrop-blur-sm hidden md:flex flex-col z-40">
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

      <div className="p-6 mt-auto flex flex-col gap-2">
        <button
          onClick={() => setIsCreditModalOpen(true)}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary/20 to-cyan-500/20 text-cyan-400 hover:from-primary/30 hover:to-cyan-500/30 border border-primary/20 hover:border-primary/40 transition-all duration-300"
        >
          <Zap className="w-5 h-5 text-yellow-400" />
          <span className="font-medium text-white">Get Credits</span>
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-white/10 z-50 px-4 py-2 flex justify-between items-center pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary scale-110' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <link.icon className={`w-6 h-6 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : ''}`} />
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Modals */}
      <CreditRequestModal isOpen={isCreditModalOpen} onClose={() => setIsCreditModalOpen(false)} />
    </>
  );
}
