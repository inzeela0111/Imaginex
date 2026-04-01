import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';

const mockUser = {
  name: 'Alex Artist',
  username: 'alexcreates',
  avatar: 'https://picsum.photos/seed/user1/150/150',
  cover: 'https://picsum.photos/seed/cover1/1200/400',
  bio: 'Digital alchemist. Transforming thoughts into pixels. ✨',
  followers: 12400,
  following: 342,
  isFollowing: false
};

const userPosts = [
  {
    id: 101,
    image: 'https://picsum.photos/seed/userpost1/400/500',
    prompt: 'Neon cyber cat sitting on a keyboard',
    likes: 892,
    isLiked: false,
    aspectRatio: '4/5',
    user: mockUser
  },
  {
    id: 102,
    image: 'https://picsum.photos/seed/userpost2/400/400',
    prompt: 'Surrealist landscape with floating clocks',
    likes: 342,
    isLiked: false,
    aspectRatio: '1/1',
    user: mockUser
  },
  {
    id: 103,
    image: 'https://picsum.photos/seed/userpost3/400/600',
    prompt: 'Fantasy forest with glowing mushrooms',
    likes: 2100,
    isLiked: true,
    aspectRatio: '2/3',
    user: mockUser
  }
];

export default function ProfilePage() {
  const { username } = useParams();
  const [activeTab, setActiveTab] = useState('Posts');
  const [isFollowing, setIsFollowing] = useState(mockUser.isFollowing);

  // In a real app, we'd fetch user data based on the username param.
  // We're using the mockUser for demonstration.

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          {/* Profile Header */}
          <div className="relative mb-16">
            {/* Cover Image */}
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              <img 
                src={mockUser.cover} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar & Info */}
            <div className="absolute -bottom-12 left-6 md:left-12 flex items-end gap-6 z-20">
              <img 
                src={mockUser.avatar} 
                alt={mockUser.name} 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background bg-card object-cover ring-2 ring-primary/50"
              />
              <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-white shadow-sm">
                  {mockUser.name}
                </h1>
                <p className="text-gray-400">@{username || mockUser.username}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="absolute -bottom-6 right-6 z-20 hidden sm:block">
               <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-xl ${
                  isFollowing 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                    : 'bg-primary text-white hover:bg-primary-light hover:scale-105'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>

          <div className="px-2 md:px-8 mb-8 sm:hidden">
             <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`w-full py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isFollowing 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                    : 'bg-primary text-white hover:bg-primary-light'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
          </div>

          {/* Bio & Stats */}
          <div className="px-2 md:px-12 mb-8">
            <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-4 leading-relaxed">
              {mockUser.bio}
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{mockUser.followers.toLocaleString()}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Followers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">{mockUser.following.toLocaleString()}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Following</span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-8 border-b border-white/10 px-2 md:px-12">
            {['Posts', 'Liked'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium transition-colors relative ${
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

          {/* Grid */}
          <div className="px-2 md:px-12 columns-1 sm:columns-2 lg:columns-3 xl:columns-4 masonry-grid">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
        </main>
      </div>
    </div>
  );
}
