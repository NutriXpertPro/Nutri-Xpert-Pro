'use client';

import React from 'react';
import { LayoutDashboard, Users, BookOpen, BarChart2, Settings, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/clients', icon: Users, label: 'Clientes' },
  { href: '/dashboard/diets', icon: BookOpen, label: 'Dietas' },
  { href: '/dashboard/analytics', icon: BarChart2, label: 'Análises' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full bg-gradient-sidebar flex flex-col items-center justify-between py-6">
      {/* Perfil no topo */}
      <div className="w-10 h-10 bg-brand-green-neon rounded-full flex items-center justify-center">
        <UserCircle size={28} className="text-brand-dark-blue" />
      </div>

      {/* Navegação Principal */}
      <nav className="flex flex-col items-center gap-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <div
                className={`p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer group hover:bg-brand-green-neon/10`}
                title={item.label}
              >
                <item.icon
                  size={28}
                  className={`transition-colors duration-200 ${isActive ? 'text-brand-green-neon' : 'text-brand-text-icon group-hover:text-brand-green-neon'}`}
                />
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Configurações no rodapé */}
      <div className="p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer group hover:bg-brand-green-neon/10" title="Configurações">
        <Settings size={28} className="text-brand-text-icon group-hover:text-brand-green-neon" />
      </div>
    </aside>
  );
};

export default Sidebar;