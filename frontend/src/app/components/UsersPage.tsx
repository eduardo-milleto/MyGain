import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Search, Plus, X, User, Mail, Lock, Briefcase, Calendar, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Header } from './Header';
import { ChatWidget } from './ChatWidget';

interface UsersPageProps {
  onBack: () => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'online' | 'offline';
  createdAt: string;
}

const roles = ['Admin', 'Vendas', 'Logística', 'Financeiro', 'RH', 'Infraestrutura'];

export function UsersPage({ onBack }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Carlos Silva',
      email: 'carlos.silva@company.com',
      role: 'Vendas',
      status: 'online',
      createdAt: '14/01/2024'
    },
    {
      id: '2',
      name: 'Ana Costa',
      email: 'ana.costa@company.com',
      role: 'RH',
      status: 'online',
      createdAt: '19/01/2024'
    },
    {
      id: '3',
      name: 'Roberto Mendes',
      email: 'roberto.mendes@company.com',
      role: 'Infraestrutura',
      status: 'offline',
      createdAt: '31/01/2024'
    },
    {
      id: '4',
      name: 'Juliana Santos',
      email: 'juliana.santos@company.com',
      role: 'Vendas',
      status: 'online',
      createdAt: '04/02/2024'
    },
    {
      id: '5',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@company.com',
      role: 'Logística',
      status: 'online',
      createdAt: '09/02/2024'
    },
    {
      id: '6',
      name: 'Mariana Lima',
      email: 'mariana.lima@company.com',
      role: 'Financeiro',
      status: 'offline',
      createdAt: '11/02/2024'
    }
  ]);

  const [showUserModal, setShowUserModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('Todos os Cargos');
  const [showPassword, setShowPassword] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    password: ''
  });

  const handleCreateUser = () => {
    if (newUser.name.trim() && newUser.email.trim() && newUser.role && newUser.password.length >= 8) {
      if (editingUser) {
        // Edit mode
        setUsers(users.map(u => 
          u.id === editingUser.id 
            ? { ...u, name: newUser.name, email: newUser.email, role: newUser.role }
            : u
        ));
      } else {
        // Create mode
        const user: User = {
          id: Date.now().toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: 'offline',
          createdAt: new Date().toLocaleDateString('en-US')
        };
        setUsers([...users, user]);
      }
      setShowUserModal(false);
      setNewUser({ name: '', email: '', role: '', password: '' });
      setEditingUser(null);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '********'
    });
    setShowUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'Todos os Cargos' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const onlineUsers = users.filter(u => u.status === 'online').length;
  const roleStats = roles.reduce((acc, role) => {
    acc[role] = users.filter(u => u.role === role).length;
    return acc;
  }, {} as Record<string, number>);

  const isCreateDisabled = !newUser.name.trim() || !newUser.email.trim() || !newUser.role || newUser.password.length < 8;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      {/* Header */}
      <Header
        title="Usuários"
        subtitle="Gestão de usuários e permissões"
        onBack={onBack}
        actionButton={{
          label: 'Novo Usuário',
          icon: Plus,
          onClick: () => {
            setEditingUser(null);
            setNewUser({ name: '', email: '', role: '', password: '' });
            setShowUserModal(true);
          }
        }}
      />

      {/* Main Content */}
      <div className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/60 text-sm">Total de Usuários</p>
              </div>
              <p className="text-3xl font-bold text-white">{users.length}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                </div>
                <p className="text-white/60 text-sm">Online Agora</p>
              </div>
              <p className="text-3xl font-bold text-white">{onlineUsers}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/60 text-sm">Vendas</p>
              </div>
              <p className="text-3xl font-bold text-white">{roleStats['Vendas'] || 0}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 border border-white/20">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <p className="text-white/60 text-sm">Logística</p>
              </div>
              <p className="text-3xl font-bold text-white">{roleStats['Logística'] || 0}</p>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar usuários..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all cursor-pointer"
          >
            <option value="Todos os Cargos">Todos os Cargos</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              {/* Edit/Delete Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditUser(user)}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Edit2 className="w-4 h-4 text-white" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
                >
                  <Trash2 className="w-4 h-4 text-white" />
                </motion.button>
              </div>

              <div className="relative">
                {/* Avatar and Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-gray-900 ${
                      user.status === 'online' ? 'bg-white' : 'bg-white/30'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-semibold">{user.name}</h3>
                    <p className={`text-sm ${user.status === 'online' ? 'text-white' : 'text-white/40'}`}>
                      {user.status === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-2 mb-3 text-white/60 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>

                {/* Role Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase className="w-4 h-4 text-white/40" />
                  <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-medium">
                    {user.role}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Criado em {user.createdAt}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">Nenhum usuário encontrado</p>
          </div>
        )}
      </div>

      {/* New/Edit User Modal */}
      <AnimatePresence>
        {showUserModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUserModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-2xl w-full shadow-2xl shadow-white/10 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-white/10 border border-white/20">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUserModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <div className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Nome Completo *</span>
                    </div>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Ex: João da Silva"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newUser.name ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                      }}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <div className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>Email Corporativo *</span>
                    </div>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="joao.silva@empresa.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newUser.email ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                      }}
                    />
                  </div>

                  {/* Role Selection */}
                  <div>
                    <div className="block text-white text-sm font-medium mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Cargo *</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {roles.map((role) => (
                        <motion.button
                          key={role}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setNewUser({ ...newUser, role })}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            newUser.role === role
                              ? 'bg-white/20 border-white shadow-lg shadow-white/20'
                              : 'bg-white/5 border-white/10 hover:border-white/30'
                          }`}
                        >
                          <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                            newUser.role === role
                              ? 'bg-white'
                              : 'bg-white/10'
                          }`}>
                            <Briefcase className={`w-5 h-5 ${
                              newUser.role === role ? 'text-black' : 'text-white/60'
                            }`} />
                          </div>
                          <p className={`text-sm font-medium ${
                            newUser.role === role ? 'text-white' : 'text-white/70'
                          }`}>
                            {role}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="block text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Senha *</span>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        placeholder="Mínimo 8 caracteres"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                        style={{
                          textShadow: newUser.password ? '0 0 10px rgba(255, 255, 255, 0.3)' : 'none'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-white/5 border border-white/20 rounded-xl p-4">
                    <div className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                        ℹ️
                      </div>
                      Informações importantes:
                    </div>
                    <ul className="text-white/70 text-sm space-y-1 ml-7">
                      <li>• O email será usado para login no sistema</li>
                      <li>• O usuário receberá as credenciais de acesso por email</li>
                      <li>• As permissões serão definidas de acordo com o cargo</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowUserModal(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={!isCreateDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isCreateDisabled ? { scale: 0.98 } : {}}
                    onClick={handleCreateUser}
                    disabled={isCreateDisabled}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium flex items-center justify-center gap-2 ${
                      isCreateDisabled
                        ? 'bg-white/20 text-white/40 cursor-not-allowed'
                        : 'bg-white hover:bg-white/90 text-black shadow-lg shadow-white/20'
                    }`}
                  >
                    {editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
                  </motion.button>
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
