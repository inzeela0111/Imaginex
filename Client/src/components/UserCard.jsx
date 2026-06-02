import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function UserCard({ user }) {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);
  const [followersCount, setFollowersCount] = useState(user.followers);

  const handleFollowToggle = async () => {
    if (!currentUser) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      };
      
      if (isFollowing) {
        // Unfollow request
        await axios.put(`/api/user/unfollow/${user.id}`, {}, config);
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        // Follow request
        await axios.put(`/api/user/follow/${user.id}`, {}, config);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling follow in UserCard:", err);
    }
  };

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
        {followersCount.toLocaleString()} <span className="text-gray-500 font-normal">followers</span>
      </p>
      {currentUser && (currentUser._id !== user.id && currentUser.id !== user.id) && (
        <button 
          onClick={handleFollowToggle}
          className={`w-full py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
            isFollowing 
              ? 'bg-white/10 text-white hover:bg-white/20' 
              : 'bg-primary text-white hover:bg-primary-light hover:scale-105'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
      )}
    </div>
  );
}
