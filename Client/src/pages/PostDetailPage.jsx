import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Sparkles, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const mockPost = {
  id: 1,
  image: 'https://picsum.photos/seed/detail1/800/1000',
  prompt: 'A futuristic city in the clouds with flying cars and neon lights, highly detailed, cyberpunk style, octane render, 8k',
  style: 'Cyberpunk',
  likes: 1240,
  isLiked: false,
  createdAt: '2 hours ago',
  user: { name: 'Elena Cyber', username: 'elenac', avatar: 'https://picsum.photos/seed/user2/60/60' },
  comments: [
    { id: 1, user: { name: 'Max Pixel', username: 'mpix', avatar: 'https://picsum.photos/seed/user3/40/40' }, text: 'The details on the buildings are incredible! 😍', time: '1h' },
    { id: 2, user: { name: 'Dali Dreams', username: 'dalid', avatar: 'https://picsum.photos/seed/user4/40/40' }, text: 'What model did you use for this?', time: '45m' },
    { id: 3, user: { name: 'Art Bot', username: 'artbot', avatar: 'https://picsum.photos/seed/user5/40/40' }, text: 'Stunning composition.', time: '10m' }
  ]
};

export default function PostDetailPage() {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(mockPost.isLiked);
  const [likes, setLikes] = useState(mockPost.likes);
  const [comment, setComment] = useState('');

  const handleLike = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          <div className="bg-card border border-white/5 rounded-3xl overflow-hidden flex flex-col xl:flex-row shadow-2xl">
            
            {/* Left: Image Container */}
            <div className="xl:w-2/3 bg-black flex items-center justify-center relative group min-h-[50vh]">
              <img 
                src={mockPost.image} 
                alt={mockPost.prompt} 
                className="max-w-full max-h-[85vh] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <button className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/20 transition-colors">
                  View Full Resolution
                </button>
              </div>
            </div>

            {/* Right: Details Panel */}
            <div className="xl:w-1/3 p-6 xl:p-8 flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar">
              
              {/* Creator Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <Link to={`/profile/${mockPost.user.username}`}>
                    <img 
                      src={mockPost.user.avatar} 
                      alt={mockPost.user.name} 
                      className="w-12 h-12 rounded-full border-2 border-primary/50 object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${mockPost.user.username}`} className="font-heading font-bold text-lg text-white hover:text-primary transition-colors block">
                      {mockPost.user.name}
                    </Link>
                    <span className="text-sm text-gray-400">@{mockPost.user.username} • {mockPost.createdAt}</span>
                  </div>
                </div>
                <button className="px-4 py-1.5 rounded-full bg-white/10 text-white font-medium text-sm hover:bg-white/20 transition-colors">
                  Follow
                </button>
              </div>

              {/* Prompt Detail */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-primary font-medium text-sm mb-3">
                  <Sparkles className="w-4 h-4" /> Generation Prompt
                </h3>
                <div className="bg-background/80 border border-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                  {mockPost.prompt}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Style: {mockPost.style}</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Model: Imaginex V4</span>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between border-y border-white/10 py-4 mb-6">
                <div className="flex gap-4">
                  <button onClick={handleLike} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group">
                    <Heart className={`w-6 h-6 transition-transform group-hover:scale-110 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="font-medium text-white">{likes.toLocaleString()}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6" />
                    <span className="font-medium text-white">{mockPost.comments.length}</span>
                  </button>
                </div>
                <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Comments Section */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-heading font-bold mb-4">Comments</h3>
                
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {mockPost.comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <Link to={`/profile/${c.user.username}`} className="flex-shrink-0">
                        <img src={c.user.avatar} alt={c.user.name} className="w-8 h-8 rounded-full" />
                      </Link>
                      <div>
                        <div className="flex items-baseline gap-2">
                          <Link to={`/profile/${c.user.username}`} className="font-medium text-sm text-white hover:underline">
                            {c.user.name}
                          </Link>
                          <span className="text-xs text-gray-500">{c.time}</span>
                        </div>
                        <p className="text-sm text-gray-300 mt-0.5">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment Input */}
                <div className="relative mt-auto">
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-background border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary-light text-white rounded-full transition-colors disabled:opacity-50" disabled={!comment.trim()}>
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
