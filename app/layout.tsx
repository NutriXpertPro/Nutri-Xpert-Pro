// app/layout.tsx
import './styles/globals.css';
import React from 'react';
import Providers from './providers'; // Import the Providers component
import { getServerSession } from 'next-auth/next'; // Import getServerSession corretamente
import { authOptions } from '../lib/auth'; // Import authOptions

export const metadata = {
  title: 'Nutri Xpert Pro',
  description: 'Sistema profissional de gestão nutricional',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions); // Fetch session on server

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="bg-[url('/assets/Background%202.png')] bg-cover bg-center bg-fixed text-foreground">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}