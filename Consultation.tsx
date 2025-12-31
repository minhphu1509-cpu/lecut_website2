
import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Loader2, ChevronRight, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getGroomingConsultation } from '../services/geminiService';
import { ConsultationResult } from '../types';
import { useApp } from '../App';

export const Consultation: React.FC = () => {
  const { lang, t, notifyDev } = useApp();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ConsultationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConsult = async () => {
    if (!description && !image) return;
    setLoading(true);
    try {
      const base64Data = image ? image.split(',')[1] : undefined;
      const res = await getGroomingConsultation(description, lang, base64Data);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="consultation" className="py-20 bg-dark-deep relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <div className="text-center mb-12">
          <span className="text-gold font-fira tracking-widest text-sm uppercase mb-2 block">{t.consultation.badge}</span>
          <h2 className="text-4xl md:text-5xl font-bold font-fira text-cream mb-4">{t.consultation.title}</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t.consultation.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6 bg-dark-lighter p-8 rounded-2xl border border-gold/10">
            <div>
              <label className="block text-sm font-medium text-cream mb-2 font-fira">{t.consultation.labelDesc}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.consultation.placeholderDesc}
                className="w-full h-32 bg-dark rounded-xl border border-gold/20 p-4 text-cream focus:outline-none focus:border-gold transition-colors resize-none placeholder:text-gray-600"
              />
            </div>

            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              {image ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-gold h-48">
                  <img src={image} alt="Input" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-dark-deep/80 p-2 rounded-full hover:bg-red-500/80 transition-colors"
                  >
                    <span className="text-white text-xs px-2">{t.consultation.removeBtn}</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gold/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-gold/60 transition-colors group bg-dark/50"
                >
                  <Camera className="text-gold/50 group-hover:text-gold transition-colors" size={40} />
                  <span className="text-gray-500 group-hover:text-gray-300">{t.consultation.uploadBtn}</span>
                </button>
              )}
            </div>

            <button
              onClick={handleConsult}
              disabled={loading || (!description && !image)}
              className="w-full py-4 bg-gold hover:bg-gold-dark text-dark-deep font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
              {loading ? t.consultation.analyzing : t.consultation.submitBtn}
            </button>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-gold/5 p-8 rounded-2xl border border-gold/30 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles className="text-gold" size={24} />
                      <h3 className="text-2xl font-bold font-fira text-gold">{t.consultation.verdict}</h3>
                    </div>
                    <p className="text-cream leading-relaxed mb-8 italic">
                      "{result.recommendation}"
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-bold tracking-widest text-gold mb-3 uppercase font-fira">{t.consultation.suggested}</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.suggestedServices.map((service, i) => (
                            <span key={i} className="bg-gold/20 text-gold-light px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border border-gold/20">
                              <CheckCircle2 size={12} /> {service}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold tracking-widest text-gold mb-3 uppercase font-fira">{t.consultation.tips}</h4>
                        <ul className="space-y-2">
                          {result.styleTips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                              <ChevronRight className="text-gold mt-0.5 shrink-0" size={16} />
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={notifyDev}
                    className="mt-8 text-gold font-bold flex items-center gap-2 hover:gap-3 transition-all border-b border-gold/30 w-fit pb-1"
                  >
                    {t.consultation.bookRegimen} <ArrowRight size={18} />
                  </button>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-dark/30 rounded-2xl border border-white/5">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="text-gold/40" size={32} />
                  </div>
                  <h3 className="text-xl font-medium text-gray-500 mb-2">{t.consultation.awaitingTitle}</h3>
                  <p className="text-gray-600 text-sm max-w-xs">
                    {t.consultation.awaitingDesc}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
