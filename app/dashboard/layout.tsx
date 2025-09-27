
import React from 'react';
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthSession();

  if (!session || !session.user || session.user.role !== 'NUTRITIONIST') {
    redirect('/login'); // Redirect to login or an unauthorized page
  }

  return (
    <div className="grid grid-cols-[auto] h-screen w-full font-sans">
      <main className="col-start-1 col-end-2 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
