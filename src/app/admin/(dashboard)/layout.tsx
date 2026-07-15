import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar';

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  
  if (!session || (session as any).role !== 'admin') {
    redirect('/admin/login');
  }

  return (
    <div className="flex bg-[#0a0a0c] min-h-screen text-white">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
