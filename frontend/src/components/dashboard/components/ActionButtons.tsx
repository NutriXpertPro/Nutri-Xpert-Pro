'use client';

import Link from 'next/link';
import { PlusCircle, Users, FileText, Utensils, ChartBar, BookOpen } from 'lucide-react';

export const ActionButtons = () => {
  const buttons = [
    {
      href: '/dashboard/clients/new',
      icon: <PlusCircle className="h-6 w-6" />,
      text: 'Novo Cliente',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      href: '/dashboard/clients',
      icon: <Users className="h-6 w-6" />,
      text: 'Lista de Clientes',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      href: '/evaluation/new',
      icon: <BookOpen className="h-6 w-6" />,
      text: 'Avaliação',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      href: '/diets/new',
      icon: <Utensils className="h-6 w-6" />,
      text: 'Criar Dieta',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
    {
      href: '/dashboard/reports',
      icon: <ChartBar className="h-6 w-6" />,
      text: 'Ver Relatórios',
      color: 'bg-indigo-600 hover:bg-indigo-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {buttons.map((button) => (
        <Link
          key={button.href}
          href={button.href}
          className={`${button.color} text-white rounded-lg p-6 flex items-center space-x-4 transform transition-transform hover:scale-105`}
        >
          {button.icon}
          <span className="text-lg font-semibold">{button.text}</span>
        </Link>
      ))}
    </div>
  );
};