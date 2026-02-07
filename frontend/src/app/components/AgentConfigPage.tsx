import { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Edit2, Check, X } from 'lucide-react';
import { Header } from './Header';

interface AgentConfigPageProps {
  onBack: () => void;
  profileName: string;
}

export function AgentConfigPage({ onBack, profileName }: AgentConfigPageProps) {
  const [isAgentActive, setIsAgentActive] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('(51) 98631-7625');
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [tempPhoneNumber, setTempPhoneNumber] = useState(phoneNumber);

  // Format a phone number (local format)
  const formatPhoneNumber = (value: string): string => {
    // Remove non-numeric characters
    const numbers = value.replace(/\D/g, '');
    
    // Limit to 11 digits (area code + number)
    const limitedNumbers = numbers.slice(0, 11);
    
    // Apply format (XX) XXXXX-XXXX or (XX) XXXX-XXXX
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 6) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else if (limitedNumbers.length <= 10) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setTempPhoneNumber(formatted);
  };

  const handleSavePhone = () => {
    setPhoneNumber(tempPhoneNumber);
    setIsEditingPhone(false);
  };

  const handleCancelEdit = () => {
    setTempPhoneNumber(phoneNumber);
    setIsEditingPhone(false);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <Header
        title="Configure My Agent"
        subtitle="Personalize e configure seu assistente inteligente"
        onBack={onBack}
        showProfile
        profileName={profileName}
      />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Agent Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Agent Status</h2>
                <p className="text-white/50 text-sm">
                  {isAgentActive ? 'Your agent is active and ready to respond' : 'Your agent is inactive'}
                </p>
              </div>
              
              {/* Toggle Switch */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAgentActive(!isAgentActive)}
                className={`relative w-16 h-9 rounded-full transition-all duration-300 ${
                  isAgentActive 
                    ? 'bg-white' 
                    : 'bg-white/10 border border-white/20'
                }`}
              >
                <motion.div
                  animate={{
                    x: isAgentActive ? 28 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  className={`absolute top-1 w-7 h-7 rounded-full shadow-lg ${
                    isAgentActive 
                      ? 'bg-[#0a0a0a]' 
                      : 'bg-white/40'
                  }`}
                />
              </motion.button>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                isAgentActive 
                  ? 'bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]' 
                  : 'bg-white/20'
              }`} />
              <span className={`text-sm ${
                isAgentActive 
                  ? 'text-white font-medium' 
                  : 'text-white/40'
              }`}>
                {isAgentActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>

          {/* Phone Number Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-8"
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Active Number</h2>
                <p className="text-white/50 text-sm">
                  Phone number linked to your agent
                </p>
              </div>
              
              {!isEditingPhone && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingPhone(true)}
                  className="p-2.5 rounded-lg border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <Edit2 className="w-4 h-4 text-white/70" />
                </motion.button>
              )}
            </div>

            {!isEditingPhone ? (
              /* Display Mode */
              <div className="flex items-center gap-4 p-5 bg-white/[0.02] rounded-xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <Phone className="w-6 h-6 text-white/70" />
                </div>
                <div>
                  <p className="text-white/40 text-xs mb-1">Phone</p>
                  <p className="text-white text-lg font-medium">{phoneNumber}</p>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={tempPhoneNumber}
                    onChange={handlePhoneChange}
                    className="w-full px-5 py-4 bg-white/[0.02] border border-white/20 rounded-xl text-white placeholder-white/30 focus:border-white/40 focus:outline-none transition-all"
                    placeholder="(51) 98631-7625"
                    maxLength={15}
                  />
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSavePhone}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#0a0a0a] rounded-xl font-medium hover:bg-white/90 transition-all"
                  >
                    <Check className="w-4 h-4" />
                    Save
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelEdit}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/20 text-white rounded-xl font-medium hover:bg-white/10 hover:border-white/30 transition-all"
                  >
                    <X className="w-4 h-4" />
                    Cancelar
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6"
          >
            <p className="text-white/40 text-sm leading-relaxed">
              The agent will be linked to the configured phone number. Ensure the number is correct and active to receive messages.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
