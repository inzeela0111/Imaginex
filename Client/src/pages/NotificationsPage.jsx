import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Bell, Heart, MessageSquare, UserPlus, Image, Sparkles, Zap, ShieldAlert } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };

        // Fetch notifications
        const res = await axios.get('/api/notifications', config);
        setNotifications(res.data);

        // Mark all as read after fetching
        await axios.put('/api/notifications/read', {}, config);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [currentUser, navigate]);

  const getNotificationDetails = (n) => {
    const senderName = n.sender?.name || "Someone";
    switch (n.type) {
      case 'follow':
        return {
          icon: <UserPlus className="w-5 h-5 text-violet-400" />,
          bgColor: "bg-violet-500/10 border-violet-500/20",
          message: <span className="text-gray-300"><strong className="text-white first-letter:uppercase">{senderName}</strong> started following you</span>,
          link: `/profile/${senderName}`
        };
      case 'new_post':
        return {
          icon: <Image className="w-5 h-5 text-cyan-400" />,
          bgColor: "bg-cyan-500/10 border-cyan-500/20",
          message: <span className="text-gray-300"><strong className="text-white first-letter:uppercase">{senderName}</strong> posted a new artwork</span>,
          link: n.post ? `/post/${n.post._id || n.post}` : '#'
        };
      case 'like':
        return {
          icon: <Heart className="w-5 h-5 text-rose-400" fill="currentColor" />,
          bgColor: "bg-rose-500/10 border-rose-500/20",
          message: <span className="text-gray-300"><strong className="text-white first-letter:uppercase">{senderName}</strong> liked your post</span>,
          link: n.post ? `/post/${n.post._id || n.post}` : '#'
        };
      case 'comment':
        return {
          icon: <MessageSquare className="w-5 h-5 text-emerald-400" />,
          bgColor: "bg-emerald-500/10 border-emerald-500/20",
          message: (
            <span className="text-gray-300">
              <strong className="text-white first-letter:uppercase">{senderName}</strong> commented on your post: 
              <span className="block mt-1 text-xs text-gray-400 italic">"{n.commentText || "Artwork is nice!"}"</span>
            </span>
          ),
          link: n.post ? `/post/${n.post._id || n.post}` : '#'
        };
      case 'system':
        return {
          icon: <ShieldAlert className="w-5 h-5 text-yellow-400" />,
          bgColor: "bg-yellow-500/10 border-yellow-500/20",
          message: <span className="text-gray-300">{n.text}</span>,
          link: '#'
        };
      default:
        return {
          icon: <Bell className="w-5 h-5 text-gray-400" />,
          bgColor: "bg-gray-500/10 border-gray-500/20",
          message: <span className="text-gray-300">Notification from <strong className="text-white">{senderName}</strong></span>,
          link: '#'
        };
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/*
      <div className="max-w-7xl mx-auto flex">
      */}
      <div className="max-w-7xl mx-auto">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Notifications
            </h1>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="text-white text-lg animate-pulse">Loading Notifications...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-white/5 rounded-2xl p-8 backdrop-blur-md">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10 shadow-inner">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">All caught up!</h3>
                <p className="text-gray-400 text-sm max-w-xs">No notifications found at the moment. Keep exploring and generating!</p>
                <Link to="/explore" className="mt-6 px-6 py-2 bg-primary hover:bg-primary-light text-white text-sm font-medium rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-primary/20">
                  Explore feed
                </Link>
              </div>
            ) : (
              notifications.map((n) => {
                const details = getNotificationDetails(n);
                const senderAvatar = n.type === 'system'
                  ? 'https://api.dicebear.com/7.x/initials/svg?seed=Admin'
                  : (n.sender?.avatar && n.sender.avatar.trim() !== "" 
                      ? n.sender.avatar 
                      : `https://api.dicebear.com/7.x/initials/svg?seed=${n.sender?.name || 'A'}`);

                return (
                  <Link 
                    key={n._id} 
                    to={details.link}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 backdrop-blur-md hover:translate-x-1 ${
                      !n.isRead 
                        ? 'bg-white/5 border-primary/20 hover:bg-white/10' 
                        : 'bg-card/40 border-white/5 hover:bg-card/60 hover:border-white/10'
                    }`}
                  >
                    {/* Notification Type Icon Badge */}
                    <div className={`p-2.5 rounded-lg border flex items-center justify-center shrink-0 shadow-inner ${details.bgColor}`}>
                      {details.icon}
                    </div>

                    {/* Sender Avatar */}
                    <img 
                      src={senderAvatar} 
                      alt={n.type === 'system' ? 'System' : n.sender?.name || "Avatar"} 
                      className="w-10 h-10 rounded-full object-cover border border-white/10 bg-white/5 shrink-0"
                    />

                    {/* Content & Time */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium leading-relaxed">
                        {details.message}
                      </div>
                      <span className="text-xs text-gray-500 block mt-1.5 font-normal">
                        {formatTimeAgo(n.createdAt)}
                      </span>
                    </div>

                    {/* Right Side Thumbnail if Post */}
                    {n.post && n.post.imageLink && (
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 shrink-0 shadow-inner">
                        <img 
                          src={n.post.imageLink} 
                          alt="Thumbnail" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </Link>
                );
              })
            )}
          </div>
          
        </main>
      </div>
    </div>
  );
}
