import { useState } from 'react';
import { Sparkles, Wand2, RefreshCw } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';

export default function GeneratePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const styles = [
    'Realistic', 'Anime', 'Oil Painting', 'Cyberpunk', 'Watercolor', 'Sketch', '3D Render', 'Noir'
  ];

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResult(null);
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setResult(`https://picsum.photos/seed/${Math.random()}/800/800`);
    }, 2000);
  };

  const handleEnhance = () => {
    setPrompt(prev => prev ? `Highly detailed masterpiece, ${prev}, 8k resolution, cinematic lighting, trending on artstation` : '');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        
        <main className="flex-1 md:ml-64 p-4 md:p-8 min-h-[calc(100vh-64px)] animate-fadeIn">
          
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-heading font-bold mb-2 flex items-center gap-3">
                <Wand2 className="w-8 h-8 text-primary" /> Create New Art
              </h1>
              <p className="text-gray-400">Describe your imagination, select a style, and let the AI do the rest.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Controls Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Prompt Input */}
                <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                      Prompt
                    </label>
                    <button 
                      onClick={handleEnhance}
                      className="text-xs text-primary hover:text-primary-light flex items-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3 h-3" /> Enhance
                    </button>
                  </div>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A mystical forest at twilight, glowing flora, photorealistic..."
                    className="w-full bg-background border border-white/10 rounded-xl p-4 text-sm text-gray-200 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none h-32"
                  />
                </div>

                {/* Style Selection */}
                <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg">
                  <label className="block text-sm font-medium text-white mb-4">Art Style</label>
                  <div className="grid grid-cols-2 gap-3">
                    {styles.map(style => (
                      <button
                        key={style}
                        onClick={() => setSelectedStyle(style)}
                        className={`py-3 px-4 rounded-xl text-sm font-medium transition-all text-left border ${
                          selectedStyle === style 
                            ? 'bg-primary/20 border-primary text-white scale-[1.02] shadow-[0_0_15px_rgba(124,58,237,0.2)]' 
                            : 'bg-background border-white/5 text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced Settings (Visual only) */}
                <div className="bg-card border border-white/5 p-6 rounded-2xl shadow-lg opacity-60">
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-white">Advanced Settings</label>
                    <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-400">Pro</span>
                  </div>
                  <div className="space-y-4">
                     <div>
                       <div className="flex justify-between text-xs text-gray-400 mb-1">
                         <span>Guidance Scale</span> <span>7.5</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-gray-500 w-[75%]"></div>
                       </div>
                     </div>
                  </div>
                </div>

              </div>

              {/* Result Column */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="bg-card border border-white/5 rounded-3xl p-2 flex-1 min-h-[500px] flex flex-col relative overflow-hidden shadow-2xl">
                  
                  {isGenerating ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-pulse bg-background/50 rounded-2xl m-2 border border-white/5">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                        <Sparkles className="w-16 h-16 text-primary animate-spin-slow relative z-10" style={{ animationDuration: '4s' }} />
                      </div>
                      <p className="mt-6 text-lg font-medium bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                        Synthesizing pixels...
                      </p>
                      <p className="text-gray-500 text-sm mt-2">Applying {selectedStyle} style</p>
                    </div>
                  ) : result ? (
                    <div className="flex-1 relative group rounded-2xl overflow-hidden m-2 animate-fadeIn bg-black flex items-center justify-center">
                      <img 
                        src={result} 
                        alt="Generated artwork" 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay actions on result */}
                      <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                         <div>
                            <p className="text-white font-medium line-clamp-2 text-sm max-w-md shadow-sm">{prompt}</p>
                            <span className="text-xs text-primary mt-1 block">{selectedStyle}</span>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl m-2 bg-background/30 transition-colors hover:bg-background/50">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                        <Wand2 className="w-8 h-8 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-heading font-medium text-gray-300 mb-2">Ready to Create</h3>
                      <p className="text-gray-500 text-sm text-center max-w-sm px-4">
                        Tweak your settings, enter a descriptive prompt, and hit generate to see the magic happen.
                      </p>
                    </div>
                  )}

                  {/* Generate Button positioned below the image area */}
                  <div className="pt-4 px-2 pb-2">
                     <button 
                        onClick={handleGenerate}
                        disabled={!prompt.trim() || isGenerating}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transform hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {isGenerating ? (
                          <>
                            <LoadingSpinner size="sm" className="text-white" /> Processing...
                          </>
                        ) : result ? (
                           <>
                             <RefreshCw className="w-5 h-5" /> Generate Variations
                           </>
                        ) : (
                          <>
                            <Wand2 className="w-5 h-5" /> Generate Image
                          </>
                        )}
                      </button>
                      
                      {/* Sub-actions if result exists */}
                      {result && !isGenerating && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <button className="py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-sm">
                            Download HD
                          </button>
                          <button className="py-3 rounded-xl bg-primary/20 border border-primary/50 text-white hover:bg-primary/30 font-medium transition-colors text-sm">
                            Post to Feed
                          </button>
                        </div>
                      )}
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
