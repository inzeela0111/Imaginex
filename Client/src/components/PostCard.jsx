import { useState } from 'react';
import { Heart, Maximize2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PostCard({ post }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);

  const handleLike = (e) => {
    e.preventDefault();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div onClick={() => navigate(`/post/${post.id}`)} className="cursor-pointer block group relative rounded-2xl overflow-hidden bg-card mb-4 masonry-item">
      {/* Image */}
      <img 
        src={post.image} 
        alt={post.prompt} 
        className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ aspectRatio: post.aspectRatio || '3/4' }}
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
        
        {/* Top actions */}
        <div className="flex justify-end">
          <button 
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isLiked 
                ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        {/* Bottom info */}
        <div>
          <button className="w-full py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white font-medium text-sm flex items-center justify-center gap-2 transition-colors mb-3">
            <Maximize2 className="w-4 h-4" /> View Details
          </button>
          
          <div className="flex items-center gap-2">
            <Link to={`/profile/${post.user.username}`} onClick={(e) => e.stopPropagation()}>
              <img 
                src={post.user.avatar} 
                alt={post.user.name} 
                className="w-6 h-6 rounded-full border border-white/20"
              />
            </Link>
            <Link to={`/profile/${post.user.username}`} onClick={(e) => e.stopPropagation()} className="text-sm font-medium text-white hover:underline truncate">
              {post.user.name}
            </Link>
            <span className="text-xs text-gray-400 ml-auto flex items-center gap-1">
              <Heart className="w-3 h-3 fill-gray-400" /> {likes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
