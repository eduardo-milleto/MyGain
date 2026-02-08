import { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Clock, Star, User } from 'lucide-react';
import { Header } from './Header';

interface CoursesPageProps {
  onBack: () => void;
  onLogout: () => void;
  onVideoSelect?: (videoId: string, courseName: string) => void;
}

interface UserProfile {
  name: string;
  avatar: string;
  createdAt: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  thumbnail: string;
  category: string;
  featured?: boolean;
}

export function CoursesPage({ onBack, onLogout, onVideoSelect }: CoursesPageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });
  const [profileName, setProfileName] = useState('');

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileName.trim()) {
      const newProfile: UserProfile = {
        name: profileName,
        avatar: profileName.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('userProfile', JSON.stringify(newProfile));
      setProfile(newProfile);
    }
  };

  // Mock data for courses
  const courses: Course[] = [
    {
      id: '1',
      title: 'Fundamentos de Trading',
      description: 'Aprenda os conceitos básicos de trading e análise de mercado',
      duration: '4h 30min',
      level: 'Iniciante',
      thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
      category: 'Básico',
      featured: true,
    },
    {
      id: '2',
      title: 'Análise Técnica Avançada',
      description: 'Domine indicadores e padrões gráficos para decisões precisas',
      duration: '6h 15min',
      level: 'Avançado',
      thumbnail: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&h=450&fit=crop',
      category: 'Avançado',
    },
    {
      id: '3',
      title: 'Gestão de Risco',
      description: 'Proteja seu capital com estratégias eficazes de gerenciamento',
      duration: '3h 45min',
      level: 'Intermediário',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop',
      category: 'Intermediário',
    },
    {
      id: '4',
      title: 'Psicologia do Trading',
      description: 'Controle emocional e disciplina para traders de sucesso',
      duration: '5h 00min',
      level: 'Intermediário',
      thumbnail: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop',
      category: 'Intermediário',
    },
    {
      id: '5',
      title: 'Estratégias de Day Trade',
      description: 'Técnicas avançadas para operações intraday lucrativas',
      duration: '7h 20min',
      level: 'Avançado',
      thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=450&fit=crop',
      category: 'Avançado',
    },
    {
      id: '6',
      title: 'Mercado de Criptomoedas',
      description: 'Entenda o mercado cripto e suas oportunidades',
      duration: '4h 50min',
      level: 'Iniciante',
      thumbnail: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&h=450&fit=crop',
      category: 'Básico',
    },
  ];

  const featuredCourse = courses.find(c => c.featured);
  const categorizedCourses = {
    'Básico': courses.filter(c => c.category === 'Básico'),
    'Intermediário': courses.filter(c => c.category === 'Intermediário'),
    'Avançado': courses.filter(c => c.category === 'Avançado'),
  };

  // Profile Creation Screen
  if (!profile) {
    return (
      <div className="min-h-screen w-full bg-[#0a0a0a] flex flex-col items-center justify-center p-4 overflow-hidden relative">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0, 0, 0, 0.9) 100%)'
            }}
          />
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center max-w-lg"
        >
          <h1 className="text-4xl font-light text-white mb-4">Quem está aprendendo?</h1>
          <p className="text-white/50 mb-12">Crie seu perfil para começar sua jornada</p>

          <form onSubmit={handleCreateProfile} className="space-y-6">
            <div className="flex justify-center mb-8">
              <div className="w-32 h-32 rounded-full bg-white/10 border-2 border-white/20 flex items-center justify-center">
                <User className="w-16 h-16 text-white/50" />
              </div>
            </div>

            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Seu nome"
              required
              maxLength={20}
              className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white text-center placeholder:text-white/40 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
              style={{
                textShadow: profileName ? '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.2)' : 'none',
                letterSpacing: '0.5px'
              }}
            />

            <button
              type="submit"
              className="w-full bg-white text-black rounded-2xl px-6 py-4 font-medium hover:bg-white/90 transition-all duration-300"
            >
              Criar Perfil
            </button>

            <button
              type="button"
              onClick={onBack}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              Voltar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main Courses Screen
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <Header
        title="Cursos"
        subtitle="Plataforma de aprendizado"
        onBack={onBack}
        showProfile
        profileName={profile.name}
      />

      {/* Main Content */}
      <div className="pt-20">
        {/* Featured Course Hero */}
        {featuredCourse && (
          <div className="relative h-[70vh] w-full overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${featuredCourse.thumbnail})`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>

            <div className="relative h-full max-w-7xl mx-auto px-6 flex items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-2xl"
              >
                <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-medium mb-4">
                  Em Destaque
                </div>
                <h2 className="text-5xl font-bold text-white mb-4">{featuredCourse.title}</h2>
                <p className="text-white/80 text-lg mb-6 leading-relaxed">{featuredCourse.description}</p>
                
                <div className="flex items-center gap-6 mb-8 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredCourse.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    <span>{featuredCourse.level}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onVideoSelect?.('1', featuredCourse.title)}
                    className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300"
                  >
                    <Play className="w-5 h-5" fill="currentColor" />
                    Começar Agora
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Course Categories */}
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {Object.entries(categorizedCourses).map(([category, coursesInCategory]) => (
            <div key={category}>
              <h3 className="text-2xl font-semibold text-white mb-6">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {coursesInCategory.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => onVideoSelect?.('1', course.title)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                          <Play className="w-5 h-5 text-black ml-1" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    <h4 className="text-white font-medium mb-2">{course.title}</h4>
                    <p className="text-white/50 text-sm mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.level}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto px-6 py-8 border-t border-white/10">
          <p className="text-center text-white/30 text-xs">
            Desenvolvido por{' '}
            <span className="text-white font-medium" style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.5)' }}>
              MyGain
            </span>
            {' '}© 2026
          </p>
        </div>
      </div>
    </div>
  );
}
