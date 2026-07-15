"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Key, User as UserIcon, X, Eye, EyeOff } from 'lucide-react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  photoUrl: string | null;
  login: string;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', phone: '', photoUrl: '' });
  const [generatedCreds, setGeneratedCreds] = useState<{ login: string; pass: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (res.ok) setUsers(data);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const data = await res.json();
    if (res.ok) {
      setGeneratedCreds({ login: data.login, pass: data.plaintextPassword });
      fetchUsers();
      setNewUser({ firstName: '', lastName: '', phone: '', photoUrl: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
    }
  };

  const handleRegenerate = async (id: string) => {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'regenerate-password' }),
    });
    const data = await res.json();
    if (res.ok) {
      alert(`New password: ${data.plaintextPassword}\nPlease share this with the user as it won't be shown again.`);
    }
  };

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-gray-400">Create and manage access for your members</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-xl transition-all active:scale-[0.98] font-bold"
        >
          <Plus size={20} />
          <span>Create New User</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-accent/50 transition-all"
        />
      </div>

      <div className="glass rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-gray-400 text-sm">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Login</th>
              <th className="px-6 py-4 font-medium">Phone</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <motion.tr 
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden border border-white/10">
                      {user.photoUrl ? (
                        <img src={user.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <UserIcon className="text-accent" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-bold">{user.firstName} {user.lastName}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-300 font-mono">{user.login}</td>
                <td className="px-6 py-4 text-gray-400">{user.phone}</td>
                <td className="px-6 py-4 text-gray-400 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleRegenerate(user.id)}
                      className="p-2 text-gray-400 hover:text-yellow-400 transition-colors"
                      title="Regenerate Password"
                    >
                      <Key size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filteredUsers.length === 0 && !loading && (
          <div className="p-12 text-center text-gray-500">No users found.</div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsModalOpen(false);
                setGeneratedCreds(null);
              }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[#0d0d0f] border border-white/10 rounded-2xl p-8 shadow-2xl"
            >
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setGeneratedCreds(null);
                }}
                className="absolute right-6 top-6 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>

              {!generatedCreds ? (
                <>
                  <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                  <form onSubmit={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase font-bold">First Name</label>
                        <input 
                          type="text" 
                          required
                          value={newUser.firstName}
                          onChange={e => setNewUser({...newUser, firstName: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-400 uppercase font-bold">Last Name</label>
                        <input 
                          type="text" 
                          required
                          value={newUser.lastName}
                          onChange={e => setNewUser({...newUser, lastName: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 uppercase font-bold">Phone Number</label>
                      <input 
                        type="tel" 
                        required
                        value={newUser.phone}
                        onChange={e => setNewUser({...newUser, phone: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400 uppercase font-bold">Photo URL (optional)</label>
                      <input 
                        type="text" 
                        value={newUser.photoUrl}
                        onChange={e => setNewUser({...newUser, photoUrl: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent/50 outline-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl mt-4 transition-all"
                    >
                      Generate Account
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key size={32} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
                  <p className="text-gray-400 mb-8">Share these credentials with the user. The password will not be shown again.</p>
                  
                  <div className="space-y-3 bg-white/5 p-6 rounded-xl border border-white/5 text-left font-mono">
                    <div>
                      <span className="text-gray-500 text-xs block">LOGIN</span>
                      <span className="text-white text-lg">{generatedCreds.login}</span>
                    </div>
                    <div className="pt-3 border-t border-white/5">
                      <span className="text-gray-500 text-xs block">PASSWORD</span>
                      <span className="text-accent text-lg font-bold">{generatedCreds.pass}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setGeneratedCreds(null);
                    }}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl mt-8 transition-all"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
