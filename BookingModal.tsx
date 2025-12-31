
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Check, Calendar, User, Scissors, 
  ArrowRight, ArrowLeft, Clock, Phone, UserCheck 
} from 'lucide-react';
import { useApp } from '../App';
import { Service, Barber } from '../types';
import { BARBERS } from '../constants';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, preSelectedServiceId }) => {
  const { lang, t, services } = useApp();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [customer, setCustomer] = useState({ name: '', phone: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (preSelectedServiceId) {
      const s = services.find(serv => serv.id === preSelectedServiceId);
      if (s) {
        setSelectedService(s);
        setStep(2); // Jump to barber selection
      }
    }
  }, [preSelectedServiceId, services]);

  const reset = () => {
    setStep(1);
    setSelectedService(null);
    setSelectedBarber(null);
    setSelectedDate('');
    setSelectedTime('');
    setCustomer({ name: '', phone: '' });
    setIsSuccess(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(reset, 500);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call and save to local storage
    const booking = {
      id: Date.now().toString(),
      serviceId: selectedService?.id,
      barberId: selectedBarber?.id,
      date: selectedDate,
      time: selectedTime,
      customerName: customer.name,
      customerPhone: customer.phone,
      totalPrice: selectedService?.price
    };
    
    const saved = JSON.parse(localStorage.getItem('luxecut_bookings') || '[]');
    localStorage.setItem('luxecut_bookings', JSON.stringify([...saved, booking]));
    
    setIsSuccess(true);
  };

  const currencyFormatter = new Intl.NumberFormat(lang === 'vi' ? 'vi-VN' : 'en-US', { 
    style: 'currency', 
    currency: lang === 'vi' ? 'VND' : 'USD'
  });

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 20; h++) {
      slots.push(`${h}:00`);
      slots.push(`${h}:30`);
    }
    return slots;
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-dark-deep/95 backdrop-blur-xl"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-dark-lighter border border-gold/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        {/* Sidebar Info */}
        <div className="hidden md:flex md:w-1/3 bg-gold/5 p-8 border-r border-gold/10 flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-gold rounded-xl flex items-center justify-center text-dark-deep font-bold text-xl mb-6">LC</div>
            <h2 className="text-3xl font-bold font-fira text-cream mb-2 leading-tight">{t.booking.title}</h2>
            <p className="text-gray-500 text-sm">{t.booking.subtitle}</p>

            <div className="mt-12 space-y-8">
              {[1, 2, 3, 4].map(num => (
                <div key={num} className="flex items-center gap-4 group">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${step >= num ? 'bg-gold border-gold text-dark-deep' : 'border-white/10 text-gray-600'}`}>
                    {step > num ? <Check size={14} /> : num}
                  </div>
                  <span className={`text-xs uppercase tracking-[0.2em] font-bold ${step >= num ? 'text-gold' : 'text-gray-600'}`}>
                    {t.booking[`step${num}`]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {selectedService && (
            <div className="p-4 bg-dark rounded-xl border border-gold/20">
              <span className="text-[10px] text-gold font-bold uppercase tracking-widest">{t.booking.summary}</span>
              <h4 className="text-cream font-bold mt-1">{selectedService.title[lang]}</h4>
              <p className="text-gold text-lg font-bold mt-2">
                {currencyFormatter.format(lang === 'en' ? selectedService.price / 25000 : selectedService.price)}
              </p>
            </div>
          )}
        </div>

        {/* Wizard Steps */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto">
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gold transition-colors z-20">
            <X size={24} />
          </button>

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key={step}
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="h-full flex flex-col"
              >
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Scissors className="text-gold" size={24} />
                      <h3 className="text-2xl font-bold text-cream font-fira">{t.booking.selectService}</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {services.map(s => (
                        <button 
                          key={s.id}
                          onClick={() => { setSelectedService(s); setStep(2); }}
                          className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between group ${selectedService?.id === s.id ? 'bg-gold/10 border-gold shadow-lg shadow-gold/5' : 'bg-dark border-white/5 hover:border-gold/30'}`}
                        >
                          <div>
                            <h4 className={`font-bold transition-colors ${selectedService?.id === s.id ? 'text-gold' : 'text-cream'}`}>{s.title[lang]}</h4>
                            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.duration} mins</p>
                          </div>
                          <ArrowRight className={`transition-all ${selectedService?.id === s.id ? 'text-gold translate-x-1' : 'text-gray-700 opacity-0 group-hover:opacity-100'}`} size={20} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                      <User className="text-gold" size={24} />
                      <h3 className="text-2xl font-bold text-cream font-fira">{t.booking.selectBarber}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {BARBERS.map(barber => (
                        <button 
                          key={barber.id}
                          onClick={() => { setSelectedBarber(barber); setStep(3); }}
                          className={`flex flex-col items-center text-center group transition-all p-4 rounded-2xl border ${selectedBarber?.id === barber.id ? 'bg-gold/10 border-gold' : 'bg-dark border-white/5 hover:border-gold/20'}`}
                        >
                          <div className={`w-24 h-24 rounded-full overflow-hidden mb-4 border-2 transition-all ${selectedBarber?.id === barber.id ? 'border-gold shadow-lg shadow-gold/20' : 'border-white/10 group-hover:border-gold/50'}`}>
                            <img src={barber.imageUrl} alt={barber.name} className="w-full h-full object-cover" />
                          </div>
                          <h4 className="font-bold text-cream group-hover:text-gold transition-colors">{barber.name}</h4>
                          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-tighter">{barber.specialty[lang]}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-3">
                      <Calendar className="text-gold" size={24} />
                      <h3 className="text-2xl font-bold text-cream font-fira">{t.booking.selectDateTime}</h3>
                    </div>
                    
                    <div className="space-y-6">
                      <input 
                        type="date" 
                        min={new Date().toISOString().split('T')[0]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-dark border border-white/10 rounded-xl p-4 text-cream focus:border-gold outline-none"
                      />

                      <div className="grid grid-cols-4 md:grid-cols-6 gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                        {generateTimeSlots().map(time => (
                          <button 
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`py-2 rounded-lg text-xs font-bold transition-all border ${selectedTime === time ? 'bg-gold text-dark-deep border-gold shadow-md' : 'bg-dark border-white/5 text-gray-500 hover:border-gold/50 hover:text-gold'}`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <form onSubmit={handleFinalSubmit} className="space-y-8 h-full">
                    <div className="flex items-center gap-3">
                      <UserCheck className="text-gold" size={24} />
                      <h3 className="text-2xl font-bold text-cream font-fira">{t.booking.customerInfo}</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">{t.booking.fullName}</label>
                        <input 
                          required
                          value={customer.name}
                          onChange={e => setCustomer({...customer, name: e.target.value})}
                          placeholder="Ex: John Doe"
                          className="w-full bg-dark border border-white/10 rounded-xl p-4 text-cream focus:border-gold outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">{t.booking.phone}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                          <input 
                            required
                            type="tel"
                            value={customer.phone}
                            onChange={e => setCustomer({...customer, phone: e.target.value})}
                            placeholder="0123 456 789"
                            className="w-full bg-dark border border-white/10 rounded-xl p-4 pl-12 text-cream focus:border-gold outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-gold/5 rounded-2xl border border-gold/20 flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-gold/30">
                             <img src={selectedBarber?.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-500 uppercase tracking-widest">{selectedBarber?.name}</p>
                             <p className="text-cream font-bold">{selectedDate} @ {selectedTime}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-gray-500">{t.booking.total}</p>
                          <p className="text-gold font-bold text-xl">{currencyFormatter.format(lang === 'en' ? (selectedService?.price || 0) / 25000 : selectedService?.price || 0)}</p>
                       </div>
                    </div>

                    <button type="submit" className="w-full py-5 bg-gold hover:bg-gold-dark text-dark-deep font-bold rounded-xl shadow-xl shadow-gold/20 transition-all text-lg tracking-widest flex items-center justify-center gap-3">
                      {t.booking.confirmBooking} <Check size={24} />
                    </button>
                  </form>
                )}

                {/* Footer Navigation */}
                {step > 1 && (
                  <div className="mt-auto pt-8 flex gap-4">
                    <button 
                      onClick={() => setStep(step - 1)}
                      className="flex items-center gap-2 text-gray-500 hover:text-cream transition-colors font-bold text-sm uppercase tracking-widest"
                    >
                      <ArrowLeft size={16} /> {t.booking.prev}
                    </button>
                    {step < 4 && selectedDate && selectedTime && (
                       <button 
                        onClick={() => setStep(4)}
                        className="ml-auto bg-gold/10 text-gold px-6 py-2 rounded-full font-bold text-xs hover:bg-gold hover:text-dark-deep transition-all"
                       >
                         {t.booking.next}
                       </button>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full flex flex-col items-center justify-center text-center py-12"
              >
                <div className="w-24 h-24 bg-gold rounded-full flex items-center justify-center text-dark-deep mb-8 shadow-2xl shadow-gold/20 animate-bounce">
                  <Check size={48} strokeWidth={3} />
                </div>
                <h2 className="text-4xl font-bold font-fira text-gold mb-4 uppercase tracking-tighter">{t.booking.success}</h2>
                <p className="text-gray-400 max-w-sm mx-auto mb-10 text-lg leading-relaxed">
                  {t.booking.successDesc}
                </p>
                <button 
                  onClick={handleClose}
                  className="px-12 py-4 bg-dark-lighter border border-gold/30 text-gold font-bold rounded-xl hover:bg-gold hover:text-dark-deep transition-all tracking-widest uppercase text-sm"
                >
                  {t.booking.backToHome}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
