
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles, Loader2, Bot } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useApp } from '../App';
import { ChatMessage } from '../types';

export const ConciergeAI: React.FC = () => {
  const { lang, t, services } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const serviceContext = services.map(s => `${s.title[lang]}: ${s.price} VND`).join(', ');
      
      const prompt = `You are a luxury concierge for LuxeCut Barbershop. 
      Context: We offer these services: ${serviceContext}.
      Rules: Be polite, aristocratic, and helpful. Use ${lang === 'vi' ? 'Vietnamese' : 'English'}.
      User asks: ${input}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });

      const modelMsg: ChatMessage = { role: 'model', text: response.text || '' };
      setMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: t.concierge.error }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[150]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] md:w-[400px] bg-dark-lighter border border-gold/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl"
          >
            <div className="p-4 bg-gold flex items-center justify-between text-dark-deep">
              <div className="flex items-center gap-2">
                <Bot size={20} />
                <span className="font-bold font-fira tracking-tight">{t.concierge.title}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div 
              ref={scrollRef}
              className="flex-1 p-4 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar"
            >
              <div className="bg-dark/50 p-3 rounded-xl rounded-tl-none border border-white/5 text-sm">
                <p className="text-cream">{t.concierge.welcome}</p>
              </div>

              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-gold text-dark-deep rounded-tr-none' 
                      : 'bg-dark/50 text-cream rounded-tl-none border border-white/5'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark/50 p-3 rounded-xl border border-white/5">
                    <Loader2 size={16} className="animate-spin text-gold" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-white/5 bg-dark/30">
              <div className="flex gap-2">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder={t.concierge.placeholder}
                  className="flex-1 bg-dark border border-white/10 rounded-lg px-4 py-2 text-sm text-cream focus:border-gold outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-gold text-dark-deep rounded-lg hover:bg-gold-light transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gold rounded-full flex items-center justify-center text-dark-deep shadow-2xl shadow-gold/20"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};
