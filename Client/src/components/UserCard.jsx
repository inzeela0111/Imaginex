import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserCard({ user }) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  return (
    <div className="bg-card border border-white/5 p-4 rounded-xl hover:border-white/10 transition-colors flex flex-col items-center min-w-[160px] snap-center">
      <Link to={`/profile/${user.username}`}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className="w-20 h-20 rounded-full border-2 border-white/10 object-cover mb-3"
        />
      </Link>
      
      <Link to={`/profile/${user.username}`} className="font-medium text-white hover:text-primary transition-colors text-center line-clamp-1">
        {user.name}
      </Link>
      <p className="text-xs text-gray-400 mb-4">@{user.username}</p>
      
      <p className="text-sm text-gray-300 font-medium mb-4">
        {user.followers.toLocaleString()} <span className="text-gray-500 font-normal">followers</span>
      </p>
      
      <button 
        onClick={() => setIsFollowing(!isFollowing)}
        className={`w-full py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
          isFollowing 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-primary text-white hover:bg-primary-light hover:scale-105'
        }`}
      >
        {isFollowing ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}
