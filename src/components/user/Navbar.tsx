"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Navbar({ user }: { user: any }) {
  const router = useRouter();
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(10, 10, 12, 0)', 'rgba(10, 10, 12, 0.8)']
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ['1px solid rgba(255, 255, 255, 0)', '1px solid rgba(255, 255, 255, 0.05)']
  );

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <motion.nav 
      style={{ backgroundColor, borderBottom, backdropFilter: 'blur(10px)' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/">
          <span className="text-2xl font-black tracking-tighter gradient-text cursor-pointer">ARENA</span>
        </Link>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/5">
            <UserIcon size={16} className="text-accent" />
            <span className="text-sm font-medium text-gray-300">Member</span>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
