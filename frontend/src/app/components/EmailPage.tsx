import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Inbox, Send, FileText, Archive, Trash2, Search, Filter, SortAsc, Star, Paperclip, X, Bold, Italic, Underline, Link2, Image, Smile, MoreHorizontal, Reply, ArchiveX } from 'lucide-react';
import { Header } from './Header';
import { ChatWidget } from './ChatWidget';

interface EmailPageProps {
  onBack: () => void;
}

interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  preview: string;
  content: string;
  time: string;
  date: string;
  starred: boolean;
  hasAttachment: boolean;
  attachments?: number;
  folder: 'inbox' | 'sent' | 'drafts' | 'archived' | 'trash';
}

export function EmailPage({ onBack }: EmailPageProps) {
  const [selectedFolder, setSelectedFolder] = useState<'inbox' | 'sent' | 'drafts' | 'archived' | 'trash'>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [showNewEmailModal, setShowNewEmailModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    message: ''
  });

  const [emails, setEmails] = useState<Email[]>([
    {
      id: '1',
      sender: 'Carlos Silva',
      senderEmail: 'carlos.silva@empresa.com',
      subject: 'Relatório de Vendas Q1 2026',
      preview: 'Olá, segue anexo o relatório completo de vendas...',
      content: `Olá,

Segue anexo o relatório completo de vendas do primeiro trimestre de 2026. Os números estão muito positivos, com crescimento de 35% em relação ao trimestre anterior.

Destaques:
- Vendas online: +45%
- Novos clientes: 1.234
- Ticket médio: R$ 2.850

Podemos agendar uma reunião para discutir os próximos passos?

Abraços,
Carlos Silva`,
      time: '14:32',
      date: '01 Fev 2026',
      starred: true,
      hasAttachment: true,
      attachments: 2,
      folder: 'inbox'
    },
    {
      id: '2',
      sender: 'Ana Costa',
      senderEmail: 'ana.costa@empresa.com',
      subject: 'Reunião de planejamento - Segunda-feira',
      preview: 'Boa tarde! Vamos marcar a reunião de planejamento...',
      content: `Boa tarde!

Vamos marcar a reunião de planejamento para segunda-feira às 14h. Precisamos discutir os objetivos do próximo trimestre e definir as prioridades.

Por favor, confirme sua presença.

Atenciosamente,
Ana Costa`,
      time: '13:15',
      date: '01 Fev 2026',
      starred: false,
      hasAttachment: false,
      folder: 'inbox'
    },
    {
      id: '3',
      sender: 'Roberto Mendes',
      senderEmail: 'roberto.mendes@empresa.com',
      subject: 'Atualização do Sistema ERP',
      preview: 'O sistema será atualizado no próximo sábado às...',
      content: `O sistema será atualizado no próximo sábado às 22h. Haverá uma breve interrupção do serviço por aproximadamente 2 horas.

Pedimos que salvem todo o trabalho antes deste horário.

Obrigado pela compreensão.`,
      time: '11:48',
      date: '01 Fev 2026',
      starred: false,
      hasAttachment: false,
      folder: 'inbox'
    },
    {
      id: '4',
      sender: 'Juliana Santos',
      senderEmail: 'juliana.santos@empresa.com',
      subject: 'Proposta de Parceria Comercial',
      preview: 'Gostaria de apresentar uma proposta de parceria...',
      content: `Gostaria de apresentar uma proposta de parceria comercial que pode ser muito interessante para ambas as empresas.

Podemos agendar uma call para discutir os detalhes?

Fico no aguardo.`,
      time: '10:22',
      date: '01 Fev 2026',
      starred: false,
      hasAttachment: false,
      folder: 'inbox'
    },
    {
      id: '5',
      sender: 'Pedro Oliveira',
      senderEmail: 'pedro.oliveira@empresa.com',
      subject: 'Documentação do Projeto Phoenix',
      preview: 'Segue a documentação completa do projeto conf...',
      content: `Segue a documentação completa do projeto conforme solicitado.

Qualquer dúvida, estou à disposição.

Att,
Pedro`,
      time: 'Ontem',
      date: '31 Jan 2026',
      starred: true,
      hasAttachment: true,
      attachments: 1,
      folder: 'inbox'
    }
  ]);

  const folders = [
    { id: 'inbox' as const, name: 'Caixa de Entrada', icon: Inbox, count: emails.filter(e => e.folder === 'inbox').length },
    { id: 'sent' as const, name: 'Enviados', icon: Send, count: 0 },
    { id: 'drafts' as const, name: 'Rascunhos', icon: FileText, count: emails.filter(e => e.folder === 'drafts').length },
    { id: 'archived' as const, name: 'Arquivados', icon: Archive, count: 0 },
    { id: 'trash' as const, name: 'Lixeira', icon: Trash2, count: 0 }
  ];

  const filteredEmails = emails.filter(email => {
    const matchesFolder = email.folder === selectedFolder;
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.preview.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFolder && matchesSearch;
  });

  const handleSendEmail = () => {
    if (newEmail.to.trim() && newEmail.subject.trim() && newEmail.message.trim()) {
      // Aqui você adicionaria a lógica de envio
      setShowNewEmailModal(false);
      setNewEmail({ to: '', subject: '', message: '' });
    }
  };

  const handleToggleStar = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail({ ...selectedEmail, starred: !selectedEmail.starred });
    }
  };

  const handleArchiveEmail = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, folder: 'archived' } : email
    ));
    setSelectedEmail(null);
  };

  const handleDeleteEmail = (emailId: string) => {
    setEmails(emails.map(email => 
      email.id === emailId ? { ...email, folder: 'trash' } : email
    ));
    setSelectedEmail(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      {/* Header */}
      <Header
        title="Email"
        subtitle="Gerenciamento de mensagens"
        onBack={onBack}
        actionButton={{
          label: 'Novo Email',
          onClick: () => setShowNewEmailModal(true)
        }}
      />

      {/* Main Content */}
      <div className="pt-20 flex h-screen">
        {/* Sidebar - Folders */}
        <div className="w-64 bg-black border-r border-white/10 p-4">
          <div className="mb-4">
            <p className="text-white/50 text-xs font-medium mb-3 px-3">PASTAS</p>
            <div className="space-y-1">
              {folders.map((folder) => (
                <motion.button
                  key={folder.id}
                  whileHover={{ x: 4 }}
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setSelectedEmail(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedFolder === folder.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <folder.icon className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm font-medium">{folder.name}</span>
                  {folder.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedFolder === folder.id
                        ? 'bg-white text-black'
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {folder.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="w-96 bg-gradient-to-br from-gray-900 to-black border-r border-white/10">
          {/* Search and Filters */}
          <div className="p-4 border-b border-white/10">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar emails..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs transition-all">
                <Filter className="w-3.5 h-3.5" />
                Filtros
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-xs transition-all">
                <SortAsc className="w-3.5 h-3.5" />
                Ordenar
              </button>
            </div>
          </div>

          {/* Email Items */}
          <div className="overflow-y-auto h-[calc(100vh-220px)]">
            {filteredEmails.length > 0 ? (
              filteredEmails.map((email) => (
                <motion.button
                  key={email.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full p-4 border-b border-white/5 text-left transition-all ${
                    selectedEmail?.id === email.id
                      ? 'bg-white/10 border-l-4 border-l-white'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-medium text-sm">
                        {email.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-medium text-sm truncate">{email.sender}</h4>
                        <span className="text-white/40 text-xs ml-2 flex-shrink-0">{email.time}</span>
                      </div>
                      <p className="text-white font-medium text-sm mb-1 truncate">{email.subject}</p>
                      <p className="text-white/60 text-xs truncate">{email.preview}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {email.starred && <Star className="w-3.5 h-3.5 text-white fill-white" />}
                        {email.hasAttachment && <Paperclip className="w-3.5 h-3.5 text-white/60" />}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Inbox className="w-16 h-16 text-white/20 mb-4" />
                <p className="text-white/40 text-sm">Nenhum email encontrado</p>
              </div>
            )}
          </div>

          {filteredEmails.length > 0 && (
            <div className="p-4 border-t border-white/10">
              <p className="text-white/40 text-xs text-center">
                1-{filteredEmails.length} de {filteredEmails.length}
              </p>
            </div>
          )}
        </div>

        {/* Email Content */}
        <div className="flex-1 bg-[#0a0a0a]">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              {/* Email Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-white text-2xl font-semibold flex-1">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleStar(selectedEmail.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Star className={`w-4 h-4 ${selectedEmail.starred ? 'text-white fill-white' : 'text-white/60'}`} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleArchiveEmail(selectedEmail.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <ArchiveX className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteEmail(selectedEmail.id)}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-white/60" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                    >
                      <MoreHorizontal className="w-4 h-4 text-white/60" />
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  {selectedEmail.starred && <Star className="w-4 h-4 text-white fill-white" />}
                  {selectedEmail.hasAttachment && <Paperclip className="w-4 h-4 text-white" />}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {selectedEmail.sender.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{selectedEmail.sender}</h3>
                    <p className="text-white/60 text-sm">{selectedEmail.senderEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/90 text-sm">{selectedEmail.date}</p>
                    <p className="text-white/60 text-sm">{selectedEmail.time}</p>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                  {selectedEmail.content}
                </div>

                {selectedEmail.hasAttachment && selectedEmail.attachments && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Paperclip className="w-4 h-4 text-white/60" />
                      <p className="text-white/60 text-sm">
                        Anexos ({selectedEmail.attachments})
                      </p>
                    </div>
                    <div className="space-y-2">
                      {[...Array(selectedEmail.attachments)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                          <FileText className="w-5 h-5 text-white/60" />
                          <div className="flex-1">
                            <p className="text-white text-sm">documento_{i + 1}.pdf</p>
                            <p className="text-white/40 text-xs">2.5 MB</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reply Button */}
              <div className="p-6 border-t border-white/10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowNewEmailModal(true)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black transition-all font-medium"
                >
                  <Reply className="w-5 h-5" />
                  Responder
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Inbox className="w-10 h-10 text-white/40" />
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Nenhum email selecionado</h3>
              <p className="text-white/60 text-sm">Selecione um email da lista para visualizar</p>
            </div>
          )}
        </div>
      </div>

      {/* New Email Modal */}
      <AnimatePresence>
        {showNewEmailModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewEmailModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-2xl p-6 max-w-3xl w-full shadow-2xl shadow-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white text-xl font-semibold">Novo Email</h2>
                  <button
                    onClick={() => setShowNewEmailModal(false)}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* To Field */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Para</label>
                    <input
                      type="text"
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                      placeholder="Buscar usuário..."
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Subject</label>
                    <input
                      type="text"
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                      placeholder="Assunto do email"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    />
                  </div>

                  {/* Formatting Toolbar */}
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Bold className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Italic className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Underline className="w-4 h-4 text-white/60" />
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-1" />
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Link2 className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Image className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Paperclip className="w-4 h-4 text-white/60" />
                    </button>
                    <button className="p-2 rounded hover:bg-white/10 transition-all">
                      <Smile className="w-4 h-4 text-white/60" />
                    </button>
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Mensagem</label>
                    <textarea
                      value={newEmail.message}
                      onChange={(e) => setNewEmail({ ...newEmail, message: e.target.value })}
                      placeholder="Digite sua mensagem aqui..."
                      rows={10}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all">
                      <Paperclip className="w-4 h-4" />
                      Agendar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm transition-all">
                      <FileText className="w-4 h-4" />
                      Rascunho
                    </button>
                  </div>
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowNewEmailModal(false)}
                      className="px-6 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all font-medium"
                    >
                      Cancelar
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendEmail}
                      className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/90 text-black transition-all font-medium flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Enviar
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
