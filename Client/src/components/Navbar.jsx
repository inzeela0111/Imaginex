import { Link } from 'react-router-dom';
import { Sparkles, Search, Bell, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const fetchUnreadCount = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };
        const res = await axios.get('/api/notifications/unread-count', config);
        setUnreadCount(res.data.count);
      } catch (err) {
        console.error("Error fetching unread notification count:", err);
      }
    };
    fetchUnreadCount();
    // Poll every 10 seconds for real-time notifications
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [currentUser]);

  const userAvatar = currentUser?.avatar && currentUser.avatar.trim() !== "" 
    ? currentUser.avatar 
    : `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name || 'A'}`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
          <span className="font-heading text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
            Imaginex
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <div className="relative group">
             <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-primary transition-colors"/>
             <input 
               type="text" 
               placeholder="Search imagination..." 
               className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all w-64"
             />
          </div>
          <Link to="/explore" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Explore</Link>
          <Link to="/generate" className="text-gray-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-1">
             <Sparkles className="w-4 h-4 text-primary" />
             Generate
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/*
          <button className="text-gray-400 hover:text-white transition-colors relative">
             <Bell className="w-5 h-5" />
             <span className="absolute top-0 right-0 w-2 h-2 bg-accent rounded-full border border-card"></span>
          </button>
          */}
          {currentUser ? (
            <Link to="/notifications" className="text-gray-400 hover:text-white transition-colors relative p-1">
               <Bell className="w-5 h-5" />
               {unreadCount > 0 && (
                 <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-accent rounded-full border border-card animate-pulse"></span>
               )}
            </Link>
          ) : (
            <Link to="/login" className="text-gray-400 hover:text-white transition-colors relative p-1">
               <Bell className="w-5 h-5" />
            </Link>
          )}
          
          <div className="relative">
            {/*
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img 
                src="https://picsum.photos/seed/user1/40/40" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-white/20 hover:border-primary transition-colors object-cover"
              />
            </button>
            */}
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img 
                src={userAvatar} 
                alt="Avatar" 
                className="w-8 h-8 rounded-full border border-white/20 hover:border-primary transition-colors object-cover"
              />
            </button>
            
            {/* Dropdown Menu Mock */}
            {/*
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fadeIn py-1">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white">Alex Artist</p>
                  <p className="text-xs text-gray-400">@alexcreates</p>
                </div>
                <Link to="/profile/alexcreates" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link to="/login" className="block px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors">
                  Sign out
                </Link>
              </div>
            )}
            */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-white/10 rounded-xl shadow-xl overflow-hidden animate-fadeIn py-1 z-50">
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-medium text-white first-letter:uppercase">{currentUser?.name || "Guest"}</p>
                  <p className="text-xs text-gray-400">@{currentUser?.name || "guest"}</p>
                </div>
                {currentUser && (
                  <Link 
                    to={`/profile/${currentUser.name}`} 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                )}
                <Link 
                  to="/login" 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    localStorage.removeItem("user");
                  }}
                  className="block px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors"
                >
                  Sign out
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
