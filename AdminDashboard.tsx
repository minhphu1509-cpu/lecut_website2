
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Save, Plus, Trash2, Edit2, X, 
  Layout, Database, Globe, Calendar, TrendingUp, 
  Users, Activity, CheckCircle, Clock, Share2
} from 'lucide-react';
import { useApp } from '../App';
import { Service, Booking, SocialLinks } from '../types';

export const AdminDashboard: React.FC = () => {
  const { t, lang, services, setServices, updateTranslations, translations, socialLinks, setSocialLinks } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'bookings' | 'content'>('overview');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success'>('idle');

  const [bookings, setBookings] = useState<Booking[]>(() => {
    return JSON.parse(localStorage.getItem('luxecut_bookings') || '[]');
  });

  const [formData, setFormData] = useState<Partial<Service>>({});
  const [socialFormData, setSocialFormData] = useState<SocialLinks>(socialLinks);

  const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData(service);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    const newService = {
      ...formData,
      id: editingService?.id || Date.now().toString(),
      slug: formData.title?.en.toLowerCase().replace(/\s+/g, '-') || 'new-service'
    } as Service;

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? newService : s));
    } else {
      setServices([...services, newService]);
    }
    setEditingService(null);
    setIsAdding(false);
  };

  const [tempTranslations, setTempTranslations] = useState(translations);
  const handleTranslationChange = (path: string[], value: string) => {
    const updated = JSON.parse(JSON.stringify(tempTranslations));
    let current = updated[lang];
    for (let i = 0; i < path.length - 1; i++) current = current[path[i]];
    current[path[path.length - 1]] = value;
    setTempTranslations(updated);
  };

  const saveAllTranslations = () => {
    updateTranslations(tempTranslations);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const saveSocialLinks = () => {
    setSocialLinks(socialFormData);
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <div className="pt-32 pb-20 min-h-screen bg-dark-deep">
      <div className="container mx-auto px-4 max-w-7xl">
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold font-fira text-cream flex items-center gap-4">
              <Settings className="text-gold" size={36} />
              {t.admin.title}
            </h1>
          </div>

          <div className="flex bg-dark-lighter rounded-xl p-1 border border-white/5 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', icon: Activity, label: t.admin.overview },
              { id: 'bookings', icon: Calendar, label: t.admin.bookingsTab },
              { id: 'services', icon: Database, label: t.admin.servicesTab },
              { id: 'content', icon: Layout, label: t.admin.contentTab }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-gold text-dark-deep shadow-lg shadow-gold/10' : 'text-gray-400 hover:text-cream'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            ))}
          </div>
        </header>

        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-lighter p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gold/10 rounded-xl text-gold"><TrendingUp /></div>
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.admin.stats.revenue}</span>
              </div>
              <h2 className="text-3xl font-bold text-cream font-fira">{currencyFormatter.format(totalRevenue)}</h2>
            </div>
            <div className="bg-dark-lighter p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400"><Users /></div>
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.admin.stats.totalBookings}</span>
              </div>
              <h2 className="text-3xl font-bold text-cream font-fira">{bookings.length}</h2>
            </div>
            <div className="bg-dark-lighter p-8 rounded-2xl border border-white/5">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400"><Database /></div>
                <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t.admin.stats.activeServices}</span>
              </div>
              <h2 className="text-3xl font-bold text-cream font-fira">{services.length}</h2>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-dark-lighter rounded-2xl border border-white/5 overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-dark/50 text-xs uppercase tracking-widest text-gray-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Khách Hàng</th>
                      <th className="px-6 py-4">Dịch Vụ</th>
                      <th className="px-6 py-4">Thời Gian</th>
                      <th className="px-6 py-4 text-right">Giá</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-cream">{b.customerName}</div>
                          <div className="text-xs text-gray-500">{b.customerPhone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gold font-medium">
                            {services.find(s => s.id === b.serviceId)?.title[lang] || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-cream">
                            <Clock size={12} className="text-gold" /> {b.date} | {b.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-sm font-bold text-cream">
                          {currencyFormatter.format(b.totalPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-6">
            <button 
              onClick={() => { setIsAdding(true); setEditingService(null); setFormData({ category: 'hair' }); }}
              className="bg-gold text-dark-deep px-6 py-3 rounded-xl font-bold flex items-center gap-2"
            >
              <Plus size={18} /> {t.admin.addService}
            </button>
            <div className="grid grid-cols-1 gap-4">
              {services.map(s => (
                <div key={s.id} className="bg-dark-lighter p-6 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <img src={s.imageUrl} className="w-16 h-16 object-cover rounded-xl border border-gold/20" />
                    <div>
                      <h4 className="font-bold text-cream">{s.title[lang]}</h4>
                      <div className="text-xs text-gray-500 mt-1 uppercase tracking-widest">{s.category} | {s.duration} min</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(s)} className="p-3 bg-dark hover:bg-gold hover:text-dark-deep rounded-xl text-gold transition-all border border-gold/10">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(s.id)} className="p-3 bg-dark hover:bg-red-500 hover:text-white rounded-xl text-red-400 transition-all border border-red-500/10">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-12">
            {/* Translation Editor */}
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-gold/5 p-8 rounded-2xl border border-gold/20">
                <div className="flex items-center gap-4">
                  <Globe className="text-gold" size={32} />
                  <div>
                    <h3 className="font-bold text-cream">Translation Editor ({lang.toUpperCase()})</h3>
                    <p className="text-sm text-gray-500">Real-time website content management.</p>
                  </div>
                </div>
                <button 
                  onClick={saveAllTranslations}
                  className="bg-gold text-dark-deep px-8 py-4 rounded-xl font-bold flex items-center gap-2"
                >
                  {saveStatus === 'success' ? <CheckCircle size={20} /> : <Save size={20} />}
                  {saveStatus === 'success' ? 'Saved' : 'Save All'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 bg-dark-lighter p-8 rounded-2xl border border-white/5">
                  <h4 className="text-gold font-bold font-fira tracking-widest text-xs uppercase mb-4">Hero Section</h4>
                  {['titleMain', 'titleItalic', 'subtitle'].map(key => (
                    <div key={key}>
                      <label className="text-[10px] uppercase text-gray-500 mb-1 block">{key}</label>
                      <textarea 
                          value={tempTranslations[lang].hero[key]}
                          onChange={e => handleTranslationChange(['hero', key], e.target.value)}
                          className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream focus:border-gold outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Editor */}
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-gold/5 p-8 rounded-2xl border border-gold/20">
                <div className="flex items-center gap-4">
                  <Share2 className="text-gold" size={32} />
                  <div>
                    <h3 className="font-bold text-cream">{t.admin.socialTab}</h3>
                    <p className="text-sm text-gray-500">Configure your social media presence.</p>
                  </div>
                </div>
                <button 
                  onClick={saveSocialLinks}
                  className="bg-gold text-dark-deep px-8 py-4 rounded-xl font-bold flex items-center gap-2"
                >
                  {saveStatus === 'success' ? <CheckCircle size={20} /> : <Save size={20} />}
                  {saveStatus === 'success' ? 'Saved' : 'Save Links'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5 space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={14} className="text-gold" /> {t.admin.labels.facebook}
                  </label>
                  <input 
                    type="url"
                    value={socialFormData.facebook}
                    onChange={e => setSocialFormData({...socialFormData, facebook: e.target.value})}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream focus:border-gold outline-none text-sm"
                  />
                </div>
                <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5 space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={14} className="text-gold" /> {t.admin.labels.instagram}
                  </label>
                  <input 
                    type="url"
                    value={socialFormData.instagram}
                    onChange={e => setSocialFormData({...socialFormData, instagram: e.target.value})}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream focus:border-gold outline-none text-sm"
                  />
                </div>
                <div className="bg-dark-lighter p-6 rounded-2xl border border-white/5 space-y-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Share2 size={14} className="text-gold" /> {t.admin.labels.twitter}
                  </label>
                  <input 
                    type="url"
                    value={socialFormData.twitter}
                    onChange={e => setSocialFormData({...socialFormData, twitter: e.target.value})}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream focus:border-gold outline-none text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(isAdding || editingService) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-md bg-dark-deep/80">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-2xl bg-dark-lighter border border-gold/30 rounded-3xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold font-fira text-gold">{editingService ? 'Edit Service' : 'New Service'}</h3>
                <button onClick={() => { setIsAdding(false); setEditingService(null); }}><X /></button>
              </div>
              <form onSubmit={handleSaveService} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.admin.labels.titleVi}</label>
                    <input required className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream" value={formData.title?.vi || ''} onChange={e => setFormData({...formData, title: {...formData.title!, vi: e.target.value, en: formData.title?.en || ''}})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.admin.labels.titleEn}</label>
                    <input required className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream" value={formData.title?.en || ''} onChange={e => setFormData({...formData, title: {...formData.title!, en: e.target.value, vi: formData.title?.vi || ''}})} />
                  </div>
                </div>
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">{t.admin.labels.price}</label>
                   <input type="number" className="w-full bg-dark border border-white/10 rounded-xl p-3 text-cream" value={formData.price || ''} onChange={e => setFormData({...formData, price: parseInt(e.target.value)})} />
                </div>
                <button type="submit" className="w-full py-4 bg-gold text-dark-deep font-bold rounded-xl">{t.admin.addService}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
