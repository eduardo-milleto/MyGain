import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Plus, MessageSquare, Menu, X, TrendingUp } from 'lucide-react';
import { Header } from './Header';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface GPTTradersPageProps {
  onBack: () => void;
  profileName: string;
}

export function GPTTradersPage({ onBack, profileName }: GPTTradersPageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [chats, setChats] = useState<Chat[]>([
    {
      id: '1',
      title: 'Análise de Mercado',
      messages: [],
      createdAt: new Date(Date.now() - 86400000),
    },
    {
      id: '2',
      title: 'Estratégias de Trading',
      messages: [],
      createdAt: new Date(Date.now() - 172800000),
    },
  ]);
  
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setInputValue('');
  };

  const handleSelectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const simulateAssistantResponse = (userMessage: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      const responses = [
        "Com base na análise técnica atual, o mercado está apresentando sinais de consolidação. Recomendo aguardar um rompimento claro antes de posicionar.",
        "Os indicadores fundamentais sugerem uma tendência de alta no médio prazo. O volume crescente confirma o interesse institucional.",
        "Identifiquei uma oportunidade interessante em ações de tecnologia. Os resultados do último trimestre superaram as expectativas.",
        "Para gestão de risco, sugiro diversificar a carteira com 40% em ações, 30% em renda fixa e 30% em ativos alternativos.",
        "O mercado financeiro hoje está volátil devido aos dados econômicos recentes. Mantenha sua estratégia de longo prazo.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: Date.now().toString() + '-assistant',
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // Update or create chat
      if (currentChatId) {
        setChats(prev => prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: [...chat.messages, assistantMessage] }
            : chat
        ));
      } else {
        // Create new chat
        const newChat: Chat = {
          id: Date.now().toString(),
          title: userMessage.slice(0, 30) + (userMessage.length > 30 ? '...' : ''),
          messages: [...messages, assistantMessage],
          createdAt: new Date(),
        };
        setChats(prev => [newChat, ...prev]);
        setCurrentChatId(newChat.id);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update existing chat or prepare to create a new one
    if (currentChatId) {
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, userMessage] }
          : chat
      ));
    }
    
    setInputValue('');
    simulateAssistantResponse(inputValue.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col">
      <Header
        title="GPT dos Traders"
        subtitle="Assistente de IA especializado em trading e mercado financeiro"
        onBack={onBack}
        showProfile
        profileName={profileName}
      />

      <div className="flex-1 flex pt-20 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="w-64 bg-[#0a0a0a]/95 backdrop-blur-xl border-r border-white/10 flex flex-col"
            >
              {/* New Chat Button */}
              <div className="p-3 border-b border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleNewChat}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">Nova Conversa</span>
                </motion.button>
              </div>

              {/* Chat History */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {chats.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Nenhuma conversa ainda</p>
                  </div>
                ) : (
                  chats.map((chat) => (
                    <motion.button
                      key={chat.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                        currentChatId === chat.id
                          ? 'bg-white/10 border border-white/20'
                          : 'bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-white/50 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">
                            {chat.title}
                          </p>
                          <p className="text-white/40 text-xs mt-1">
                            {chat.messages.length} mensagens
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Toggle Sidebar Button */}
          <div className="px-4 py-3 border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-sm">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 transition-all"
            >
              {isSidebarOpen ? (
                <X className="w-4 h-4 text-white/70" />
              ) : (
                <Menu className="w-4 h-4 text-white/70" />
              )}
            </motion.button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            {messages.length === 0 ? (
              /* Empty State */
              <div className="h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="text-center max-w-2xl"
                >
                  <div className="relative w-20 h-20 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-xl"></div>
                    <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-semibold text-white mb-4 tracking-tight">
                    Como posso ajudar?
                  </h2>
                  <p className="text-white/40 text-base mb-10 max-w-md mx-auto">
                    Sou seu assistente especializado em trading e mercado financeiro. Faça perguntas sobre análises, estratégias e tendências do mercado.
                  </p>

                  {/* Suggestion Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-xl mx-auto">
                    {[
                      'Analisar tendências do mercado',
                      'Estratégias de investimento',
                      'Gestão de risco',
                      'Análise técnica avançada',
                    ].map((suggestion, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setInputValue(suggestion);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                        className="px-5 py-4 bg-white/[0.02] border border-white/10 hover:border-white/20 hover:bg-white/[0.05] rounded-2xl text-white/60 hover:text-white text-sm transition-all text-left group"
                      >
                        <span className="group-hover:text-white transition-colors">{suggestion}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>
            ) : (
              /* Messages */
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((message, idx) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className={`flex gap-4 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[80%] px-6 py-4 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-white text-[#0a0a0a] shadow-lg shadow-white/10'
                          : 'bg-white/[0.03] border border-white/10 text-white'
                      }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>

                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-white text-[#0a0a0a] flex items-center justify-center flex-shrink-0 font-semibold text-sm shadow-lg shadow-white/20">
                        {profileName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div className="px-6 py-4 rounded-2xl bg-white/[0.03] border border-white/10">
                      <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.15,
                            }}
                            className="w-2 h-2 bg-white/60 rounded-full"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-white/5 p-4 bg-[#0a0a0a]/95 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Faça uma pergunta sobre trading ou mercado financeiro..."
                  rows={1}
                  className="w-full px-6 py-4 pr-16 bg-white/[0.03] border border-white/20 focus:border-white/40 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all resize-none shadow-lg shadow-white/5"
                  style={{
                    minHeight: '56px',
                    maxHeight: '200px',
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className={`absolute right-2 bottom-2 p-3 rounded-xl transition-all ${
                    inputValue.trim() && !isTyping
                      ? 'bg-white text-[#0a0a0a] hover:bg-white/90 shadow-lg shadow-white/20'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </motion.button>
              </div>
              <p className="text-white/25 text-xs text-center mt-4">
                GPT dos Traders pode cometer erros. Verifique informações importantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
