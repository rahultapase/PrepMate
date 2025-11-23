import React, { useEffect, useRef, useState } from 'react';
import { BrainCircuit, Mic, Video, CheckCircle, XCircle, Info, Lightbulb, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InterviewSystemCheck() {
  const [micAllowed, setMicAllowed] = useState<null | boolean>(null);
  const [camAllowed, setCamAllowed] = useState<null | boolean>(null);
  const [micError, setMicError] = useState('');
  const [camError, setCamError] = useState('');
  const [isChrome, setIsChrome] = useState<null | boolean>(null);
  const [browserError, setBrowserError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const [audioData, setAudioData] = useState<Uint8Array | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // Check browser type
  const checkBrowser = () => {
    const userAgent = navigator.userAgent;
    const isChromeBrowser = /Chrome/.test(userAgent) && !/Edge|Edg/.test(userAgent);
    
    if (isChromeBrowser) {
      setIsChrome(true);
    } else {
      setIsChrome(false);
      setBrowserError('Please use Google Chrome browser for the best experience.');
    }
  };

  useEffect(() => {
    // Check browser first
    checkBrowser();
    
    // Store Gemini API key from environment
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (apiKey) {
      sessionStorage.setItem('geminiApiKey', apiKey);
    }
    
    // Parallel device checks for faster loading
    const checkDevices = async () => {
      try {
        // Check microphone and webcam in parallel
        const [audioStream, videoStream] = await Promise.allSettled([
          navigator.mediaDevices.getUserMedia({ audio: true }),
          navigator.mediaDevices.getUserMedia({ video: true })
        ]);

        // Handle audio result
        if (audioStream.status === 'fulfilled') {
          setMicAllowed(true);
          audioStream.value.getTracks().forEach(track => track.stop());
        } else {
          setMicAllowed(false);
          setMicError('Microphone access denied or not found.');
        }

        // Handle video result
        if (videoStream.status === 'fulfilled') {
          setCamAllowed(true);
          if (videoRef.current) {
            videoRef.current.srcObject = videoStream.value;
          }
        } else {
          setCamAllowed(false);
          setCamError('Webcam access denied or not found.');
        }
      } catch (error) {
        console.error('Device check error:', error);
      }
    };

    checkDevices();

    // Cleanup video stream
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let audioStream: MediaStream | null = null;
    if (micAllowed === null) return;
    if (micAllowed === false) return;
    // Start audio waveform
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      audioStream = stream;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      function draw() {
        analyser.getByteTimeDomainData(dataArray);
        setAudioData(new Uint8Array(dataArray));
        animationRef.current = requestAnimationFrame(draw);
      }
      draw();
    });
    return () => {
      if (audioStream) audioStream.getTracks().forEach(track => track.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [micAllowed]);

  useEffect(() => {
    if (!canvasRef.current || !audioData) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#38bdf8'; // sky-400
    ctx.lineWidth = 3;
    ctx.beginPath();
    // Heartbeat style: use amplitude to create sharp peaks
    const sliceWidth = canvas.width / audioData.length;
    let x = 0;
    for (let i = 0; i < audioData.length; i++) {
      // Normalize and exaggerate for heart pulse effect
      const v = (audioData[i] - 128) / 128;
      // Heartbeat: sharp peak at center, smooth elsewhere
      let y = canvas.height / 2;
      if (Math.abs(v) > 0.2) {
        // Create a sharp peak for strong audio
        y -= v * canvas.height * 0.45 * (Math.abs(v) > 0.7 ? 1.5 : 1);
      } else {
        // Smooth baseline
        y -= v * canvas.height * 0.15;
      }
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    ctx.stroke();
  }, [audioData]);



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 relative overflow-x-hidden">
      <div className="mesh-grid absolute inset-0 opacity-20 pointer-events-none z-0"></div>
      <div className="absolute top-20 right-10 w-64 h-64 bg-violet-600/20 rounded-full blur-3xl animate-float z-0"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-float-slow z-0"></div>
      <header className="relative z-10 w-full py-6">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-violet-500 animate-pulse-glow" />
          <span className="text-2xl font-bold">
            <span className="text-white">Prep</span>
            <span className="gradient-text">Mate</span>
          </span>
          <span className="ml-4 text-lg text-sky-300 font-semibold">System Check</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10 w-full">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 glass-effect rounded-3xl p-10 shadow-2xl animate-fade-in">
          {/* Left: Video & Mic Check */}
          <div className="flex flex-col items-center gap-8 justify-center">
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <Video className="w-7 h-7 text-sky-400 animate-pulse-glow" />
                <span className="text-lg font-bold text-white">Webcam Check</span>
                {camAllowed === true && <CheckCircle className="w-5 h-5 text-green-400 animate-fade-in" />}
                {camAllowed === false && <XCircle className="w-5 h-5 text-red-400 animate-fade-in" />}
              </div>
              <div className="rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg bg-black/40 w-64 h-40 flex items-center justify-center">
                {camAllowed === true ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-sky-200 text-center px-4">{camError || 'Checking webcam...'}</div>
                )}
              </div>
            </div>
            <div className="w-full flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-3">
                <Mic className="w-7 h-7 text-violet-400 animate-pulse-glow" />
                <span className="text-lg font-bold text-white">Microphone Check</span>
                {micAllowed === true && <CheckCircle className="w-5 h-5 text-green-400 animate-fade-in" />}
                {micAllowed === false && <XCircle className="w-5 h-5 text-red-400 animate-fade-in" />}
              </div>
              <div className="rounded-2xl border-2 border-white/10 bg-black/40 w-64 h-14 flex flex-col items-center justify-center relative">
                {micAllowed === true ? (
                  <>
                    <span className="text-green-400 font-semibold">Microphone is working!</span>
                    <canvas ref={canvasRef} width={220} height={30} className="absolute left-0 bottom-0 w-full h-7" style={{ pointerEvents: 'none' }} />
                  </>
                ) : (
                  <span className="text-sky-200">{micError || 'Checking microphone...'}</span>
                )}
              </div>
            </div>
            {/* Browser Check */}
            <div className="w-full flex flex-col items-center gap-4 mt-8">
              <div className="flex items-center gap-3">
                <Globe className="w-7 h-7 text-orange-400 animate-pulse-glow" />
                <span className="text-lg font-bold text-white">Browser Check</span>
                {isChrome === true && <CheckCircle className="w-5 h-5 text-green-400 animate-fade-in" />}
                {isChrome === false && <XCircle className="w-5 h-5 text-red-400 animate-fade-in" />}
              </div>
              <div className="rounded-2xl border-2 border-white/10 bg-black/40 w-64 h-14 flex flex-col items-center justify-center">
                {isChrome === true ? (
                  <span className="text-green-400 font-semibold">Chrome browser detected!</span>
                ) : isChrome === false ? (
                  <span className="text-red-400 text-center px-2">{browserError}</span>
                ) : (
                  <span className="text-sky-200">Checking browser...</span>
                )}
              </div>
            </div>
          </div>
          {/* Right: Instructions & Tips */}
          <div className="flex flex-col gap-8 justify-between h-full">
            <div className="rounded-2xl bg-black/40 border border-white/10 p-6 mb-2 shadow-lg animate-fade-in flex flex-col gap-3">
              <div className="flex items-center gap-2 mb-2">
                <Info className="w-6 h-6 text-sky-400 animate-pulse-glow" />
                <span className="text-xl font-bold gradient-text">Instructions</span>
              </div>
              <ul className="text-sky-100 text-left list-disc list-inside space-y-1">
                <li>Ensure your face is clearly visible in the webcam preview.</li>
                <li>Speak into your microphone and check for the green status.</li>
                <li>Use Google Chrome browser only for optimal compatibility.</li>
                <li>Allow browser permissions for both camera and microphone.</li>
                <li>Use a quiet, well-lit environment for best results.</li>
                <li>Speak clearly and slowly for better voice recognition.</li>
                <li>Click "Start Live Session" when all checks are successful.</li>
              </ul>
            </div>
            <div className="rounded-2xl bg-black/40 border border-white/10 p-6 shadow-lg animate-fade-in flex flex-col gap-3 mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-6 h-6 text-amber-400 animate-pulse-glow" />
                <span className="text-xl font-bold gradient-text">Tips</span>
              </div>
              <ul className="text-amber-100 text-left list-disc list-inside space-y-1">
                <li>Use headphones to reduce echo and background noise.</li>
                <li>Position your camera at eye level for a natural look.</li>
                <li>Test your setup before starting the interview.</li>
                <li>Close unnecessary apps to improve performance.</li>
                <li>Stay calm and confident—you're ready!</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Privacy Policy Notice */}
        <div className="w-full max-w-md mx-auto mt-8 bg-blue-900/20 rounded-2xl p-4 border border-blue-500/30 shadow-lg">
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              id="privacy-checkbox"
              className="w-4 h-4 mt-0.5 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
            />
            <div className="text-xs text-blue-200 leading-relaxed">
              <span className="font-semibold text-blue-300">Privacy Notice:</span> By using this service, you agree that your interview responses and data may be processed by Google's AI services. Your interview data is saved to provide feedback. We do not share your personal information with third parties.
            </div>
          </div>
        </div>
        <button
          type="button"
          className="mt-8 px-10 py-4 rounded-2xl font-bold text-white text-xl bg-gradient-to-r from-indigo-500 via-sky-400 to-purple-500 shadow-xl transition-all duration-300 focus:outline-none ring-2 ring-purple-400/40 ring-offset-2 hover:scale-105 hover:shadow-purple-500/60 animate-pulse-glow"
          onClick={() => navigate('/livesession')}
          disabled={isChrome === false || camAllowed !== true || micAllowed !== true || !privacyAccepted}
        >
          Start Live Session
        </button>
      </main>
    </div>
  );
} 