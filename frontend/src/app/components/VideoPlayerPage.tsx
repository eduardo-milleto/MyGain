import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Settings, 
  ThumbsUp, 
  Star, 
  Check, 
  ChevronLeft,
  MessageCircle,
  FileText,
  Info,
  Download,
  Clock
} from 'lucide-react';
import { Header } from './Header';

interface Video {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
  watched: boolean;
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  likes: number;
  liked: boolean;
  timestamp: string;
  replies: Comment[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
}

interface VideoPlayerPageProps {
  onBack: () => void;
  videoId: string;
  courseName: string;
  profileName: string;
}

export function VideoPlayerPage({ onBack, videoId, courseName, profileName }: VideoPlayerPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [activeTab, setActiveTab] = useState<'comments' | 'about' | 'files'>('comments');
  const [rating, setRating] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  
  // Mock average rating data
  const averageRating = 4.8;
  const totalRatings = 234;
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Ana Silva',
      avatar: 'A',
      text: 'Aula excelente! Os conceitos de análise técnica foram muito bem explicados.',
      likes: 24,
      liked: false,
      timestamp: '2 days ago',
      replies: [
        {
          id: '1-1',
          author: 'Carlos Mendes',
          avatar: 'C',
          text: 'Concordo! Finalmente entendi como usar médias móveis.',
          likes: 5,
          liked: false,
          timestamp: '1 day ago',
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: 'Pedro Santos',
      avatar: 'P',
      text: 'Poderia adicionar mais exemplos práticos? Seria muito útil.',
      likes: 12,
      liked: false,
      timestamp: '3 days ago',
      replies: []
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const videoRef = useRef<HTMLDivElement>(null);

  // Mock playlist
  const playlist: Video[] = [
    { id: '1', title: 'Introdução ao Trading', duration: '12:30', thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=300&h=170&fit=crop', watched: true },
    { id: '2', title: 'Análise de Candlestick', duration: '18:45', thumbnail: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=300&h=170&fit=crop', watched: true },
    { id: '3', title: 'Indicadores Técnicos', duration: '25:15', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300&h=170&fit=crop', watched: false },
    { id: '4', title: 'Suporte e Resistência', duration: '22:00', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=170&fit=crop', watched: false },
    { id: '5', title: 'Volume e Price Action', duration: '30:20', thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=300&h=170&fit=crop', watched: false },
  ];

  const attachments: Attachment[] = [
    { id: '1', name: 'Apostila - Fundamentos de Trading.pdf', type: 'PDF', size: '2.5 MB', url: '#' },
    { id: '2', name: 'Planilha de Análise Técnica.xlsx', type: 'XLSX', size: '1.8 MB', url: '#' },
    { id: '3', name: 'Resumo da Aula.pdf', type: 'PDF', size: '450 KB', url: '#' },
  ];

  const currentVideo = playlist.find(v => v.id === videoId) || playlist[0];
  const watchedCount = playlist.filter(v => v.watched).length;
  const progressPercentage = (watchedCount / playlist.length) * 100;

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    // Simulate video duration
    setDuration(754); // 12:34 in seconds
  }, []);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLikeComment = (commentId: string, isReply: boolean = false, parentId?: string) => {
    setComments(prev => {
      if (isReply && parentId) {
        return prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    liked: !reply.liked,
                    likes: reply.liked ? reply.likes - 1 : reply.likes + 1
                  };
                }
                return reply;
              })
            };
          }
          return comment;
        });
      }
      return prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1
          };
        }
        return comment;
      });
    });
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: profileName,
        avatar: profileName.charAt(0).toUpperCase(),
        text: newComment,
        likes: 0,
        liked: false,
        timestamp: 'agora',
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleAddReply = (commentId: string) => {
    if (replyText.trim()) {
      const reply: Comment = {
        id: `${commentId}-${Date.now()}`,
        author: profileName,
        avatar: profileName.charAt(0).toUpperCase(),
        text: replyText,
        likes: 0,
        liked: false,
        timestamp: 'agora',
        replies: []
      };
      
      setComments(prev => prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      }));
      
      setReplyText('');
      setReplyingTo(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <Header
        title={courseName}
        subtitle="Plataforma de aprendizado"
        onBack={onBack}
        showProfile
        profileName={profileName}
      />

      <div className="pt-16 pb-8">
        <div className="max-w-[1800px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
            {/* Main Content */}
            <div className="space-y-6">
              {/* Video Player */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10"
              >
                {/* Video Background */}
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Video Controls Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-10 h-10 text-white" fill="white" />
                    ) : (
                      <Play className="w-10 h-10 text-white ml-1" fill="white" />
                    )}
                  </motion.button>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max={duration}
                      value={currentTime}
                      onChange={(e) => setCurrentTime(Number(e.target.value))}
                      className="w-full h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlay} className="text-white hover:scale-110 transition-transform">
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </button>
                      
                      <div className="flex items-center gap-2">
                        <button onClick={toggleMute} className="text-white hover:scale-110 transition-transform">
                          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                          className="w-20 h-1 bg-white/20 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                      </div>

                      <span className="text-white text-sm font-medium">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button className="text-white hover:scale-110 transition-transform">
                        <Settings className="w-5 h-5" />
                      </button>
                      <button className="text-white hover:scale-110 transition-transform">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Video Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-6"
              >
                <h1 className="text-2xl font-semibold text-white mb-4">{currentVideo.title}</h1>
                
                {/* Rating and Like */}
                <div className="flex items-center gap-6 mb-6">
                  {/* Star Rating */}
                  <div className="flex flex-col gap-2">
                    {/* Average Rating Display */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={`avg-${star}`}
                            className={`w-5 h-5 ${
                              star <= Math.floor(averageRating)
                                ? 'text-white fill-white'
                                : star - 0.5 <= averageRating
                                ? 'text-white fill-white opacity-50'
                                : 'text-white/20'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-medium text-lg">{averageRating.toFixed(1)}</span>
                      <span className="text-white/40 text-sm">({totalRatings} avaliações)</span>
                    </div>
                    
                    {/* User Rating */}
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setRating(star)}
                          className="group"
                        >
                          <Star
                            className={`w-5 h-5 transition-all ${
                              star <= rating
                                ? 'text-white fill-white'
                                : 'text-white/30 group-hover:text-white/50'
                            }`}
                          />
                        </motion.button>
                      ))}
                      <span className="text-white/50 text-sm ml-1">Avaliar aula</span>
                    </div>
                  </div>

                  {/* Like Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setHasLiked(!hasLiked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                      hasLiked
                        ? 'bg-white/10 border-white/30 text-white'
                        : 'border-white/20 text-white/70 hover:border-white/40'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
                    <span className="text-sm">Curtir</span>
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="border-t border-white/10 pt-6">
                  <div className="flex gap-6 mb-6">
                    {(['comments', 'about', 'files'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex items-center gap-2 pb-2 border-b-2 transition-all ${
                          activeTab === tab
                            ? 'border-white text-white'
                            : 'border-transparent text-white/50 hover:text-white/70'
                        }`}
                      >
                        {tab === 'comments' && <MessageCircle className="w-4 h-4" />}
                        {tab === 'about' && <Info className="w-4 h-4" />}
                        {tab === 'files' && <FileText className="w-4 h-4" />}
                        <span className="font-medium">
                          {tab === 'comments' && 'Comentários'}
                          {tab === 'about' && 'Sobre'}
                          {tab === 'files' && 'Arquivos'}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {/* Comments Tab */}
                    {activeTab === 'comments' && (
                      <motion.div
                        key="comments"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                      >
                        {/* Add Comment */}
                        <form onSubmit={handleAddComment} className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium">
                            {profileName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 flex gap-2">
                            <input
                              type="text"
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Adicione um comentário..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="submit"
                              disabled={!newComment.trim()}
                              className="px-6 py-2 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Enviar
                            </motion.button>
                          </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-4">
                          {comments.map((comment) => (
                            <div key={comment.id} className="space-y-3">
                              {/* Main Comment */}
                              <div className="flex gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-medium flex-shrink-0">
                                  {comment.avatar}
                                </div>
                                <div className="flex-1">
                                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-white font-medium text-sm">{comment.author}</span>
                                      <span className="text-white/40 text-xs">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-white/80 text-sm leading-relaxed">{comment.text}</p>
                                  </div>
                                  <div className="flex items-center gap-4 mt-2 px-4">
                                    <motion.button
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      onClick={() => handleLikeComment(comment.id)}
                                      className={`flex items-center gap-1 text-xs transition-all ${
                                        comment.liked ? 'text-white' : 'text-white/50 hover:text-white/70'
                                      }`}
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${comment.liked ? 'fill-white' : ''}`} />
                                      <span>{comment.likes}</span>
                                    </motion.button>
                                    <button
                                      onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                      className="text-xs text-white/50 hover:text-white/70 transition-colors"
                                    >
                                      Responder
                                    </button>
                                  </div>

                                  {/* Reply Form */}
                                  {replyingTo === comment.id && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="mt-3 flex gap-2"
                                    >
                                      <input
                                        type="text"
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Escreva uma resposta..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                                        autoFocus
                                      />
                                      <button
                                        onClick={() => handleAddReply(comment.id)}
                                        disabled={!replyText.trim()}
                                        className="px-4 py-2 bg-white/10 text-white rounded-lg text-sm hover:bg-white/20 transition-all disabled:opacity-50"
                                      >
                                        Enviar
                                      </button>
                                    </motion.div>
                                  )}

                                  {/* Replies */}
                                  {comment.replies.length > 0 && (
                                    <div className="mt-3 space-y-3 ml-6 pl-4 border-l border-white/10">
                                      {comment.replies.map((reply) => (
                                        <div key={reply.id} className="flex gap-3">
                                          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                                            {reply.avatar}
                                          </div>
                                          <div className="flex-1">
                                            <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                                              <div className="flex items-center gap-2 mb-1">
                                                <span className="text-white font-medium text-xs">{reply.author}</span>
                                                <span className="text-white/40 text-xs">{reply.timestamp}</span>
                                              </div>
                                              <p className="text-white/80 text-xs leading-relaxed">{reply.text}</p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 px-3">
                                              <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => handleLikeComment(reply.id, true, comment.id)}
                                                className={`flex items-center gap-1 text-xs transition-all ${
                                                  reply.liked ? 'text-white' : 'text-white/50 hover:text-white/70'
                                                }`}
                                              >
                                                <ThumbsUp className={`w-3 h-3 ${reply.liked ? 'fill-white' : ''}`} />
                                                <span>{reply.likes}</span>
                                              </motion.button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                      <motion.div
                        key="about"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">Descrição</h3>
                          <p className="text-white/70 leading-relaxed">
                            Nesta aula você vai aprender os fundamentos essenciais de trading e análise técnica.
                            Vamos abordar conceitos importantes como candlesticks, suporte e resistência,
                            e como identificar tendências de mercado.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h3 className="text-white font-semibold">O que você vai aprender</h3>
                          <ul className="space-y-2 text-white/70">
                            <li className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-white mt-0.5" />
                              <span>Conceitos centrais de análise técnica</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-white mt-0.5" />
                              <span>Como interpretar gráficos de candlestick</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-white mt-0.5" />
                              <span>Identificar tendências e padrões</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <Check className="w-5 h-5 text-white mt-0.5" />
                              <span>Estratégias básicas de entrada e saída</span>
                            </li>
                          </ul>
                        </div>
                      </motion.div>
                    )}

                    {/* Files Tab */}
                    {activeTab === 'files' && (
                      <motion.div
                        key="files"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-3"
                      >
                        {attachments.map((file) => (
                          <motion.div
                            key={file.id}
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                                <FileText className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-medium text-sm">{file.name}</p>
                                <p className="text-white/50 text-xs">{file.type} • {file.size}</p>
                              </div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="w-9 h-9 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                            >
                              <Download className="w-4 h-4 text-white" />
                            </motion.button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Sidebar - Playlist */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              {/* Progress */}
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Progresso do Curso</h3>
                  <span className="text-white/70 text-sm">{watchedCount}/{playlist.length}</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-white/50 text-xs mt-2">{Math.round(progressPercentage)}% concluído</p>
              </div>

              {/* Playlist */}
              <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5">
                <h3 className="text-white font-semibold mb-4">Aulas do Curso</h3>
                <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                  {playlist.map((video, index) => (
                    <motion.div
                      key={video.id}
                      whileHover={{ scale: 1.02 }}
                      className={`group cursor-pointer rounded-xl overflow-hidden border transition-all ${
                        video.id === videoId
                          ? 'bg-white/10 border-white/30'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex gap-3 p-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-24 h-14 object-cover rounded-lg"
                          />
                          {video.watched && (
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                              <Check className="w-3 h-3 text-black" strokeWidth={3} />
                            </div>
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                            <Play className="w-5 h-5 text-white" fill="white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm font-medium line-clamp-2 ${
                              video.id === videoId ? 'text-white' : 'text-white/90'
                            }`}>
                              {index + 1}. {video.title}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/50">
                            <Clock className="w-3 h-3" />
                            <span>{video.duration}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
}
