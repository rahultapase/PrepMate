import { useState, useEffect } from 'react';
import { BrainCircuit, User, X } from 'lucide-react';

export const InterviewCard = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Tell me about a challenging project you worked on and how you overcame obstacles to complete it successfully.";

  // Internal animation logic
  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
      {/* Glow effect behind card */}
      <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-3xl"></div>
      
      {/* Main interview card */}
      <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Animated gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-20 blur-xl"></div>
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Interview Session</h3>
                <p className="text-violet-100 text-xs">Powered by Advanced AI</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30">
              <div className="relative">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
              </div>
              <span className="text-xs font-bold text-white uppercase tracking-wider">LIVE</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative p-8 space-y-6">
          {/* Avatars */}
          <div className="flex items-start justify-between">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-2 bg-violet-500/20 rounded-full blur-lg animate-pulse"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-slate-400 text-sm font-medium mt-2">AI Interviewer</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="absolute -inset-2 bg-slate-500/20 rounded-full blur-lg"></div>
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
              </div>
              <span className="text-slate-400 text-sm font-medium mt-2">You</span>
            </div>
          </div>

          {/* Question card */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
            <div className="relative bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-violet-500 min-h-[120px] flex items-start shadow-lg">
              <p className="text-white text-base leading-relaxed">
                {displayedText}
                <span className={`inline-block w-0.5 h-5 bg-violet-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
              </p>
            </div>
          </div>

          {/* Response area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm font-semibold">Your Response</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-xs font-mono">00:42</span>
              </div>
            </div>
            <div className="bg-slate-950/80 backdrop-blur-sm rounded-2xl p-5 min-h-[70px] flex items-center border border-slate-800">
              <div className="flex gap-2">
                <div className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-pulse"></div>
                <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              {[
                <svg key="mic" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/></svg>,
                <svg key="vid" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
                <svg key="opt" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
              ].map((icon, i) => (
                <button key={i} className="group w-11 h-11 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-violet-500/50 flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <div className="text-white group-hover:text-violet-400 transition-colors">
                    {icon}
                  </div>
                </button>
              ))}
            </div>
            <button className="group relative w-11 h-11 rounded-full bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/30 hover:shadow-red-500/50">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};