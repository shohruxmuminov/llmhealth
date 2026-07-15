import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/user/Navbar';

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="bg-[#0a0a0c] min-h-screen text-white">
      <Navbar user={(session as any).role === 'user' ? (session as any) : null} />
      <main>
        {children}
      </main>
      <footer className="border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© 2026 Arena Agent Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
