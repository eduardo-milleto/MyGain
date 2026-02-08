import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Plus, X, User, Building2, DollarSign, FileText, Target } from 'lucide-react';

interface FunnelViewProps {
  funnel: {
    id: string;
    name: string;
    stages: { id: string; name: string }[];
  };
  leads: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: string;
  }>;
  onBack: () => void;
}

interface Deal {
  id: string;
  name: string;
  value: number;
  leadId: string;
  leadName: string;
  company: string;
  description: string;
  stageId: string;
}

export function FunnelView({ funnel, leads, onBack }: FunnelViewProps) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [selectedGoalStageId, setSelectedGoalStageId] = useState<string | null>(null);
  const [stageGoals, setStageGoals] = useState<Record<string, number>>({});
  const [tempGoal, setTempGoal] = useState('');

  const [newDeal, setNewDeal] = useState({
    name: '',
    value: '',
    leadId: '',
    description: '',
    stageId: ''
  });

  const handleCreateDeal = () => {
    if (newDeal.name && newDeal.value && newDeal.leadId && selectedStageId) {
      const selectedLead = leads.find(l => l.id === newDeal.leadId);
      if (selectedLead) {
        const deal: Deal = {
          id: Date.now().toString(),
          name: newDeal.name,
          value: parseFloat(newDeal.value.replace(',', '.')),
          leadId: newDeal.leadId,
          leadName: selectedLead.name,
          company: selectedLead.company,
          description: newDeal.description,
          stageId: selectedStageId
        };
        setDeals([...deals, deal]);
        setShowDealModal(false);
        setNewDeal({ name: '', value: '', leadId: '', description: '', stageId: '' });
        setSelectedStageId(null);
      }
    }
  };

  const getDealsForStage = (stageId: string) => {
    return deals.filter(d => d.stageId === stageId);
  };

  const getStageValue = (stageId: string) => {
    return getDealsForStage(stageId).reduce((sum, deal) => sum + deal.value, 0);
  };

  const getTotalValue = () => {
    return deals.reduce((sum, deal) => sum + deal.value, 0);
  };

  const getConversionRate = (stageId: string) => {
    const stageDeals = getDealsForStage(stageId).length;
    if (deals.length === 0) return 0;
    return (stageDeals / deals.length) * 100;
  };

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('dealId', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('dealId');
    setDeals(deals.map(deal => 
      deal.id === dealId ? { ...deal, stageId: targetStageId } : deal
    ));
  };

  const handleSetGoal = () => {
    if (tempGoal && selectedGoalStageId) {
      setStageGoals({
        ...stageGoals,
        [selectedGoalStageId]: parseFloat(tempGoal.replace(',', '.'))
      });
      setShowGoalModal(false);
      setTempGoal('');
      setSelectedGoalStageId(null);
    }
  };

  const isCreateDealDisabled = !newDeal.name.trim() || !newDeal.value || !newDeal.leadId;

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBack}
                className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-semibold text-white">{funnel.name}</h1>
                <p className="text-white/60 text-sm">Visão do funil de vendas</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar negócios..."
                  className="w-64 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 focus:bg-white/10 transition-all"
                  style={{
                    textShadow: searchTerm ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                    letterSpacing: '0.5px'
                  }}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedStageId(funnel.stages[0]?.id || null);
                  setShowDealModal(true);
                }}
                className="px-6 py-2.5 rounded-xl bg-white hover:bg-white/90 text-black font-medium transition-all flex items-center gap-2 shadow-lg shadow-white/20"
              >
                <Plus className="w-4 h-4" />
                Criar Negócio
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="pt-24 pb-6 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <p className="text-white/60 text-sm mb-1">VALOR TOTAL</p>
            <p className="text-3xl font-semibold text-white">
              R$ {getTotalValue().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
          >
            <p className="text-white/60 text-sm mb-1">TOTAL DE NEGÓCIOS</p>
            <p className="text-3xl font-semibold text-white">{deals.length}</p>
          </motion.div>
        </div>
      </div>

      {/* Funnel Columns */}
      <div className="px-4 pb-8 max-w-full mx-auto">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {funnel.stages.map((stage, index) => {
            const stageDeals = getDealsForStage(stage.id);
            const stageValue = getStageValue(stage.id);
            const conversionRate = getConversionRate(stage.id);

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.id)}
                className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {stage.name}
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </h3>
                </div>

                {/* Stage Stats */}
                <div className="space-y-2 mb-4">
                  <div>
                    <p className="text-white/60 text-xs">Valor Total</p>
                    <p className="text-xl font-semibold text-white">
                      R$ {stageValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Negócios</p>
                    <p className="text-white font-medium">{stageDeals.length}</p>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs">Taxa de Conversão</p>
                    <p className={`font-medium ${
                      stageGoals[stage.id]
                        ? conversionRate >= stageGoals[stage.id]
                          ? 'text-green-500'
                          : 'text-red-500'
                        : 'text-white/70'
                    }`}>
                      {conversionRate.toFixed(1)}%
                      {stageGoals[stage.id] && (
                        <span className="text-white/40 text-xs ml-1">/ {stageGoals[stage.id]}%</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Set Goal Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedGoalStageId(stage.id);
                    setTempGoal(stageGoals[stage.id]?.toString() || '');
                    setShowGoalModal(true);
                  }}
                  className="w-full mb-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Setar Meta
                </motion.button>

                {/* Search */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Buscar aqui..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>

                {/* Deals List */}
                <div className="space-y-3 min-h-[300px]">
                  {stageDeals.length === 0 ? (
                    <div className="flex items-center justify-center h-32">
                      <p className="text-white/40 text-sm">Nenhum negócio nesta etapa</p>
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, deal.id)}
                        whileHover={{ scale: 1.02 }}
                        className="bg-black/50 border border-white/10 rounded-xl p-4 cursor-move hover:border-white/20 transition-all"
                      >
                        <h4 className="text-white font-semibold mb-2">{deal.name}</h4>
                        <p className="text-white text-lg font-bold mb-3">
                          R$ {deal.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <div className="space-y-1 text-sm text-white/70">
                          <p>{deal.company}</p>
                          <p>{deal.leadName}</p>
                          {deal.description && <p>{deal.description}</p>}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Create Deal Modal */}
      <AnimatePresence>
        {showDealModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDealModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-lg w-full shadow-2xl shadow-white/10 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Criar Novo Negócio</h2>
                    <p className="text-white/60 text-sm">Selecione um lead e adicione detalhes do negócio</p>
                  </div>
                  <button
                    onClick={() => setShowDealModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Select Lead */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-3">Selecionar Lead</label>
                    <div className="space-y-2">
                      {leads.map((lead) => (
                        <motion.button
                          key={lead.id}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setNewDeal({ ...newDeal, leadId: lead.id })}
                          className={`w-full p-4 rounded-xl border transition-all flex items-center gap-3 ${
                            newDeal.leadId === lead.id
                              ? 'bg-white/10 border-white/30'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-white font-medium">{lead.name}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-white/60 text-xs flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                {lead.company}
                              </span>
                              <span className="text-white/60 text-xs">{lead.email}</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Deal Name */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nome do Negócio</label>
                    <input
                      type="text"
                      value={newDeal.name}
                      onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                      placeholder="Ex: Venda de Software ERP"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                      style={{
                        textShadow: newDeal.name ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>

                  {/* Deal Value */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Valor do Negócio</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">R$</span>
                      <input
                        type="text"
                        value={newDeal.value}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '') {
                            setNewDeal({ ...newDeal, value: '' });
                          } else {
                            const numValue = parseInt(value) / 100;
                            setNewDeal({ ...newDeal, value: numValue.toFixed(2).replace('.', ',') });
                          }
                        }}
                        placeholder="500,00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                        style={{
                          textShadow: newDeal.value ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                          letterSpacing: '0.5px'
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Descrição do Negócio</label>
                    <textarea
                      value={newDeal.description}
                      onChange={(e) => setNewDeal({ ...newDeal, description: e.target.value })}
                      placeholder="Detalhes adicionais sobre o negócio..."
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all resize-none"
                      style={{
                        textShadow: newDeal.description ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                        letterSpacing: '0.5px'
                      }}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowDealModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={!isCreateDealDisabled ? { scale: 1.02 } : {}}
                    whileTap={!isCreateDealDisabled ? { scale: 0.98 } : {}}
                    onClick={handleCreateDeal}
                    disabled={isCreateDealDisabled}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium ${
                      isCreateDealDisabled
                        ? 'bg-white/20 text-white/40 cursor-not-allowed'
                        : 'bg-white hover:bg-white/90 text-black shadow-lg shadow-white/20'
                    }`}
                  >
                    Criar Negócio
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Set Goal Modal */}
      <AnimatePresence>
        {showGoalModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGoalModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-gradient-to-br from-gray-900 to-black border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl shadow-white/10"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">Setar Meta</h2>
                    <p className="text-white/60 text-sm">Defina a taxa de conversão meta desta etapa</p>
                  </div>
                  <button
                    onClick={() => setShowGoalModal(false)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Meta de Conversão (%)</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={tempGoal}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value === '') {
                            setTempGoal('');
                          } else {
                            const numValue = parseInt(value);
                            if (numValue <= 100) {
                              setTempGoal(numValue.toString());
                            }
                          }
                        }}
                        placeholder="Ex: 25"
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all"
                        style={{
                          textShadow: tempGoal ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                          letterSpacing: '0.5px'
                        }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-lg">%</span>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/60 text-sm mb-2">ℹ️ Como funciona:</p>
                    <ul className="text-white/70 text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">●</span> 
                        Verde: Taxa acima da meta
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-red-500">●</span> 
                        Vermelho: Taxa abaixo da meta
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowGoalModal(false)}
                    className="flex-1 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all font-medium"
                  >
                    Cancelar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSetGoal}
                    disabled={!tempGoal}
                    className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium ${
                      !tempGoal
                        ? 'bg-white/20 text-white/40 cursor-not-allowed'
                        : 'bg-white hover:bg-white/90 text-black shadow-lg shadow-white/20'
                    }`}
                  >
                    Confirmar Meta
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
