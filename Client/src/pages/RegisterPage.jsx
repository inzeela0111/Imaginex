import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Mail, Lock, User, Phone, Text } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';

export default function RegisterPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch()

const {user , isLoading , isSuccess , isError , message} = useSelector(state => state.auth)

  const [formData , setFormData] = useState({
    name : "",
    email : "",
    phone : "",
    password : "",
    bio : ""
  })

 const {name , email , phone , password , bio} = formData

 const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name] : e.target.value
  })
 }

  const handleRegister = (e) => {
    e.preventDefault();
    //reister user
    dispatch(registerUser(formData))
  };

useEffect(() =>{
if(user){
 navigate("/")
}

if(isError && message){
 toast.error(message,{position : "top-center" })
}

},[user , isError , message])


if(isLoading){
  return(
   <Loader/>
  )
}

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -z-10"></div>

      <div className="w-full max-w-md animate-fadeIn">
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 group mb-2">
            <Sparkles className="w-8 h-8 text-primary group-hover:text-accent transition-colors" />
          </Link>
          <h1 className="text-3xl font-heading font-bold text-center">Join Imaginex</h1>
          <p className="text-gray-400 mt-2 text-center">Create your account to start generating art.</p>
        </div>





        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleRegister} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name='name'
                  type="text" 
                  value={name}
                  onChange={handleChange}
                  // onChange={(e) => setUsername(e.target.value)}
                  placeholder="art_creator"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  name='phone'
                  type="number" 
                  value={phone}
                  onChange={handleChange}
                  // onChange={(e) => setPhone(e.target.value)}
                  placeholder="+919891234567"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
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

            {/* <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Bio</label>
              <div className="relative">
                <Text className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <textarea 
                  name='bio'
                  type="text" 
                  value={bio}
                  onChange={handleChange}
                  // onChange={(e) => setBio(e.target.value)}
                  placeholder="Enter Your Bio"
                  className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>

            

            <button 
              type="submit"
              className="w-full py-3 mt-4 bg-primary hover:bg-primary-light text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
