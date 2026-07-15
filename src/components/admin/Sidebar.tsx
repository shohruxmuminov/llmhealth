"use client";
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Users', icon: Users, href: '/admin/users' },
  { name: 'Content', icon: FileText, href: '/admin/content' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <div className="w-64 bg-[#0d0d0f] border-r border-white/5 h-screen flex flex-col p-4 fixed left-0 top-0">
      <div className="mb-8 px-4">
        <h1 className="text-xl font-bold gradient-text">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
                <Icon size={20} className={isActive ? 'text-accent' : 'group-hover:text-white'} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200"
      >
        <LogOut size={20} />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
}
