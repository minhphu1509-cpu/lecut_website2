
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import { useApp } from '../App';

interface ServiceProps {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  imageUrl: string;
  slug: string;
  isFeatured?: boolean;
}

export const ServiceCard: React.FC<ServiceProps> = ({ 
  id, title, description, price, duration, imageUrl, slug, isFeatured 
}) => {
  const { lang, t, openBooking } = useApp();
  
  const currencyFormatter = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { 
    style: 'currency', 
    currency: lang === 'vi' ? 'VND' : 'USD',
    maximumFractionDigits: lang === 'vi' ? 0 : 2
  });

  const displayPrice = lang === 'en' ? price / 25000 : price;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`group relative overflow-hidden rounded-xl bg-[#1a1a1a] border border-[#d4af37]/20 hover:border-[#d4af37] transition-all duration-300 shadow-lg ${isFeatured ? 'ring-1 ring-[#b8860b]' : ''}`}
    >
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent opacity-90" />
        <div className="absolute bottom-4 left-4">
             <span className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/10 px-3 py-1 text-xs font-medium text-[#d4af37] backdrop-blur-sm font-fira">
                <Clock size={12} /> {duration} {t.services.mins}
             </span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <h3 className="font-fira text-xl font-bold text-[#fffaf0] group-hover:text-[#d4af37] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 font-inter leading-relaxed h-10">
          {description}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-[#d4af37]/10">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-gray-500 font-fira">{t.services.startingAt}</span>
            <span className="text-lg font-bold text-[#d4af37] font-fira">
              {currencyFormatter.format(displayPrice)}
            </span>
          </div>
          
          <button 
            onClick={() => openBooking(id)}
            className="flex items-center gap-2 text-sm font-medium text-[#fffaf0] hover:text-[#d4af37] transition-colors"
          >
            {t.services.details} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
