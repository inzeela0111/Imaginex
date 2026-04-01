import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const [formData , setFormData] = useState({
    email : "",
    password : "",
  })

 const {email , password} = formData

 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name] : e.target.value
  })
 }



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
    // Mock login success and redirect
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 group mb-2">
            <Sparkles className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-center">Welcome Back</h1>
          <p className="text-gray-400 mt-2 text-center">Enter your details to access your account.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name='email'
                  type="email" 
                  value={email}
                  onChange={handleChange}
                  // onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium text-gray-300">Password</label>
                <a href="#" className="text-xs text-primary hover:text-primary-light transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name='password'
                  type="password" 
                  value={password}
                  onChange={handleChange}
                  // onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-3 mt-4 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-white transition-colors font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
