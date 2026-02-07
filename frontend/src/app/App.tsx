import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';
import logo from '@/assets/a83e4a1be0d90a5cb15fa1925678efb6a6ae0cf8.png';
import { Dashboard } from './components/Dashboard';
import { AgentsPage } from './components/AgentsPage';
import { CoursesPage } from './components/CoursesPage';
import { VideoPlayerPage } from './components/VideoPlayerPage';
import { AgentConfigPage } from './components/AgentConfigPage';
import { GPTTradersPage } from './components/GPTTradersPage';
import { ERPPage } from './components/ERPPage';
import { CRMPage } from './components/CRMPage';
import { UsersPage } from './components/UsersPage';
import { EmailPage } from './components/EmailPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabaseConfigError, supabaseConfigured } from './lib/supabaseClient';

type Page = 'login' | 'dashboard' | 'agents' | 'courses' | 'video' | 'agent-config' | 'gpt-traders' | 'erp' | 'crm' | 'users' | 'financial' | 'email';

function AppContent() {
  const { user, login, logout, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [currentVideo, setCurrentVideo] = useState({ id: '1', courseName: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<'unknown' | 'online' | 'offline'>('unknown');

  const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
  const apiConfigured = Boolean(apiUrl);

  useEffect(() => {
    if (loading) return;
    if (user && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
    if (!user && currentPage !== 'login') {
      setCurrentPage('login');
    }
  }, [user, loading, currentPage]);

  useEffect(() => {
    if (!apiConfigured) {
      setApiStatus('offline');
      return;
    }

    const controller = new AbortController();
    const checkHealth = async () => {
      try {
        const response = await fetch(`${apiUrl}/health`, { signal: controller.signal });
        setApiStatus(response.ok ? 'online' : 'offline');
      } catch {
        setApiStatus('offline');
      }
    };

    checkHealth();
    const interval = window.setInterval(checkHealth, 30_000);
    return () => {
      controller.abort();
      window.clearInterval(interval);
    };
  }, [apiConfigured, apiUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    try {
      await login(email, password);
      setCurrentPage('dashboard');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to sign in';
      setAuthError(message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentPage('login');
    setEmail('');
    setPassword('');
  };

  const handleNavigate = (appId: string) => {
    console.log('handleNavigate called with:', appId);
    if (appId === 'agents') {
      setCurrentPage('agents');
    } else if (appId === 'erp') {
      setCurrentPage('erp');
    } else if (appId === 'courses') {
      console.log('Setting page to courses');
      setCurrentPage('courses');
    } else if (appId === 'configure') {
      setCurrentPage('agent-config');
    } else if (appId === 'gpt-traders') {
      setCurrentPage('gpt-traders');
    } else if (appId === 'crm') {
      setCurrentPage('crm');
    } else if (appId === 'users') {
      setCurrentPage('users');
    } else if (appId === 'financial') {
      setCurrentPage('financial');
    } else if (appId === 'email') {
      setCurrentPage('email');
    }
  };

  const handleVideoSelect = (videoId: string, courseName: string) => {
    setCurrentVideo({ id: videoId, courseName });
    setCurrentPage('video');
  };

  if (currentPage === 'dashboard') {
    return <Dashboard onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'agents') {
    return <AgentsPage onBack={() => setCurrentPage('dashboard')} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'courses') {
    return <CoursesPage onBack={() => setCurrentPage('agents')} onLogout={handleLogout} onVideoSelect={handleVideoSelect} />;
  }

  if (currentPage === 'video') {
    // Get profile from localStorage
    const profile = localStorage.getItem('userProfile');
    const profileName = profile ? JSON.parse(profile).name : 'Trader';
    
    return (
      <VideoPlayerPage 
        onBack={() => setCurrentPage('courses')} 
        videoId={currentVideo.id}
        courseName={currentVideo.courseName}
        profileName={profileName}
      />
    );
  }

  if (currentPage === 'agent-config') {
    // Get profile from localStorage
    const profile = localStorage.getItem('userProfile');
    const profileName = profile ? JSON.parse(profile).name : 'Trader';
    
    return (
      <AgentConfigPage 
        onBack={() => setCurrentPage('agents')} 
        profileName={profileName}
      />
    );
  }

  if (currentPage === 'gpt-traders') {
    // Get profile from localStorage
    const profile = localStorage.getItem('userProfile');
    const profileName = profile ? JSON.parse(profile).name : 'Trader';
    
    return (
      <GPTTradersPage 
        onBack={() => setCurrentPage('agents')} 
        profileName={profileName}
      />
    );
  }

  if (currentPage === 'erp') {
    return <ERPPage onBack={() => setCurrentPage('dashboard')} onLogout={handleLogout} onNavigate={handleNavigate} />;
  }

  if (currentPage === 'crm') {
    return <CRMPage onBack={() => setCurrentPage('erp')} />;
  }

  if (currentPage === 'users') {
    return <UsersPage onBack={() => setCurrentPage('erp')} />;
  }

  if (currentPage === 'email') {
    return <EmailPage onBack={() => setCurrentPage('erp')} />;
  }

  if (currentPage === 'financial') {
    // Financial module - to be implemented
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-semibold text-white mb-4">Finance</h1>
          <p className="text-white/60 mb-8">Module under development</p>
          <button
            onClick={() => setCurrentPage('erp')}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/70 text-sm">Loading session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 overflow-hidden relative">
      {/* Modern Grid Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Radial Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.8) 100%)'
          }}
        />

        {/* Animated Gradients */}
        <motion.div
          className="absolute top-1/4 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Geometric Shapes */}
        <motion.div
          className="absolute top-20 right-20 w-32 h-32 border border-white/10 rounded-3xl"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-32 left-32 w-24 h-24 border border-white/10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-12"
          >
            <img src={logo} alt="Logo" className="w-20 h-20 object-contain" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-semibold text-white mb-2">
              Welcome
            </h1>
            <p className="text-white/60 text-sm">
              Sign in to continue
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {!supabaseConfigured && (
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                {supabaseConfigError ?? 'Supabase is not configured.'}
              </div>
            )}
            {!apiConfigured && (
              <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-100">
                Missing VITE_API_URL. Backend checks are disabled.
              </div>
            )}
            {apiConfigured && (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 flex items-center justify-between">
                <span>Backend status</span>
                <span className={
                  apiStatus === 'online'
                    ? 'text-green-300'
                    : apiStatus === 'offline'
                      ? 'text-red-300'
                      : 'text-white/50'
                }>
                  {apiStatus === 'online' ? 'Online' : apiStatus === 'offline' ? 'Offline' : 'Checking...'}
                </span>
              </div>
            )}
            {authError && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {authError}
              </div>
            )}
            {/* Email Field */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: focusedField === 'email' ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Email"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  style={{
                    textShadow: email ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                    letterSpacing: '0.5px'
                  }}
                />
              </motion.div>
            </div>

            {/* Password Field */}
            <div className="relative">
              <motion.div
                animate={{
                  scale: focusedField === 'password' ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Password"
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-5 py-4 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300 pr-12"
                  style={{
                    textShadow: password ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                    letterSpacing: '0.5px'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </motion.div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  Forgot password?
                </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black rounded-2xl px-6 py-4 font-semibold flex items-center justify-center gap-2 hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/20 group"
            >
              Sign in
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.form>

        </div>

        {/* Bottom Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-white/30 text-xs mt-8"
        >
          © 2026{' '}
          <span className="text-white font-medium" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
            MyGain
          </span>
          . All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
