import React, { useRef, useState, useEffect } from 'react';
import { BrainCircuit, User, Pencil, X, Sparkles, Zap, ArrowRight, AlertCircle, CheckCircle2, GraduationCap, Calendar, BookOpen, Briefcase, Target, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { setDoc, doc, getDoc } from 'firebase/firestore';
import { FeaturesSection } from './FeaturesSection';
import { HowItWorksSection } from './HowItWorksSection';
import { AboutSection } from './AboutSection';
import { Footer } from './Footer';

const Home = () =>{
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = "Tell me about a challenging project you worked on and how you overcame obstacles to complete it successfully.";
  
  const [profile, setProfile] = useState({
    fullName: '',
    graduation: '',
    year: '',
    branch: '',
    experience: '',
    role: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

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

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const modalRef = useRef(null);

  // Fetch profile from Firestore when modal opens
  useEffect(() => {
    const fetchProfile = async () => {
      if (profileOpen && user?.uid) {
        setLoadingProfile(true);
        setEditMode(false);
        setError('');
        try {
          const docSnap = await getDoc(doc(db, 'users', user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              fullName: data.fullName || '',
              graduation: data.graduation || '',
              year: data.year || '',
              branch: data.branch || '',
              experience: data.experience || '',
              role: data.role || '',
            });
          } else {
            setProfile({ fullName: '', graduation: '', year: '', branch: '', experience: '', role: '' });
            setEditMode(true);
          }
        } catch (err) {
          setError('Failed to load profile.');
        } finally {
          setLoadingProfile(false);
        }
      }
    };
    if (profileOpen) {
      fetchProfile();
    }
  }, [profileOpen, user?.uid]);

  const handleProfileSave = async () => {
    setError('');
    if (!user?.uid) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        email: user.email || '',
        updatedAt: new Date().toISOString(),
      });
      setEditMode(false);
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-slate-900/10 to-transparent"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
      <div className="absolute top-20 right-10 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-slate-950/90 backdrop-blur-xl shadow-lg shadow-violet-500/5 border-b border-slate-800/50' 
            : 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl opacity-70 group-hover:opacity-100 blur transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-violet-600 to-indigo-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <BrainCircuit className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  Prep
                </span>
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Mate
                </span>
              </span>
            </div>
            
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
              >
                <span className="relative z-10">Features</span>
                <span className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
              >
                <span className="relative z-10">How It Works</span>
                <span className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
              <button
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className="relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
              >
                <span className="relative z-10">About</span>
                <span className="absolute inset-0 bg-slate-800/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 group-hover:w-3/4 transition-all duration-300"></span>
              </button>
            </nav>
            
            <div className="hidden lg:flex items-center gap-3">
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute inset-0 bg-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button
                onClick={() => setProfileOpen(true)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-300 hover:text-white transition-colors relative group"
              >
                <span className="relative z-10">Profile</span>
                <span className="absolute inset-0 bg-slate-800/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </button>
              <button 
                onClick={async () => {
                  await logout();
                  window.location.href = "http://localhost:5173";
                }}
                className="group relative px-6 py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Sign Out
                </span>
              </button>
            </div>

            <button
              type="button"
              className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            
            <div className="fixed top-20 left-0 right-0 lg:hidden bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/50 shadow-2xl">
              <div className="px-4 pt-2 pb-6 space-y-1 max-h-[calc(100vh-5rem)] overflow-y-auto">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  Features
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  How It Works
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-base font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  About
                </button>
                
                <div className="pt-4 border-t border-slate-800/50 space-y-3">
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/dashboard');
                    }}
                    className="w-full px-5 py-3 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all duration-300"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileOpen(true);
                    }}
                    className="w-full px-5 py-3 text-base font-semibold text-slate-300 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all duration-300"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={async () => {
                      setMobileMenuOpen(false);
                      await logout();
                      window.location.href = "http://localhost:5173";
                    }}
                    className="w-full px-6 py-3 rounded-xl font-semibold text-white text-base bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Sign Out
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pt-32 pb-20 relative z-10 w-full">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-500/20 backdrop-blur-sm shadow-lg shadow-violet-500/10">
              <div className="relative">
                <Sparkles className="h-4 w-4 text-violet-400 animate-pulse" />
                <div className="absolute inset-0 bg-violet-400 blur-sm opacity-50 animate-pulse"></div>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                NextGen AI Interview Technology
              </span>
              <Zap className="h-3 w-3 text-violet-400" />
            </div>

            {/* Enhanced Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
                <span className="text-white">Ace Your Next</span>
                <br />
                <span className="text-white">Interview with</span>
                <br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">
                    PrepMate
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-full blur-sm"></div>
                </span>
              </h1>
              
              <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                Build confidence and outshine competitors with{' '}
                <span className="text-white font-semibold">personalized AI interview coaching</span>{' '}
                tailored to your skills and target role, complete with real-time feedback.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/interview')}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-lg transition-all duration-300 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300 rounded-2xl"></div>
                <span className="relative z-10">Start Practice</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 rounded-3xl opacity-20 blur-3xl"></div>
            
            <div className="relative rounded-3xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 opacity-20 blur-xl"></div>
              
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

              <div className="relative p-8 space-y-6">
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

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
                  <div className="relative bg-slate-950/80 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-violet-500 min-h-[120px] flex items-start shadow-lg">
                    <p className="text-white text-base leading-relaxed">
                      {displayedText}
                      <span className={`inline-block w-0.5 h-5 bg-violet-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}></span>
                    </p>
                  </div>
                </div>

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

                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-3">
                    {[
                      <svg key="mic" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"/></svg>,
                      <svg key="video" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>,
                      <svg key="menu" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"/></svg>
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
        </div>
      </main>

      <FeaturesSection />
      <HowItWorksSection />
      <AboutSection />
      <Footer />

      {profileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div ref={modalRef} className="relative w-full max-w-2xl">
            <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-3xl opacity-30 blur-2xl"></div>
            <div className="relative bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setProfileOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                  {editMode ? 'Complete Your Profile' : 'Profile Details'}
                </h2>
                <p className="text-slate-400">
                  {editMode ? 'Help us personalize your interview experience' : 'Your information'}
                </p>
              </div>

              {!editMode && !loadingProfile && (
                <button 
                  onClick={() => setEditMode(true)}
                  className="absolute top-6 right-16 text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 font-medium">{error}</span>
                </div>
              )}

              {loadingProfile ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-400 mt-4">Loading profile...</p>
                </div>
              ) : editMode ? (
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleProfileSave(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      value={profile.fullName} 
                      onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} 
                    />
                    <input 
                      type="text" 
                      placeholder="Graduation (e.g. B.Tech)" 
                      className="rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      value={profile.graduation} 
                      onChange={e => setProfile(p => ({ ...p, graduation: e.target.value }))} 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input 
                      type="text" 
                      placeholder="Year of Passing" 
                      className="rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      value={profile.year} 
                      onChange={e => setProfile(p => ({ ...p, year: e.target.value }))} 
                    />
                    <input 
                      type="text" 
                      placeholder="Branch (e.g. CSE)" 
                      className="rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                      value={profile.branch} 
                      onChange={e => setProfile(p => ({ ...p, branch: e.target.value }))} 
                    />
                  </div>

                  <select 
                    className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                    value={profile.experience} 
                    onChange={e => setProfile(p => ({ ...p, experience: e.target.value }))}
                  >
                    <option value="">Experience Level</option>
                    <option value="Fresher">Fresher</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={`${i + 1} years`}>{i + 1} years</option>
                    ))}
                  </select>

                  <input 
                    type="text" 
                    placeholder="Desired Job Role" 
                    className="w-full rounded-xl px-4 py-3 bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all" 
                    value={profile.role} 
                    onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} 
                  />

                  <div className="flex gap-3 mt-6">
                    <button 
                      type="submit"
                      disabled={saving}
                      className="flex-1 group relative px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-5 h-5" />
                          Save Profile
                        </span>
                      )}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditMode(false)}
                      className="px-6 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 transition-all duration-300"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{profile.fullName || 'Not set'}</div>
                      <div className="text-sm text-slate-400">{user?.email || 'No email'}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="p-2 rounded-lg bg-violet-500/10">
                        <GraduationCap className="w-5 h-5 text-violet-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Graduation</div>
                        <div className="text-white font-semibold">{profile.graduation || 'Not set'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="p-2 rounded-lg bg-blue-500/10">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Year</div>
                        <div className="text-white font-semibold">{profile.year || 'Not set'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="p-2 rounded-lg bg-cyan-500/10">
                        <BookOpen className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Branch</div>
                        <div className="text-white font-semibold">{profile.branch || 'Not set'}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                      <div className="p-2 rounded-lg bg-purple-500/10">
                        <Briefcase className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Experience</div>
                        <div className="text-white font-semibold">{profile.experience || 'Not set'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <div className="p-2 rounded-lg bg-indigo-500/10">
                      <Target className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Desired Role</div>
                      <div className="text-white font-semibold">{profile.role || 'Not set'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Home;