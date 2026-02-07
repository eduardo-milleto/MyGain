import { motion } from 'motion/react';
import { Database, Bot, LogOut, BookOpen, Lock } from 'lucide-react';
import logo from 'figma:asset/a83e4a1be0d90a5cb15fa1925678efb6a6ae0cf8.png';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (appId: string) => void;
}

export function Dashboard({ onLogout, onNavigate }: DashboardProps) {
  const { user } = useAuth();

  const apps = [
    {
      id: 'erp',
      name: 'ERP',
      description: 'Integrated enterprise management system',
      icon: Database,
      multiIcon: false,
      requiresEmployee: true,
    },
    {
      id: 'agents',
      name: 'Agents & Courses',
      description: 'Assistentes inteligentes e plataforma de aprendizado',
      icon: Bot,
      secondIcon: BookOpen,
      multiIcon: true,
      requiresEmployee: false,
    },
  ];

  const canAccessApp = (app: typeof apps[0]) => {
    if (!user) return false;
    if (app.requiresEmployee && user.type === 'client') return false;
    if (!app.requiresEmployee && user.type === 'employee') return true;
    return true;
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        onClick={onLogout}
        className="absolute top-6 right-6 z-50 p-3 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
      >
        <LogOut className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.button>
      {/* Modern Mesh Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Fine Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}
        />
        
        {/* Radial Gradient Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.9) 100%)'
          }}
        />

        {/* Subtle animated glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center mb-16"
        >
          <img src={logo} alt="Logo" className="w-20 h-20 object-contain mb-6" />
          <p className="text-white/50 text-sm">Choose your workspace</p>
        </motion.div>

        {/* Apps Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
        >
          {apps.map((app, index) => {
            const hasAccess = canAccessApp(app);
            return (
              <motion.button
                key={app.id}
                onClick={() => hasAccess && onNavigate(app.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                whileHover={hasAccess ? { scale: 1.02, y: -3 } : {}}
                whileTap={hasAccess ? { scale: 0.98 } : {}}
                disabled={!hasAccess}
                className={`relative group bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8 transition-all duration-300 text-left overflow-hidden ${
                  hasAccess 
                    ? 'hover:border-white/30 cursor-pointer' 
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                {/* Subtle hover glow */}
                {hasAccess && (
                  <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                {/* Lock Icon */}
                {!hasAccess && (
                  <div className="absolute top-4 right-4 z-20">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white/60" />
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="mb-5 flex items-center gap-3">
                    {app.multiIcon && app.secondIcon ? (
                      <>
                        <Bot className="w-11 h-11 text-white/90" strokeWidth={1.5} />
                        <BookOpen className="w-11 h-11 text-white/90" strokeWidth={1.5} />
                      </>
                    ) : (
                      <app.icon className="w-11 h-11 text-white/90" strokeWidth={1.5} />
                    )}
                  </div>
                  <h3 className="text-xl font-medium text-white mb-2">
                    {app.name}
                  </h3>
                  <p className="text-white/40 text-xs leading-relaxed">
                    {app.description}
                  </p>
                </div>

              {/* Corner accent */}
              {hasAccess && (
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-white/20 to-transparent" />
                  <div className="absolute top-0 right-0 h-full w-[1px] bg-gradient-to-b from-white/20 to-transparent" />
                </div>
              )}
            </motion.button>
          );
          })}
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-white/30 text-xs mt-16"
        >
          Desenvolvido por{' '}
          <span className="text-white font-medium" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
            MyGain
          </span>
          {' '}© 2026
        </motion.p>
      </div>
    </div>
  );
}
