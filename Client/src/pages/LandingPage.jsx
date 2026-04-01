import { Link } from 'react-router-dom';
import { Sparkles, Users, LayoutGrid, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI Generation",
      description: "Transform your words into breathtaking visual masterpieces in seconds."
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Connect with creators, share your prompt secrets, and find inspiration."
    },
    {
      icon: LayoutGrid,
      title: "Infinite Feed",
      description: "Dive into a never-ending stream of imagination from around the world."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      
      {/* Navigation */}
      <nav className="w-full border-b border-white/10 bg-background/50 backdrop-blur-md fixed top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              Imaginex
            </span>
          </div>
          <div className="flex gap-4">
            <Link to="/login" className="px-4 py-2 text-sm font-medium hover:text-primary transition-colors">
              Log in
            </Link>
            <Link to="/register" className="px-4 py-2 text-sm font-medium bg-primary hover:bg-primary-light text-white rounded-full transition-all hover:scale-105">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] -z-10"></div>

        <h1 className="text-5xl md:text-7xl font-heading font-extrabold mb-6 leading-tight animate-fadeIn">
          Turn <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">Imagination</span> <br className="hidden md:block"/> 
          Into Art
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10 animate-fadeIn" style={{animationDelay: '0.1s'}}>
          The premier platform for AI artists to generate, share, and discover infinite visual possibilities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-fadeIn" style={{animationDelay: '0.2s'}}>
          <Link to="/register" className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all flex items-center justify-center gap-2 hover:scale-105">
            Get Started <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/explore" className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all flex items-center justify-center gap-2 hover:scale-105">
            Explore Gallery
          </Link>
        </div>

        {/* Floating Preview Cards */}
        <div className="mt-20 w-full relative h-64 md:h-96 flex justify-center items-center gap-6 animate-fadeIn" style={{animationDelay: '0.3s'}}>
           <img src="https://picsum.photos/seed/landing1/300/400" className="w-40 md:w-64 h-56 md:h-80 object-cover rounded-2xl shadow-2xl rotate-[-10deg] animate-pulse" alt="Preview 1" />
           <img src="https://picsum.photos/seed/landing2/300/400" className="w-48 md:w-72 h-64 md:h-96 object-cover rounded-2xl shadow-2xl z-10 -translate-y-4" alt="Preview 2" />
           <img src="https://picsum.photos/seed/landing3/300/400" className="hidden md:block w-64 h-80 object-cover rounded-2xl shadow-2xl rotate-[10deg] animate-pulse" style={{animationDelay: '1s'}} alt="Preview 3" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="bg-background/50 border border-white/10 p-8 rounded-2xl hover:border-primary/50 transition-colors">
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-gray-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
           <Sparkles className="w-4 h-4 text-primary" /> Imaginex Space © 2026
        </div>
        <p>A demonstration platform for AI creation.</p>
      </footer>

    </div>
  );
}
