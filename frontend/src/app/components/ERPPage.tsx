import { motion } from 'motion/react';
import { ArrowLeft, Database, Users, DollarSign, Mail, Lock } from 'lucide-react';
import logo from '@/assets/a83e4a1be0d90a5cb15fa1925678efb6a6ae0cf8.png';
import { ChatWidget } from './ChatWidget';
import { useAuth } from '../contexts/AuthContext';

interface ERPPageProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (moduleId: string) => void;
}

export function ERPPage({ onBack, onLogout, onNavigate }: ERPPageProps) {
  const { hasPermission } = useAuth();

  const modules = [
    {
      id: 'crm',
      title: 'CRM',
      description: 'Customer relationship management',
      icon: Database,
    },
    {
      id: 'users',
      title: 'Users',
      description: 'User and permission management',
      icon: Users,
    },
    {
      id: 'financial',
      title: 'Finance',
      description: 'Controle financeiro e fluxo de caixa',
      icon: DollarSign,
    },
    {
      id: 'email',
      title: 'Email',
      description: 'Message management',
      icon: Mail,
    },
  ];

  return (
    <div className="min-h-screen w-full bg-black overflow-hidden relative">
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

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="text-xl font-semibold text-white">ERP</h1>
                <p className="text-sm text-white/60">Integrated enterprise management system</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onLogout}
              className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
            >
              Sair
            </motion.button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-semibold text-white mb-3">
                Choose a module
              </h2>
              <p className="text-white/60">
                Select the module you want to access
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((module, index) => {
                const hasAccess = hasPermission(module.id);
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={hasAccess ? { scale: 1.02, y: -5 } : {}}
                    whileTap={hasAccess ? { scale: 0.98 } : {}}
                    onClick={() => hasAccess && onNavigate(module.id)}
                    className={`group h-full ${hasAccess ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}
                  >
                    <div className={`bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 transition-all duration-300 shadow-2xl h-full flex flex-col relative ${
                      hasAccess ? 'hover:bg-white/10 hover:border-white/20 hover:shadow-white/10' : ''
                    }`}>
                      {/* Lock Icon */}
                      {!hasAccess && (
                        <div className="absolute top-4 right-4 z-10">
                          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white/60" />
                          </div>
                        </div>
                      )}

                      {/* Icon Container */}
                      <div className="mb-6 relative">
                        <div className={`w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center transition-all duration-300 ${
                          hasAccess ? 'group-hover:bg-white/20 group-hover:border-white/30' : ''
                        }`}>
                          <module.icon className="w-8 h-8 text-white" />
                        </div>
                        {/* Glow Effect */}
                        {hasAccess && (
                          <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/5 blur-xl transition-all duration-300" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-2 flex-1">
                        <h3 className={`text-2xl font-semibold text-white transition-colors ${
                          hasAccess ? 'group-hover:text-white/90' : ''
                        }`}>
                          {module.title}
                        </h3>
                        <p className={`text-white/60 transition-colors text-sm leading-relaxed h-10 ${
                          hasAccess ? 'group-hover:text-white/70' : ''
                        }`}>
                          {module.description}
                        </p>
                      </div>

                      {/* Arrow Indicator */}
                      {hasAccess ? (
                        <div className="mt-6 flex items-center gap-2 text-white/40 group-hover:text-white/60 transition-colors">
                          <span className="text-sm font-medium">Acessar</span>
                          <motion.div
                            animate={{ x: [0, 4, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.div>
                        </div>
                      ) : (
                        <div className="mt-6 flex items-center gap-2 text-white/30">
                          <Lock className="w-4 h-4" />
                          <span className="text-sm font-medium">Bloqueado</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl py-6">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-white/30 text-xs">
              © 2026{' '}
              <span className="text-white font-medium" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
                MyGain
              </span>
              . Todos os direitos reservados.
            </p>
          </div>
        </footer>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
