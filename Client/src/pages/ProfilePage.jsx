import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostCard from "../components/PostCard";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../features/auth/authSlice";
import axios from "axios";

export default function ProfilePage() {
  const { user: currentUser, profile, isLoading, isError, message } = useSelector((state) => state.auth);
  const { username } = useParams();

  const dispatch = useDispatch()
  const [activeTab, setActiveTab] = useState("Posts");

  const [isFollowing, setIsFollowing] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  useEffect(() => {
    if (profile && currentUser) {
      const isAlreadyFollowing = profile.followers?.some(
        f => f === currentUser.id || f === currentUser._id || (typeof f === 'object' && f._id === currentUser._id)
      );
      setIsFollowing(!!isAlreadyFollowing);
    }
  }, [profile, currentUser]);

  const handleFollowToggle = async () => {
    if (!currentUser || !profile) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      };
      
      if (isFollowing) {
        // Unfollow request
        await axios.put(`/api/user/unfollow/${profile._id}`, {}, config);
        setIsFollowing(false);
      } else {
        // Follow request
        await axios.put(`/api/user/follow/${profile._id}`, {}, config);
        setIsFollowing(true);
      }
      // Re-fetch the profile to update followers/following counts dynamically
      dispatch(getProfile(username));
    } catch (err) {
      console.error("Error toggling follow:", err);
    }
  };

  useEffect(() => {
    setLoadingTimeout(false);
    console.log("Fetching profile for:", username);
    dispatch(getProfile(username));

    // Timeout: agar 10 second mein response na aaye to error dikho
    const timer = setTimeout(() => {
      setLoadingTimeout(true);
      console.error("Profile load timeout for:", username);
    }, 10000);

    return () => clearTimeout(timer);
  }, [username]);

  useEffect(() => {
    const fetchAllPosts = async () => {
      if (!currentUser) return;
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };
        const res = await axios.get('/api/posts', config);
        setAllPosts(res.data);
      } catch (err) {
        console.error("Error fetching all posts:", err);
      }
    };
    fetchAllPosts();
  }, [currentUser, username]);

  if (isLoading && !loadingTimeout) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto flex">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="text-white text-lg animate-pulse">Loading Profile...</div>
          </main>
        </div>
      </div>
    );
  }

  if (isError || loadingTimeout || !profile || !profile.name) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto flex">
          <Sidebar />
          <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center gap-4">
            <div className="text-6xl">😕</div>
            <h2 className="text-white text-2xl font-bold">Profile Load Failed</h2>
            <p className="text-gray-400 text-sm text-center">
              {loadingTimeout
                ? `Server se response nahi mila. Server chal raha hai? (Port check karo)`
                : message || `The profile "@${username}" could not be loaded.`}
            </p>
            <button
              onClick={() => { setLoadingTimeout(false); dispatch(getProfile(username)); }}
              className="mt-2 px-6 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-light transition-all"
            >
              🔄 Retry
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-white/10 text-white rounded-full text-sm font-medium hover:bg-white/20 transition-all"
            >
              Go Back
            </button>
          </main>
        </div>
      </div>
    );
  }

  // Filter and format posts based on active tab
  const getDisplayPosts = () => {
    if (!profile) return [];
    
    if (activeTab === "Posts") {
      const postsToFormat = profile.posts || [];
      return postsToFormat.map(p => ({
        id: p._id,
        image: p.imageLink,
        prompt: p.caption,
        likes: p.likes ? p.likes.length : 0,
        isLiked: p.likes && currentUser ? p.likes.includes(currentUser.id || currentUser._id) : false,
        aspectRatio: '1/1',
        user: {
          name: profile.name || 'Anonymous',
          username: username || profile.name || 'anonymous',
          avatar: profile.avatar && profile.avatar.trim() !== "" ? profile.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${profile.name || 'A'}`
        }
      }));
    } else if (activeTab === "Liked") {
      const likedPosts = allPosts.filter(p => p.likes && p.likes.includes(profile._id));
      return likedPosts.map(p => ({
        id: p._id,
        image: p.imageLink,
        prompt: p.caption,
        likes: p.likes ? p.likes.length : 0,
        isLiked: p.likes && currentUser ? p.likes.includes(currentUser.id || currentUser._id) : false,
        aspectRatio: '1/1',
        user: {
          name: p.user?.name || 'Anonymous',
          username: p.user?.name || 'anonymous',
          avatar: p.user?.avatar && p.user.avatar.trim() !== "" ? p.user.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name || 'A'}`
        }
      }));
    }
    return [];
  };

  const displayPosts = getDisplayPosts();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
          {/* Profile Header */}
          <div className="relative mb-16">
            {/* Cover Image */}
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10"></div>
              <img
                src="https://picsum.photos/seed/cover1/1200/400"
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Avatar & Info */}
            <div className="absolute -bottom-12 left-6 md:left-12 flex items-end gap-6 z-20">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background bg-card object-cover ring-2 ring-primary/50  flex items-center justify-center font-extrabold text-2xl first-letter:uppercase text-white">
                {profile?.name ? profile.name[0] : ""}
              </div>
              <div className="mb-2">
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-white shadow-sm first-letter:uppercase">
                  {profile?.name}
                </h1>
                <p className="text-gray-400">@{username || profile?.name}</p>
              </div>
            </div>

            {/* Actions */}
            {currentUser && profile && (currentUser._id !== profile._id && currentUser.id !== profile._id) && (
              <div className="absolute -bottom-6 right-6 z-20 hidden sm:block">
                <button
                  onClick={handleFollowToggle}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 shadow-xl ${
                    isFollowing
                      ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                      : "bg-primary text-white hover:bg-primary-light hover:scale-105"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            )}
          </div>

          {currentUser && profile && (currentUser._id !== profile._id && currentUser.id !== profile._id) && (
            <div className="px-2 md:px-8 mb-8 sm:hidden">
              <button
                onClick={handleFollowToggle}
                className={`w-full py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isFollowing
                    ? "bg-white/10 text-white hover:bg-white/20 border border-white/20"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          )}

          {/* Bio & Stats */}
          <div className="px-2 md:px-12 mb-8">
            <p className="text-gray-300 max-w-2xl text-sm md:text-base mb-4 leading-relaxed">
              {profile?.bio || "No bio yet."}
            </p>
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  {profile?.posts ? profile.posts.length : 0}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Posts
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  {profile?.followers ? profile.followers.length : 0}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Followers
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white">
                  {profile?.following ? profile.following.length : 0}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Following
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                  ⚡ {profile?.credits ?? 0}
                </span>
                <span className="text-xs text-gray-500 uppercase tracking-wider">
                  Credits
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-8 mb-8 border-b border-white/10 px-2 md:px-12">
            {["Posts", "Liked"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium transition-colors relative ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-400 hover:text-gray-200"
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
            {displayPosts.length === 0 ? (
              <div className="text-gray-500 py-8 text-center col-span-full">No posts found in this tab.</div>
            ) : (
              displayPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
