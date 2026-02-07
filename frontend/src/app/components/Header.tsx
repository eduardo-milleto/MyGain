import { motion } from 'motion/react';
import { ArrowLeft, User } from 'lucide-react';
import logo from '@/assets/a83e4a1be0d90a5cb15fa1925678efb6a6ae0cf8.png';

interface HeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  actionButton?: {
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
    onClick: () => void;
  };
  showProfile?: boolean;
  profileName?: string;
}

export function Header({ title, subtitle, onBack, actionButton, showProfile, profileName }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="p-2 rounded-full border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-white/70" />
          </button>

          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-white font-medium text-lg">{title}</h1>
              <p className="text-white/50 text-xs">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {showProfile && profileName && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <User className="w-4 h-4 text-white/70" />
              <span className="text-white/90 text-sm">{profileName}</span>
            </div>
          )}
          
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black hover:bg-white/90 transition-all duration-300 font-medium text-sm"
            >
              {actionButton.icon && <actionButton.icon className="w-4 h-4" />}
              {actionButton.label}
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
