import { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import StoryBar from '../components/StoryBar';
import { Search, Sparkles } from 'lucide-react';

const mockTags = ['surrealism', 'cyberpunk', 'fantasy', 'portrait', 'anime', 'abstract', 'scifi', 'watercolor'];

const trendingUsers = [
  { id: 1, name: 'Alice Ray', username: 'aliceray', avatar: 'https://picsum.photos/seed/user10/80/80', followers: 12500, isFollowing: false },
  { id: 2, name: 'Bob Sketch', username: 'bobsketch', avatar: 'https://picsum.photos/seed/user11/80/80', followers: 8300, isFollowing: true },
  { id: 3, name: 'Charlie Ink', username: 'charliek', avatar: 'https://picsum.photos/seed/user12/80/80', followers: 45000, isFollowing: false },
  { id: 4, name: 'Diana Colors', username: 'dianac', avatar: 'https://picsum.photos/seed/user13/80/80', followers: 3200, isFollowing: false },
  { id: 5, name: 'Eve Render', username: 'everender', avatar: 'https://picsum.photos/seed/user14/80/80', followers: 18900, isFollowing: true },
];

const mockExplorePosts = [
  {
    id: 11,
    image: 'https://picsum.photos/seed/explore1/400/400',
    prompt: 'Space station interior view',
    likes: 890,
    isLiked: false,
    aspectRatio: '1/1',
    user: { name: 'Alice Ray', username: 'aliceray', avatar: 'https://picsum.photos/seed/user10/40/40' }
  },
  {
    id: 12,
    image: 'https://picsum.photos/seed/explore2/400/600',
    prompt: 'Underwater city glowing lights',
    likes: 1205,
    isLiked: true,
    aspectRatio: '2/3',
    user: { name: 'Bob Sketch', username: 'bobsketch', avatar: 'https://picsum.photos/seed/user11/40/40' }
  },
  {
    id: 13,
    image: 'https://picsum.photos/seed/explore3/400/500',
    prompt: 'Minimalist landscape design',
    likes: 450,
    isLiked: false,
    aspectRatio: '4/5',
    user: { name: 'Charlie Ink', username: 'charliek', avatar: 'https://picsum.photos/seed/user12/40/40' }
  },
  {
    id: 14,
    image: 'https://picsum.photos/seed/explore4/400/350',
    prompt: 'Mecha robot fighting dragon',
    likes: 3200,
    isLiked: false,
    aspectRatio: '8/7',
    user: { name: 'Eve Render', username: 'everender', avatar: 'https://picsum.photos/seed/user14/40/40' }
  },
  {
    id: 15,
    image: 'https://picsum.photos/seed/explore5/400/550',
    prompt: 'Oil painting of a rainy cafe',
    likes: 234,
    isLiked: false,
    aspectRatio: '3/4',
    user: { name: 'Diana Colors', username: 'dianac', avatar: 'https://picsum.photos/seed/user13/40/40' }
  }
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          {/* Mobile Search (Desktop is in Navbar) */}
          <div className="md:hidden relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search artists, tags, or prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-full py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50"
            />
          </div>

          <h2 className="text-xl font-heading font-bold mb-4">Trending Tags</h2>
          <StoryBar tags={mockTags} />

          <h2 className="text-xl font-heading font-bold mt-8 mb-4">Featured Creators</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
            {trendingUsers.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>

          <h2 className="text-xl font-heading font-bold mt-8 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Inspiration
          </h2>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 masonry-grid">
            {mockExplorePosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          
        </main>
      </div>
    </div>
  );
}
