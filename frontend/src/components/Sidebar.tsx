'use client'; // Mark as client component

import React, { useState } from 'react'; // Import useState
import { UserCircle, Users, FileText, Utensils, BarChart2, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Session } from "next-auth"; // Import Session type
import { usePathname } from 'next/navigation'; // Import usePathname

const sidebarIcons = [
  { href: '/dashboard', icon: <Users size={28} />, label: 'Clientes' },
  { href: '/dashboard/evaluations', icon: <FileText size={28} />, label: 'Avaliações' },
  { href: '/dashboard/diets', icon: <Utensils size={28} />, label: 'Dietas' },
  { href: '/dashboard/metrics', icon: <BarChart2 size={28} />, label: 'Métricas' },
];

export default function Sidebar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [tooltip, setTooltip] = useState<{ top: number; label: string } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ top: rect.top + rect.height / 2, label });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <aside
      className="h-screen w-[80px] flex flex-col justify-between items-center py-6 shadow-lg ml-[5%]"
      style={{ minWidth: 80, background: 'linear-gradient(to bottom, #081A341A, #0C264A1A)' }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute left-20 p-2 bg-white text-black border border-black rounded-md shadow-lg z-10"
          style={{ top: tooltip.top, transform: 'translateY(-50%)' }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Top: Avatar */}
      <div className="flex flex-col items-center gap-8 w-full">
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full bg-[#8FAAD9] overflow-hidden">
            <img src={session?.user?.image || `/assets/nutri.png`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        <nav className="flex flex-col gap-6 items-center w-full">
          {sidebarIcons.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                onMouseLeave={handleMouseLeave}
                className={`flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 border border-transparent
                  ${isActive ? 'bg-[#112A4C]/80 text-[#3ECF8E] shadow-lg' : 'text-[#8FAAD9] hover:text-[#3ECF8E] hover:bg-white hover:border-black'}`}
              >
                {item.icon}
              </Link>
            );
          })}
        </nav>
      </div>
      {/* Bottom: Settings */}
      <div className="mb-2">
        <Link
          href="/dashboard/settings"
          onMouseEnter={(e) => handleMouseEnter(e, 'Configurações')}
          onMouseLeave={handleMouseLeave}
          className="flex items-center justify-center w-12 h-12 rounded-lg transition-all duration-200 border border-transparent text-[#8FAAD9] hover:text-[#3ECF8E] hover:bg-white hover:border-black"
        >
          <Settings size={28} />
        </Link>
      </div>
    </aside>
  );
}