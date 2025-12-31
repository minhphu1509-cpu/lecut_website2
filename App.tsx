
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Twitter, MapPin, Phone, Clock as ClockIcon, ArrowRight, Languages, Calendar, ShieldCheck, Construction } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Hero } from './components/Hero';
import { ServiceCard } from './components/ServiceCard';
import { Consultation } from './components/Consultation';
import { AdminDashboard } from './components/AdminDashboard';
import { BookingModal } from './components/BookingModal';
import { ConciergeAI } from './components/ConciergeAI';
import { SERVICES as INITIAL_SERVICES } from './constants';
import { Language, Service, SocialLinks } from './types';
import { translations as INITIAL_TRANSLATIONS } from './translations';

const INITIAL_SOCIAL: SocialLinks = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  twitter: 'https://twitter.com'
};

const AppContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  t: any;
  services: Service[];
  setServices: (s: Service[]) => void;
  socialLinks: SocialLinks;
  setSocialLinks: (s: SocialLinks) => void;
  translations: any;
  updateTranslations: (newT: any) => void;
  notifyDev: () => void;
  openBooking: (serviceId?: string) => void;
}>({
  lang: 'vi',
  setLang: () => {},
  t: INITIAL_TRANSLATIONS.vi,
  services: INITIAL_SERVICES,
  setServices: () => {},
  socialLinks: INITIAL_SOCIAL,
  setSocialLinks: () => {},
  translations: INITIAL_TRANSLATIONS,
  updateTranslations: () => {},
  notifyDev: () => {},
  openBooking: () => {}
});

export const useApp = () => useContext(AppContext);

// Fixed: Added optionality to children in NavItem props to resolve JSX children mapping errors in TypeScript (Line 52)
const NavItem = ({ href, children, isActive }: { href: string; children?: React.ReactNode; isActive: boolean }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`relative px-4 py-2 text-[11px] font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${
        isActive ? 'text-gold' : 'text-gray-400 hover:text-gold'
      }`}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </motion.a>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { lang, setLang, t, openBooking } = useApp();
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['services', 'consultation', 'about'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
      else if (window.scrollY < 100) setActiveSection('');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      scrolled ? 'bg-dark-deep/80 backdrop-blur-2xl py-3 border-b border-white/5' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 90 }}
              className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-dark-deep font-bold font-fira shadow-xl shadow-gold/10"
            >
              LC
            </motion.div>
            <span className="text-2xl font-bold font-fira text-cream tracking-tighter hidden sm:block">LUXECUT</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {!isAdmin ? (
              <>
                <div className="flex gap-2">
                  <NavItem href="#services" isActive={activeSection === 'services'}>{t.nav.services}</NavItem>
                  <NavItem href="#consultation" isActive={activeSection === 'consultation'}>{t.nav.aiConsult}</NavItem>
                  <NavItem href="#about" isActive={activeSection === 'about'}>{t.nav.about}</NavItem>
                </div>
                <div className="h-4 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
                    className="text-[10px] font-bold text-gold border border-gold/30 px-3 py-1 rounded-full hover:bg-gold/10 transition-colors"
                  >
                    {lang === 'vi' ? 'EN' : 'VI'}
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openBooking()}
                    className="bg-gold text-dark-deep px-6 py-3 rounded-sm text-[11px] font-bold tracking-widest hover:bg-gold-light transition-all shadow-lg shadow-gold/10"
                  >
                    {t.nav.bookNow}
                  </motion.button>
                </div>
              </>
            ) : (
              <Link to="/" className="text-gold font-bold text-xs flex items-center gap-2 hover:text-cream">
                <ArrowRight size={14} className="rotate-180" /> EXIT ADMIN
              </Link>
            )}
          </div>
          
          <div className="flex items-center gap-4 lg:hidden">
            <button 
              onClick={() => setLang(lang === 'vi' ? 'en' : 'vi')}
              className="text-[10px] font-bold text-gold border border-gold/30 px-3 py-1 rounded-full"
            >
              {lang === 'vi' ? 'EN' : 'VI'}
            </button>
            <button className="text-cream p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-lighter border-b border-white/5 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-6">
              {['services', 'consultation', 'about'].map(key => (
                <a 
                  key={key} 
                  href={`#${key}`} 
                  onClick={() => setIsOpen(false)}
                  className={`text-sm uppercase font-bold tracking-widest ${activeSection === key ? 'text-gold' : 'text-gray-400'}`}
                >
                  {t.nav[key === 'consultation' ? 'aiConsult' : key]}
                </a>
              ))}
              <button 
                onClick={() => { openBooking(); setIsOpen(false); }}
                className="w-full py-4 bg-gold text-dark-deep font-bold text-xs tracking-widest"
              >
                {t.nav.bookNow}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  const { socialLinks } = useApp();
  return (
    <footer className="bg-dark-deep py-20 border-t border-white/5">
      <div className="container mx-auto px-6 text-center">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-lg flex items-center justify-center text-dark-deep font-bold font-fira shadow-xl shadow-gold/10">LC</div>
            <span className="text-2xl font-bold font-fira text-cream tracking-tighter">LUXECUT</span>
          </div>
          
          <div className="flex gap-8">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Facebook size={20} />
            </a>
            <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Instagram size={20} />
            </a>
            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gold transition-colors">
              <Twitter size={20} />
            </a>
          </div>

          <p className="text-gray-600 text-xs uppercase tracking-widest">© 2024 LUXECUT PREMIUM GROOMING SPA</p>
          <Link to="/admin" className="text-[10px] text-gray-800 hover:text-gold mt-4 block">PORTAL</Link>
        </div>
      </div>
    </footer>
  );
};

