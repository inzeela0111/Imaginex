import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { LayoutDashboard, Users, Image as ImageIcon, Flag, Trash2, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const { user: currentUser } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [creditRequests, setCreditRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!currentUser.isAdmin) {
      toast.error("Unauthorized! Only Admins can access this page.");
      navigate('/');
      return;
    }

    fetchAdminData();
  }, [currentUser, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      };
      
      const [usersRes, postsRes, reportsRes, creditsRes] = await Promise.all([
        axios.get('/api/admin/user', config),
        axios.get('/api/admin/post', config),
        axios.get('/api/admin/reports', config),
        axios.get('/api/admin/credit-requests', config)
      ]);

      setUsers(usersRes.data);
      setPosts(postsRes.data);
      setReports(reportsRes.data);
      setCreditRequests(creditsRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
      toast.error("Failed to load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    if(!window.confirm(`Are you sure you want to ${currentStatus ? 'block' : 'unblock'} this user?`)) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.put(`/api/admin/user/${userId}`, {}, config);
      toast.success(`User successfully ${currentStatus ? 'blocked' : 'unblocked'}.`);
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update user status.");
    }
  };

  const handleUpdateCredits = async (userId) => {
    const amount = window.prompt("Enter new credit balance for this user:");
    if (amount === null || amount === '') return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.put(`/api/admin/user/${userId}/credits`, { credits: Number(amount) }, config);
      toast.success("User credits updated successfully.");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to update user credits.");
    }
  };

  const handleDeletePost = async (postId) => {
    if(!window.confirm("Are you sure you want to completely delete this post?")) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.delete(`/api/admin/post/${postId}`, config);
      toast.success("Post deleted successfully.");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete post.");
    }
  };

  const handleDeleteReport = async (reportId) => {
    if(!window.confirm("Are you sure you want to delete/resolve this report?")) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.delete(`/api/admin/report/${reportId}`, config);
      toast.success("Report resolved/deleted successfully.");
      fetchAdminData();
    } catch (err) {
      toast.error("Failed to delete report.");
    }
  };

  const handleProcessCreditRequest = async (requestId, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this credit request?`)) return;
    
    try {
      const config = { headers: { Authorization: `Bearer ${currentUser.token}` } };
      await axios.put(`/api/admin/credit-requests/${requestId}`, { action }, config);
      toast.success(`Request ${action}d successfully.`);
      fetchAdminData();
    } catch (err) {
      toast.error(`Failed to ${action} request.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl font-bold animate-pulse">Loading Admin Dashboard...</div>
      </div>
    );
  }

  const activeUsers = users.filter(u => u.isActive).length;
  const totalCredits = users.reduce((acc, u) => acc + (u.credits || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 pb-24 md:pb-8 min-h-[calc(100vh-64px)] animate-fadeIn">
          <div className="flex items-center gap-3 mb-8">
            <ShieldAlert className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-heading font-bold">Admin Control Panel</h1>
          </div>

          {/* Admin Tabs */}
          <div className="flex overflow-x-auto gap-4 mb-8 pb-2 custom-scrollbar">
            {[
              { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'posts', label: 'Posts', icon: ImageIcon },
              { id: 'reports', label: 'Reports', icon: Flag },
              { id: 'credit-requests', label: 'Credit Requests', icon: ShieldAlert },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]' 
                    : 'bg-card border border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Users</h3>
                <p className="text-4xl font-bold text-white">{users.length}</p>
                <p className="text-sm text-green-400 mt-2">{activeUsers} Active</p>
              </div>
              <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Posts</h3>
                <p className="text-4xl font-bold text-white">{posts.length}</p>
              </div>
              <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Total Reports</h3>
                <p className="text-4xl font-bold text-white">{reports.length}</p>
              </div>
              <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium mb-2">Global Credits</h3>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">⚡ {totalCredits}</p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 text-sm font-medium text-gray-300">User</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Email</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Role</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Credits</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Status</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={u.avatar && u.avatar.trim() !== '' ? u.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`} alt="avatar" className="w-10 h-10 rounded-full" />
                          <div>
                            <p className="text-white font-medium">{u.name}</p>
                            <p className="text-xs text-gray-500">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-400">{u.email}</td>
                        <td className="p-4 text-sm">
                          {u.isAdmin ? <span className="text-primary font-medium">Admin</span> : <span className="text-gray-400">User</span>}
                        </td>
                        <td className="p-4 text-sm font-medium text-cyan-400">⚡ {u.credits}</td>
                        <td className="p-4">
                          {u.isActive ? (
                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex w-fit items-center gap-1"><CheckCircle className="w-3 h-3"/> Active</span>
                          ) : (
                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium flex w-fit items-center gap-1"><XCircle className="w-3 h-3"/> Blocked</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleUpdateCredits(u._id)} className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs transition-colors">
                              Edit Credits
                            </button>
                            {!u.isAdmin && (
                              <button 
                                onClick={() => handleToggleUserStatus(u._id, u.isActive)} 
                                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${u.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                              >
                                {u.isActive ? 'Block' : 'Unblock'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(p => (
                <div key={p._id} className="bg-card border border-white/5 rounded-2xl overflow-hidden group">
                  <div className="aspect-square bg-black overflow-hidden relative">
                    <img src={p.imageLink} alt="post" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => handleDeletePost(p._id)} className="p-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <img src={p.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${p.user?.name}`} className="w-6 h-6 rounded-full" />
                      <span className="text-sm font-medium text-white">{p.user?.name || 'Unknown'}</span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-2">{p.caption}</p>
                    <p className="text-xs text-primary mt-2">{p.likes?.length || 0} Likes</p>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p className="text-gray-400">No posts found.</p>}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 gap-6">
              {reports.map(r => (
                <div key={r._id} className="bg-card border border-red-500/30 p-6 rounded-2xl shadow-lg flex flex-col md:flex-row gap-6">
                  {r.post && (
                    <img src={r.post.imageLink} alt="reported" className="w-full md:w-48 aspect-square object-cover rounded-xl bg-black" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-red-400 font-bold text-lg flex items-center gap-2"><Flag className="w-5 h-5"/> Reported Post</h3>
                      <span className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-white text-sm mb-4"><span className="text-gray-400">Report Reason:</span> {r.text}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-400">Reported by:</span>
                      <img src={r.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${r.user?.name}`} className="w-6 h-6 rounded-full" />
                      <span className="text-sm text-gray-300 font-medium">{r.user?.name}</span>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => r.post && handleDeletePost(r.post._id)} className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-xl text-sm font-medium transition-colors">
                        Delete Post & Report
                      </button>
                      <button onClick={() => handleDeleteReport(r._id)} className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-xl text-sm font-medium transition-colors">
                        Dismiss Report
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {reports.length === 0 && (
                <div className="text-center py-12 bg-card border border-white/5 rounded-2xl">
                  <ShieldAlert className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">All clear! No reports found.</p>
                </div>
              )}
            </div>
          )}

          {/* Credit Requests Tab */}
          {activeTab === 'credit-requests' && (
            <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/5">
                      <th className="p-4 text-sm font-medium text-gray-300">User</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Amount</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Reason/Message</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Status</th>
                      <th className="p-4 text-sm font-medium text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditRequests.map(req => (
                      <tr key={req._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={req.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${req.user?.name}`} className="w-8 h-8 rounded-full" />
                          <div>
                            <p className="text-white text-sm font-medium">{req.user?.name}</p>
                            <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                        </td>
                        <td className="p-4 text-sm font-bold text-cyan-400">⚡ {req.amount}</td>
                        <td className="p-4 text-sm text-gray-400 max-w-xs truncate" title={req.message}>{req.message || 'No message provided'}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium w-fit block ${
                            req.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            req.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          {req.status === 'pending' ? (
                            <div className="flex gap-2">
                              <button onClick={() => handleProcessCreditRequest(req._id, 'approve')} className="px-3 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors">Approve</button>
                              <button onClick={() => handleProcessCreditRequest(req._id, 'reject')} className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors">Reject</button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Processed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {creditRequests.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No credit requests found.</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
