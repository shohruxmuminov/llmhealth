import { prisma } from '@/lib/prisma';
import { Users, FileText, Activity } from 'lucide-react';

export default async function AdminDashboard() {
  const userCount = await prisma.user.count();
  const contentCount = await prisma.contentItem.count();

  const stats = [
    { label: 'Total Users', value: userCount, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Content Items', value: contentCount, icon: FileText, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Active Sessions', value: '1', icon: Activity, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-gray-400">Welcome back, Admin. Here is what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass p-6 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={stat.color} size={24} />
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="glass p-8 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a href="/admin/users" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
            <h4 className="font-bold">Add New User</h4>
            <p className="text-sm text-gray-400">Create credentials for a new member</p>
          </a>
          <a href="/admin/content" className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/5">
            <h4 className="font-bold">Upload Content</h4>
            <p className="text-sm text-gray-400">Publish a new service or promo</p>
          </a>
        </div>
      </div>
    </div>
  );
}
