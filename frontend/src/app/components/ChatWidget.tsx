import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Search, Send, Paperclip, Smile, Maximize2, ChevronLeft } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  online: boolean;
  unread?: number;
}

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [messageText, setMessageText] = useState('');

  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Carlos Silva',
      lastMessage: 'O relatório de vendas do mês passado',
      time: '14:34',
      online: true,
      unread: 2
    },
    {
      id: '2',
      name: 'Ana Costa',
      lastMessage: 'Perfeito! Vou revisar agora',
      time: '13:20',
      online: false
    },
    {
      id: '3',
      name: 'Roberto Mendes',
      lastMessage: 'Reunião confirmada para amanhã',
      time: '12:15',
      online: true,
      unread: 1
    },
    {
      id: '4',
      name: 'Juliana Santos',
      lastMessage: 'Obrigada pela ajuda!',
      time: '11:45',
      online: false
    },
    {
      id: '5',
      name: 'Pedro Oliveira',
      lastMessage: 'Vamos discutir isso na próxima sprint',
      time: 'Ontem',
      online: false
    },
    {
      id: '6',
      name: 'Mariana Rodrigues',
      lastMessage: 'Enviado!',
      time: 'Ontem',
      online: false
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Oi, alguém pode me ajudar com o relatório?',
      time: '14:32',
      sent: false
    },
    {
      id: '2',
      text: 'Claro! Qual relatório você precisa?',
      time: '14:33',
      sent: true
    },
    {
      id: '3',
      text: 'O relatório de vendas do mês passado',
      time: '14:34',
      sent: false
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onlineCount = contacts.filter(c => c.online).length;

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageText,
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        sent: true
      };
      setMessages([...messages, newMessage]);
      setMessageText('');
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-white hover:bg-white/90 text-black shadow-2xl shadow-white/20 flex items-center justify-center transition-all"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl shadow-2xl shadow-white/10 flex flex-col overflow-hidden"
          >
            {!selectedContact ? (
              <>
                {/* Contacts Header */}
                <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full bg-white/10">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">Chat da Equipe</h3>
                        <p className="text-white/60 text-xs">{onlineCount} membros online</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                      >
                        <X className="w-4 h-4 text-white" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar pessoas..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* Contacts List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredContacts.map((contact, index) => (
                    <motion.button
                      key={contact.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => setSelectedContact(contact)}
                      className="w-full p-4 flex items-center gap-3 hover:bg-white/5 border-b border-white/5 transition-all group"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        {contact.online && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white border-2 border-gray-900" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-white font-medium text-sm">{contact.name}</h4>
                          <span className="text-white/40 text-xs">{contact.time}</span>
                        </div>
                        <p className="text-white/60 text-xs truncate">{contact.lastMessage}</p>
                      </div>
                      {contact.unread && (
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                          <span className="text-black text-xs font-bold">{contact.unread}</span>
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Conversation Header */}
                <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedContact(null)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <ChevronLeft className="w-4 h-4 text-white" />
                    </motion.button>
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {selectedContact.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      {selectedContact.online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white border-2 border-gray-900" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold text-sm">{selectedContact.name}</h4>
                      <p className="text-white/60 text-xs">
                        {selectedContact.online ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Maximize2 className="w-4 h-4 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <X className="w-4 h-4 text-white" />
                    </motion.button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className="max-w-[75%]">
                        {!message.sent && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                              <span className="text-white text-xs">
                                {selectedContact.name.split(' ')[0][0]}
                              </span>
                            </div>
                            <span className="text-white/60 text-xs">{selectedContact.name}</span>
                          </div>
                        )}
                        <div
                          className={`p-3 rounded-2xl ${
                            message.sent
                              ? 'bg-white text-black rounded-br-sm'
                              : 'bg-white/10 text-white rounded-bl-sm'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-white/40 text-xs mt-1 px-1">{message.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="bg-black/40 backdrop-blur-xl border-t border-white/10 p-4">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Paperclip className="w-5 h-5 text-white" />
                    </motion.button>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Digite sua mensagem..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <Smile className="w-5 h-5 text-white" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleSendMessage}
                      className="p-2 rounded-lg bg-white hover:bg-white/90 transition-all"
                    >
                      <Send className="w-5 h-5 text-black" />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
