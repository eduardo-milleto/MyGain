import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Users, Package, X, Plus, GripVertical, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { Header } from './Header';
import { FunnelView } from './FunnelView';
import { ChatWidget } from './ChatWidget';

interface CRMPageProps {
  onBack: () => void;
}

type Tab = 'funnels' | 'leads' | 'products';

interface FunnelStage {
  id: string;
  name: string;
}

interface Funnel {
  id: string;
  name: string;
  createdAt: string;
  stages: FunnelStage[];
  dealsCount: number;
  associatedProduct?: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

export function CRMPage({ onBack }: CRMPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>('funnels');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFunnelModal, setShowFunnelModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [activeMenuFunnelId, setActiveMenuFunnelId] = useState<string | null>(null);
  const [selectedFunnel, setSelectedFunnel] = useState<Funnel | null>(null);

  const [funnels, setFunnels] = useState<Funnel[]>([]);

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'John Silva',
      email: 'joao@company.com',
      phone: '+1 415 555-0198',
      company: 'Empresa XYZ',
      status: 'Novo'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria@tech.com',
      phone: '+1 212 555-0147',
      company: 'Tech Solutions',
      status: 'Qualificado'
    }
  ]);

  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Software ERP',
      description: 'Sistema completo de gestão empresarial',
      price: 5999.99,
      category: 'Software'
    },
    {
      id: '2',
      name: 'Consultoria Premium',
      description: 'Consultoria especializada em processos',
      price: 15000.00,
      category: 'Serviços'
    }
  ]);

  const [newFunnel, setNewFunnel] = useState({
    name: '',
    associatedProduct: 'none',
    stages: [
      { id: '1', name: 'Prospecção' },
      { id: '2', name: 'Qualificação' },
      { id: '3', name: 'Proposta' },
      { id: '4', name: 'Negociação' },
      { id: '5', name: 'Fechamento' }
    ]
  });

  const [newStageName, setNewStageName] = useState('');

  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'Novo'
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (activeMenuFunnelId && !target.closest('.funnel-menu-container')) {
        setActiveMenuFunnelId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeMenuFunnelId]);

  const handleCreateFunnel = () => {
    if (newFunnel.name.trim() && newFunnel.stages.length > 0) {
      const funnel: Funnel = {
        id: Date.now().toString(),
        name: newFunnel.name,
        createdAt: new Date().toLocaleDateString('pt-BR'),
        stages: newFunnel.stages,
        dealsCount: 0,
        associatedProduct: newFunnel.associatedProduct !== 'none' ? newFunnel.associatedProduct : undefined
      };
      setFunnels([...funnels, funnel]);
      setShowFunnelModal(false);
      setNewFunnel({
        name: '',
        associatedProduct: 'none',
        stages: [
          { id: '1', name: 'Prospecção' },
          { id: '2', name: 'Qualificação' },
          { id: '3', name: 'Proposta' },
          { id: '4', name: 'Negociação' },
          { id: '5', name: 'Fechamento' }
        ]
      });
      setNewStageName('');
    }
  };

  const handleAddStage = () => {
    if (newStageName.trim()) {
      const newStage: FunnelStage = {
        id: Date.now().toString(),
        name: newStageName
      };
      setNewFunnel({
        ...newFunnel,
        stages: [...newFunnel.stages, newStage]
      });
      setNewStageName('');
    }
  };

  const handleDeleteStage = (stageId: string) => {
    setNewFunnel({
      ...newFunnel,
      stages: newFunnel.stages.filter(s => s.id !== stageId)
    });
  };

  const handleDeleteFunnel = (funnelId: string) => {
    setFunnels(funnels.filter(f => f.id !== funnelId));
    setActiveMenuFunnelId(null);
  };

  const handleOpenFunnel = (funnel: Funnel) => {
    setSelectedFunnel(funnel);
  };

  const handleCreateLead = () => {
    if (newLead.name.trim() && newLead.email.trim()) {
      const lead: Lead = {
        id: Date.now().toString(),
        ...newLead
      };
      setLeads([...leads, lead]);
      setShowLeadModal(false);
      setNewLead({ name: '', email: '', phone: '', company: '', status: 'Novo' });
    }
  };

  const handleCreateProduct = () => {
    if (newProduct.name.trim() && newProduct.price) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price.replace(',', '.')),
        category: newProduct.category
      };
      setProducts([...products, product]);
      setShowProductModal(false);
      setNewProduct({ name: '', description: '', price: '', category: '' });
    }
  };

  // Show FunnelView if a funnel is selected
  if (selectedFunnel) {
    return (
      <FunnelView
        funnel={selectedFunnel}
        leads={leads}
        onBack={() => setSelectedFunnel(null)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <Header
        title="CRM"
        subtitle="Gestão de relacionamento com clientes"
        onBack={onBack}
        actionButton={{
          label: 'Novo Funil',
          icon: Plus,
          onClick: () => setShowFunnelModal(true)
        }}
      />

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
        {/* Search and Actions */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar funis..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
              style={{
                textShadow: searchTerm ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                letterSpacing: '0.5px'
              }}
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('funnels')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'funnels'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Filter className="w-4 h-4" />
              Funis
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('leads')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Users className="w-4 h-4" />
              Leads
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('products')}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'bg-white/10 border border-white/20 text-white'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Package className="w-4 h-4" />
              Produtos
            </motion.button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Filter className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total de Funis</p>
                <p className="text-3xl font-semibold text-white">{funnels.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total de Leads</p>
                <p className="text-3xl font-semibold text-white">{leads.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white/60 text-sm">Total de Produtos</p>
                <p className="text-3xl font-semibold text-white">{products.length}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        {activeTab === 'funnels' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Meus Funis ({funnels.length})</h2>
              {funnels.length > 0 && (
                <p className="text-white/60 text-sm">Clique em um funil para ver e gerenciar seus leads</p>
              )}
            </div>

            {funnels.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                  <Filter className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Nenhum funil criado ainda</h3>
                <p className="text-white/60 text-sm mb-8">Crie seu primeiro funil de vendas para começar</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowFunnelModal(true)}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-medium transition-all flex items-center gap-2 shadow-lg shadow-white/20"
                >
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Funil
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funnels.map((funnel, index) => (
                  <motion.div
                    key={funnel.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleOpenFunnel(funnel)}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer relative group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{funnel.name}</h3>
                      <div className="relative funnel-menu-container">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuFunnelId(activeMenuFunnelId === funnel.id ? null : funnel.id);
                          }}
                          className="p-2 rounded-lg hover:bg-white/10 transition-all"
                        >
                          <MoreVertical className="w-5 h-5 text-white/70" />
                        </button>
                        <AnimatePresence>
                          {activeMenuFunnelId === funnel.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute top-full right-0 mt-2 bg-black border border-white/20 rounded-xl py-2 min-w-[180px] shadow-2xl z-10"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFunnel(funnel.id);
                                }}
                                className="w-full px-4 py-2 text-left text-white/90 hover:bg-white/10 transition-all flex items-center gap-3"
                              >
                                <Trash2 className="w-4 h-4 text-white" />
                                Excluir Funil
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <p className="text-white/60 text-sm mb-4">Criado em {funnel.createdAt}</p>
                    <p className="text-white/60 text-sm mb-4">
                      {funnel.stages.length} etapas • {funnel.dealsCount} negócios
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {funnel.stages.map((stage) => (
                        <span
                          key={stage.id}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-white/90 text-xs"
                        >
                          {stage.name}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Leads ({leads.length})</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowLeadModal(true)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-medium transition-all flex items-center gap-2 shadow-lg shadow-white/20"
              >
                <Plus className="w-4 h-4" />
                Novo Lead
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{lead.name}</h3>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                          {lead.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <p className="text-white/60 text-sm">{lead.email}</p>
                        <p className="text-white/60 text-sm">{lead.phone}</p>
                        <p className="text-white/60 text-sm">{lead.company}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white">Produtos ({products.length})</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProductModal(true)}
                className="px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black font-medium transition-all flex items-center gap-2 shadow-lg shadow-white/20"
              >
                <Plus className="w-4 h-4" />
                Novo Produto
              </motion.button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium">
                          {product.category}
                        </span>
                      </div>
                      <p className="text-white/60 text-sm mb-4">{product.description}</p>
                      <div className="flex items-center gap-2 text-white font-semibold text-lg">
                        <span>R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Funnel Creation Modal */}
      <AnimatePresence>
        {showFunnelModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFunnelModal(false)}
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
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Criar Novo Funil</h2>
                    <p className="text-white/60 text-sm">Configure as etapas do seu funil de vendas</p>
                  </div>
                  <button
                    onClick={() => setShowFunnelModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nome do Funil</label>
                    <input
                      type="text"
                      value={newFunnel.name}
                      onChange={(e) => setNewFunnel({ ...newFunnel, name: e.target.value })}
                      placeholder="Ex: Vendas B2B, Vendas Online..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newFunnel.name ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Produto Associado (Opcional)</label>
                    <select
                      value={newFunnel.associatedProduct}
                      onChange={(e) => setNewFunnel({ ...newFunnel, associatedProduct: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    >
                      <option value="none" className="bg-gray-900">Sem produto</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id} className="bg-gray-900">
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-white text-sm font-medium">Etapas do Funil</label>
                      <button className="text-white/60 text-xs hover:text-white transition-all flex items-center gap-1">
                        <GripVertical className="w-3 h-3" />
                        Arraste para reordenar
                      </button>
                    </div>

                    <div className="space-y-2 mb-4">
                      {newFunnel.stages.map((stage, index) => (
                        <div
                          key={stage.id}
                          className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-3 group hover:bg-white/10 transition-all"
                        >
                          <GripVertical className="w-5 h-5 text-white/40 cursor-move" />
                          <span className="flex-1 text-white">{stage.name}</span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button className="p-1.5 rounded-lg hover:bg-white/10 transition-all">
                              <Edit2 className="w-4 h-4 text-white" />
                            </button>
                            <button
                              onClick={() => handleDeleteStage(stage.id)}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-white" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddStage()}
                        placeholder="Nova etapa..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                        style={{
                          textShadow: newStageName ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                          letterSpacing: '0.5px'
                        }}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddStage}
                        className="px-4 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black transition-all flex items-center gap-2 font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Adicionar
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowFunnelModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateFunnel}
                    className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black transition-all font-medium shadow-lg shadow-white/20"
                  >
                    Criar Funil
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Lead Creation Modal */}
      <AnimatePresence>
        {showLeadModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLeadModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-white/10"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Novo Lead</h2>
                    <p className="text-white/60 text-sm">Adicione um novo lead ao CRM</p>
                  </div>
                  <button
                    onClick={() => setShowLeadModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      value={newLead.name}
                      onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                      placeholder="Nome completo"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newLead.name ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={newLead.email}
                      onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newLead.email ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={newLead.phone}
                      onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                      placeholder="+55 11 98765-4321"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newLead.phone ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Empresa</label>
                    <input
                      type="text"
                      value={newLead.company}
                      onChange={(e) => setNewLead({ ...newLead, company: e.target.value })}
                      placeholder="Nome da empresa"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newLead.company ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Status</label>
                    <select
                      value={newLead.status}
                      onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                    >
                      <option value="Novo" className="bg-gray-900">Novo</option>
                      <option value="Qualificado" className="bg-gray-900">Qualificado</option>
                      <option value="Em Negociação" className="bg-gray-900">Em Negociação</option>
                      <option value="Convertido" className="bg-gray-900">Convertido</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowLeadModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateLead}
                    className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black transition-all font-medium shadow-lg shadow-white/20"
                  >
                    Criar Lead
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Product Creation Modal */}
      <AnimatePresence>
        {showProductModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-white/10"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Novo Produto</h2>
                    <p className="text-white/60 text-sm">Adicione um novo produto ao catálogo</p>
                  </div>
                  <button
                    onClick={() => setShowProductModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nome do Produto *</label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Nome do produto"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newProduct.name ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Descrição</label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="Descrição do produto"
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all resize-none"
                      style={{
                        textShadow: newProduct.description ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Preço *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">R$</span>
                      <input
                        type="text"
                        value={newProduct.price}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '') {
                            setNewProduct({ ...newProduct, price: '' });
                          } else {
                            const numValue = parseInt(value) / 100;
                            setNewProduct({ ...newProduct, price: numValue.toFixed(2).replace('.', ',') });
                          }
                        }}
                        placeholder="500,00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                        style={{
                          textShadow: newProduct.price ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                          letterSpacing: '0.5px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Categoria</label>
                    <input
                      type="text"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="ex.: Software, Serviços..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newProduct.category ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowProductModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateProduct}
                    className="flex-1 px-6 py-3 rounded-xl bg-white hover:bg-white/90 text-black transition-all font-medium shadow-lg shadow-white/20"
                  >
                    Criar Produto
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
