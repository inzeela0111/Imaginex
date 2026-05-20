import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Heart, MessageCircle, Share2, Sparkles, Send, Flag, X, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { toast } from 'react-toastify';

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comment, setComment] = useState('');
  const [commentsList, setCommentsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useSelector(state => state.auth);
  const navigate = useNavigate();

  // Report State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isReporting, setIsReporting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };

        // Fetch post detail
        const res = await axios.get(`/api/posts/${id}`, config);
        const p = res.data;
        const formattedPost = {
          id: p._id,
          image: p.imageLink,
          prompt: p.caption,
          style: p.style || 'Realistic',
          likes: p.likes ? p.likes.length : 0,
          isLiked: p.likes ? p.likes.includes(currentUser.id || currentUser._id) : false,
          createdAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'Just now',
          user: {
            id: p.user?._id || p.user,
            name: p.user?.name || 'Anonymous',
            username: p.user?.name || 'anonymous',
            avatar: p.user?.avatar && p.user.avatar.trim() !== "" ? p.user.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name || 'A'}`
          }
        };
        setPost(formattedPost);
        setIsLiked(formattedPost.isLiked);
        setLikes(formattedPost.likes);

        // Fetch comments
        const commentsRes = await axios.get(`/api/posts/${id}/comments`, config);
        const formattedComments = commentsRes.data.map(c => ({
          id: c._id,
          user: {
            name: c.user?.name || 'Anonymous',
            username: c.user?.name || 'anonymous',
            avatar: c.user?.avatar && c.user.avatar.trim() !== "" ? c.user.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${c.user?.name || 'A'}`
          },
          text: c.text,
          time: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Just now'
        }));
        setCommentsList(formattedComments);
      } catch (err) {
        console.error("Error fetching post details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id, currentUser, navigate]);

  const handleLike = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      };
      await axios.put(`/api/posts/${id}`, {}, config);
      if (isLiked) {
        setLikes(prev => prev - 1);
      } else {
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      };
      const res = await axios.post(`/api/posts/${id}/comments`, { text: comment }, config);
      const newComment = {
        id: res.data._id,
        user: {
          name: currentUser.name,
          username: currentUser.name,
          avatar: currentUser.avatar && currentUser.avatar.trim() !== "" ? currentUser.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`
        },
        text: res.data.text,
        time: 'Just now'
      };
      setCommentsList(prev => [...prev, newComment]);
      setComment('');
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    setIsReporting(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${currentUser.token}`
        }
      };
      await axios.post(`/api/posts/${id}`, { text: reportText }, config);
      toast.success("Post reported successfully. Our team will review it.");
      setIsReportModalOpen(false);
      setReportText('');
    } catch (err) {
      console.error("Error reporting post:", err);
      toast.error("Failed to report post. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${currentUser.token}`
          }
        };
        await axios.delete(`/api/posts/${id}`, config);
        toast.success("Post deleted successfully.");
        navigate('/feed');
      } catch (err) {
        console.error("Error deleting post:", err);
        toast.error("Failed to delete post. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg">Loading post details...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-white text-lg">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-64px)] animate-fadeIn relative">
          
          <div className="bg-card border border-white/5 rounded-3xl overflow-hidden flex flex-col xl:flex-row shadow-2xl">
            
            {/* Left: Image Container */}
            <div className="xl:w-2/3 bg-black flex items-center justify-center relative group min-h-[50vh]">
              <img 
                src={post.image} 
                alt={post.prompt} 
                className="max-w-full max-h-[85vh] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <a href={post.image} target="_blank" rel="noreferrer" className="px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/20 transition-colors">
                  View Full Resolution
                </a>
              </div>
            </div>

            {/* Right: Details Panel */}
            <div className="xl:w-1/3 p-6 xl:p-8 flex flex-col max-h-[85vh] overflow-y-auto custom-scrollbar">
              
              {/* Creator Info */}
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <Link to={`/profile/${post.user.username}`}>
                    <img 
                      src={post.user.avatar} 
                      alt={post.user.name} 
                      className="w-12 h-12 rounded-full border-2 border-primary/50 object-cover"
                    />
                  </Link>
                  <div>
                    <Link to={`/profile/${post.user.username}`} className="font-heading font-bold text-lg text-white hover:text-primary transition-colors block">
                      {post.user.name}
                    </Link>
                    <span className="text-sm text-gray-400">@{post.user.username} • {post.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Prompt Detail */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-primary font-medium text-sm mb-3">
                  <Sparkles className="w-4 h-4" /> Generation Prompt
                </h3>
                <div className="bg-background/80 border border-white/5 rounded-xl p-4 text-gray-300 text-sm leading-relaxed">
                  {post.prompt}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Style: {post.style}</span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-400">Model: Pollinations.ai</span>
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
                    <span className="font-medium text-white">{commentsList.length}</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  {post.user.id === (currentUser.id || currentUser._id) && (
                    <button className="p-2 text-red-400 hover:text-white bg-red-500/10 rounded-full hover:bg-red-500/30 transition-colors" onClick={handleDeletePost} title="Delete Post">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors" onClick={() => setIsReportModalOpen(true)} title="Report Post">
                    <Flag className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-full hover:bg-white/10 transition-colors" onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied to clipboard!");
                  }}>
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-heading font-bold mb-4">Comments</h3>
                
                <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
                  {commentsList.map(c => (
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
                  {commentsList.length === 0 && (
                    <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
                  )}
                </div>

                {/* Comment Input */}
                <form onSubmit={handleAddComment} className="relative mt-auto">
                  <input 
                    type="text" 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-background border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary/50"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary-light text-white rounded-full transition-colors disabled:opacity-50" disabled={!comment.trim()}>
                    <Send className="w-4 h-4" />
                  </button>
                </form>

              </div>
            </div>
          </div>

          {/* Report Modal */}
          {isReportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-card border border-white/10 p-6 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-400" /> Report Post
                  </h3>
                  <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Please let us know why you are reporting this post. Our team will review it shortly.
                </p>
                <form onSubmit={handleReport}>
                  <textarea 
                    className="w-full bg-background border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 resize-none h-24 mb-4"
                    placeholder="Reason for reporting (e.g., spam, inappropriate content...)"
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                  ></textarea>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button"
                      onClick={() => setIsReportModalOpen(false)}
                      className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={!reportText.trim() || isReporting}
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 transition-colors disabled:opacity-50"
                    >
                      {isReporting ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}
