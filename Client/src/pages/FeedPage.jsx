import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState('Following');
  const [posts, setPosts] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };

        // Fetch posts
        const postsRes = await axios.get('/api/posts', config);
        const formattedPosts = postsRes.data.map(p => ({
          id: p._id,
          image: p.imageLink,
          prompt: p.caption,
          likes: p.likes ? p.likes.length : 0,
          isLiked: p.likes ? p.likes.includes(currentUser.id || currentUser._id) : false,
          aspectRatio: '1/1',
          user: {
            id: p.user?._id,
            name: p.user?.name || 'Anonymous',
            username: p.user?.name || 'anonymous',
            avatar: p.user?.avatar && p.user.avatar.trim() !== "" ? p.user.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name || 'A'}`
          }
        }));
        setPosts(formattedPosts);

        // Fetch followings
        const followingsRes = await axios.get('/api/profile/followings', config);
        setFollowings(followingsRes.data.map(u => u._id));
      } catch (err) {
        console.error("Error fetching feed data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, navigate]);

  const displayedPosts = posts.filter(post => followings.includes(post.user?.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <Sidebar />
        
        {/* Main Content Area */}
        <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          {/* Tabs */}
          <div className="flex items-center gap-6 mb-8 border-b border-white/10">
            {['Following'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 font-medium transition-colors relative ${
                  activeTab === tab ? 'text-white' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full shadow-[0_0_10px_rgba(124,58,237,0.5)]"></div>
                )}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 masonry-grid">
            {loading ? (
              <div className="text-gray-400 py-4 col-span-full">Loading posts...</div>
            ) : displayedPosts.length === 0 ? (
              <div className="text-gray-400 py-4 col-span-full">No posts found</div>
            ) : (
              displayedPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
          
        </main>
      </div>
    </div>
  );
}
