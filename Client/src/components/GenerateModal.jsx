import { useState } from 'react';
import { Sparkles, Wand2 } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export default function GenerateModal({ isOpen, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const styles = [
    'Realistic', 'Anime', 'Oil Painting', 'Cyberpunk', 'Watercolor', 'Sketch'
  ];

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setResult(`https://picsum.photos/seed/${Math.random()}/500/500`);
    }, 2000);
  };

  const handleClose = () => {
    setPrompt('');
    setResult(null);
    setSelectedStyle('Realistic');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div className="bg-card w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Inputs */}
        <div className="p-6 md:w-1/2 flex flex-col gap-6 border-r border-white/5 overflow-y-auto">
          <div>
            <h2 className="text-2xl font-heading font-bold mb-1 flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-primary" /> Create
            </h2>
            <p className="text-sm text-gray-400">Turn your imagination into art.</p>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Prompt</label>
            <textarea 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to see..."
              className="w-full bg-background border border-white/10 rounded-xl p-3 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-24"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300">Style</label>
            <div className="flex flex-wrap gap-2">
              {styles.map(style => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    selectedStyle === style 
                      ? 'bg-primary/20 border-primary text-primary' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-400 hover:to-cyan-400 text-white font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-95"
          >
            {isGenerating ? <LoadingSpinner size="sm" /> : <Wand2 className="w-5 h-5" />}
            {isGenerating ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Right Side: Result Area */}
        <div className="md:w-1/2 bg-background flex flex-col items-center justify-center min-h-[300px] md:min-h-full p-4">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-4 animate-pulse">
               <Sparkles className="w-12 h-12 text-primary animate-spin-slow" style={{ animationDuration: '3s' }}/>
               <p className="text-gray-400 text-sm">Dreaming up your vision...</p>
            </div>
          ) : result ? (
             <div className="relative w-full h-full flex items-center justify-center group animate-fadeIn">
               <img 
                 src={result} 
                 alt="Generated" 
                 className="max-w-full max-h-[80vh] rounded-xl object-contain shadow-lg"
               />
               <button className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white text-sm font-medium transition-colors opacity-0 group-hover:opacity-100">
                 Share to Feed
               </button>
             </div>
          ) : (
            <div className="text-center p-6 border-2 border-dashed border-white/10 rounded-2xl w-full h-full flex flex-col items-center justify-center text-gray-500">
               <Wand2 className="w-10 h-10 mb-2 opacity-50" />
               <p className="text-sm">Your masterpiece will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
