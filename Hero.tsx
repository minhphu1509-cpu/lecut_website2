
import React from 'react';
import { motion } from 'framer-motion';
import { Scissors, Calendar, ChevronDown } from 'lucide-react';
import { useApp } from '../App';

export const Hero: React.FC = () => {
  const { t, notifyDev } = useApp();

  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-dark-deep">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ duration: 2 }}
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=2000" 
          alt="Barbershop Atmosphere" 
          className="w-full h-full object-cover grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-deep via-dark-deep/40 to-dark-deep" />
      </div>

      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-gold/5 border border-gold/20 text-gold text-xs font-bold tracking-[0.4em] uppercase mb-10 backdrop-blur-sm"
          >
            <Scissors size={14} className="animate-pulse" /> {t.hero.badge}
          </motion.div>
          
          <h1 className="text-5xl md:text-9xl font-bold font-fira text-cream mb-8 tracking-tighter leading-[0.9]">
            {t.hero.titleMain} <br />
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="text-gold italic font-light"
            >
              {t.hero.titleItalic}
            </motion.span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-2xl mb-14 font-inter font-light leading-relaxed">
            {t.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={notifyDev}
              className="w-full sm:w-auto px-10 py-5 bg-gold text-dark-deep font-bold rounded-sm transition-all shadow-xl flex items-center justify-center gap-3 tracking-widest text-sm uppercase"
            >
              <Calendar size={20} /> {t.hero.btnBook}
            </motion.button>
            <motion.a 
              href="#services" 
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              className="w-full sm:w-auto px-10 py-5 bg-transparent text-cream border border-cream/20 rounded-sm transition-all flex items-center justify-center gap-3 tracking-widest text-sm uppercase backdrop-blur-sm"
            >
              {t.hero.btnServices}
            </motion.a>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gold/30 cursor-pointer hidden md:block hover:text-gold transition-colors"
        onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown size={40} strokeWidth={1} />
      </motion.div>
    </div>
  );
};