const Home = () => {
  const { lang, t, services } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredServices = activeCategory === 'all' ? services : services.filter(s => s.category === activeCategory);

  return (
    <main>
      <Hero />
      <section id="services" className="py-32 bg-dark scroll-mt-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div className="max-w-xl">
              <span className="text-gold font-fira tracking-widest text-xs uppercase block mb-4">{t.services.badge}</span>
              <h2 className="text-5xl md:text-7xl font-bold font-fira text-cream leading-none mb-6">{t.services.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed">{t.services.subtitle}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {['all', 'hair', 'beard', 'spa'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-all border ${
                    activeCategory === cat ? 'bg-gold border-gold text-dark-deep' : 'border-white/10 text-gray-500 hover:border-gold/50'
                  }`}
                >
                  {t.services[cat]}
                </button>
              ))}
            </div>
          </div>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <AnimatePresence>
              {filteredServices.map(service => (
                <ServiceCard key={service.id} {...service} title={service.title[lang]} description={service.description[lang]} />
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
      
      <div id="consultation" className="scroll-mt-24">
        <Consultation />
      </div>

      <section id="about" className="py-32 bg-dark-lighter scroll-mt-24">
        <div className="container mx-auto px-6 text-center">
           <span className="text-gold font-fira tracking-widest text-xs uppercase block mb-4">Lịch sử</span>
           <h2 className="text-5xl font-bold text-cream mb-8">Nghệ Thuật Kéo & Lưỡi Dao</h2>
           <p className="max-w-2xl mx-auto text-gray-400 leading-relaxed">
             Từ năm 2010, LuxeCut đã là điểm đến của những quý ông tìm kiếm sự hoàn hảo. Chúng tôi không chỉ cắt tóc, chúng tôi kiến tạo phong cách và sự tự tin.
           </p>
        </div>
      </section>
    </main>
  );
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('vi');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [preSelectedId, setPreSelectedId] = useState<string | null>(null);
  
  const [services, setServices] = useState<Service[]>(() => {
    const saved = localStorage.getItem('luxecut_services');
    return saved ? JSON.parse(saved) : INITIAL_SERVICES;
  });
  
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    const saved = localStorage.getItem('luxecut_social');
    return saved ? JSON.parse(saved) : INITIAL_SOCIAL;
  });

  const [translations, setTranslations] = useState(() => {
    const saved = localStorage.getItem('luxecut_translations');
    return saved ? JSON.parse(saved) : INITIAL_TRANSLATIONS;
  });

  useEffect(() => localStorage.setItem('luxecut_services', JSON.stringify(services)), [services]);
  useEffect(() => localStorage.setItem('luxecut_social', JSON.stringify(socialLinks)), [socialLinks]);
  useEffect(() => localStorage.setItem('luxecut_translations', JSON.stringify(translations)), [translations]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <AppContext.Provider value={{ 
      lang, setLang, t: translations[lang], 
      services, setServices, 
      socialLinks, setSocialLinks,
      translations, 
      updateTranslations: setTranslations,
      notifyDev: () => {},
      openBooking: (id) => { setPreSelectedId(id || null); setIsBookingOpen(true); }
    }}>
      <Router>
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-gold z-[110] origin-left" style={{ scaleX }} />
        <Navbar />
        <ConciergeAI />
        <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} preSelectedServiceId={preSelectedId} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        <Footer />
      </Router>
    </AppContext.Provider>
  );
};

export default App;
