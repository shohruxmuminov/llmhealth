"use client";
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ExternalLink, Image as ImageIcon, ArrowRight } from 'lucide-react';
import debounce from 'lodash/debounce';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  images: string;
  category: string;
  link: string | null;
  keywords: string;
}

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchItems = async (q: string = '') => {
    setLoading(true);
    const res = await fetch(`/api/content?q=${q}`);
    const data = await res.json();
    if (res.ok) setItems(data);
    setLoading(false);
  };

  const debouncedFetch = useCallback(
    debounce((q: string) => fetchItems(q), 300),
    []
  );

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedFetch(val);
  };

  const filteredItems = items.filter(item => 
    selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const heroWords = "Discover Exclusive Services & Deals".split(' ');

  return (
    <div className="relative pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden text-center">
        {/* Animated Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
          <motion.div 
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-accent/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1.3, 1, 1.3], x: [0, -40, 0], y: [0, 40, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-purple-600/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight flex flex-wrap justify-center">
            {heroWords.map((word, i) => (
              <motion.span 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`inline-block mr-3 last:mr-0 ${word === 'Services' ? 'gradient-text' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto"
          >
            Access personalized offers, premium tools, and community benefits curated specifically for you.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1.2 }}
            className="relative max-w-2xl mx-auto w-full"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" size={24} />
              <input 
                type="text" 
                placeholder="Search for something amazing..." 
                value={query}
                onChange={handleSearchChange}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-16 pr-6 py-6 text-xl text-white focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/5 transition-all shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <h2 className="text-3xl font-bold">Catalog</h2>
          <div className="flex bg-white/5 p-1 rounded-full border border-white/5">
            {['All', 'Service', 'Promo', 'Ad'].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat ? 'bg-accent text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <ContentCard key={item.id} item={item} index={index} onClick={() => setSelectedItem(item)} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-24 h-24 bg-white/5 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Search className="text-gray-600" size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-2">No results matching "{query}"</h3>
            <p className="text-gray-500">Try a different search term or change the category.</p>
          </motion.div>
        )}
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />}
      </AnimatePresence>
    </div>
  );
}

function ContentCard({ item, index, onClick }: { item: ContentItem; index: number; onClick: () => void }) {
  const images = JSON.parse(item.images);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      onClick={onClick}
      className="glass rounded-[32px] border border-white/5 overflow-hidden group cursor-pointer flex flex-col h-full hover:border-accent/30 transition-colors"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {images[0] ? (
          <img src={images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
        ) : (
          <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-800"><ImageIcon size={64} /></div>
        )}
        <div className="absolute top-5 left-5">
          <span className="bg-black/60 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/10">
            {item.category}
          </span>
        </div>
      </div>
      <div className="p-8 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">{item.title}</h3>
        <p className="text-gray-400 line-clamp-3 mb-8 flex-1 leading-relaxed text-sm">{item.description}</p>
        <div className="flex items-center text-white font-black text-sm gap-2">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center group-hover:w-full transition-all duration-300 overflow-hidden">
            <ArrowRight size={16} className="shrink-0" />
            <span className="opacity-0 group-hover:opacity-100 whitespace-nowrap px-2">View Details</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ItemModal({ item, onClose }: { item: ContentItem; onClose: () => void }) {
  const images = JSON.parse(item.images);
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-6xl bg-[#0a0a0c] border border-white/10 rounded-[48px] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-h-[90vh]">
        <button onClick={onClose} className="absolute right-8 top-8 z-10 w-14 h-14 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center border border-white/10 transition-all"><X size={28} /></button>
        <div className="w-full lg:w-3/5 h-[40vh] lg:h-auto relative bg-white/[0.02]">
          {images[activeImg] ? (
            <img src={images[activeImg]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-800"><ImageIcon size={100} /></div>
          )}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              {images.map((_: any, i: number) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`w-3 h-3 rounded-full transition-all ${activeImg === i ? 'bg-accent w-10' : 'bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
          )}
        </div>
        <div className="w-full lg:w-2/5 p-10 lg:p-16 overflow-y-auto">
          <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-6 block">{item.category}</span>
          <h2 className="text-4xl lg:text-5xl font-black mb-8 leading-tight">{item.title}</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-12 whitespace-pre-wrap">{item.description}</p>
          {item.link && (
            <a href={item.link} target="_blank" className="block text-center bg-accent hover:bg-accent-hover text-white font-black py-6 rounded-3xl transition-all active:scale-[0.98] shadow-2xl shadow-accent/30 text-xl">
              Launch Now
            </a>
          )}
        </div>
      </motion.div>
    </div>
  );
}
