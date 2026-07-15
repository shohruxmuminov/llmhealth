"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, X, ExternalLink, Image as ImageIcon } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  images: string; // JSON string
  category: string;
  link: string | null;
  keywords: string;
  createdAt: string;
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({ 
    title: '', 
    description: '', 
    images: [] as string[], 
    category: 'service', 
    link: '', 
    keywords: '' 
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const res = await fetch('/api/admin/content');
    const data = await res.json();
    if (res.ok) setItems(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });
    if (res.ok) {
      setIsModalOpen(false);
      fetchContent();
      setNewItem({ title: '', description: '', images: [], category: 'service', link: '', keywords: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/admin/content/${id}`, { method: 'DELETE' });
      if (res.ok) fetchContent();
    }
  };

  const filteredItems = items.filter(i => 
    i.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.keywords.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-400">Manage services, promos, and advertisements</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl transition-all active:scale-[0.98] font-bold"
        >
          <Plus size={20} />
          <span>Add New Content</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by title or keywords..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const images = JSON.parse(item.images);
          return (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl border border-white/5 overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-video bg-white/5 overflow-hidden">
                {images[0] ? (
                  <img src={images[0]} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-accent/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{item.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {item.link && (
                      <a href={item.link} target="_blank" className="p-2 text-gray-400 hover:text-accent">
                        <ExternalLink size={18} />
                      </a>
                    )}
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute right-6 top-6 text-gray-400 hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold mb-6">Add Content Item</h2>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Title</label>
                  <input type="text" required value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Category</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none appearance-none">
                    <option value="service" className="bg-[#0d0d0f]">Service</option>
                    <option value="promo" className="bg-[#0d0d0f]">Promo Code</option>
                    <option value="ad" className="bg-[#0d0d0f]">Advertisement</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Description</label>
                  <textarea required rows={3} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Image URLs (comma separated)</label>
                  <input type="text" value={newItem.images.join(',')} onChange={e => setNewItem({...newItem, images: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">External Link (optional)</label>
                  <input type="url" value={newItem.link} onChange={e => setNewItem({...newItem, link: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none" placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase font-bold">Search Keywords (comma separated)</label>
                  <input type="text" required value={newItem.keywords} onChange={e => setNewItem({...newItem, keywords: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none" placeholder="web, design, logo..." />
                </div>
                <button type="submit" className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl mt-4 transition-all">Publish Content</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
