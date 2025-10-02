// app/dashboard/components/QuickActionsClient.tsx
'use client';

import { useRouter } from 'next/navigation';
import { UserPlus, Salad, Dumbbell, BookOpen } from "lucide-react";
import React from 'react';

const QuickActionsClient = () => {
  const router = useRouter();

  const actions = [
    {
      title: "Novo Cliente",
      icon: UserPlus,
      route: '/dashboard/clients/new',
      gradient: "from-brand-card-start/90 to-brand-card-end/90",
      hoverGradient: "hover:from-brand-card-start hover:to-brand-card-end",
    },
    {
      title: "Criar Dieta",
      icon: Salad,
      route: '/dashboard/diets/new',
      gradient: "from-brand-light-blue/90 to-brand-action-blue-light/90",
      hoverGradient: "hover:from-brand-light-blue hover:to-brand-action-blue-light",
    },
    {
      title: "Avaliação",
      icon: BookOpen,
      route: '/dashboard/evaluations/new',
      gradient: "from-brand-green-neon/20 to-atlantis/20",
      hoverGradient: "hover:from-brand-green-neon/40 hover:to-atlantis/40",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 mx-[10%]">Ações Rápidas</h2>
      <section className="mx-[10%] flex flex-row gap-4">
        {actions.map((action) => (
          <button
            key={action.title}
            className={`
              flex-1 flex items-center justify-center gap-3
              h-[56px] rounded-xl
              bg-gradient-to-br ${action.gradient}
              border border-brand-text-icon/20
              backdrop-blur-sm shadow-lg
              transition-all duration-300
              hover:shadow-xl hover:border-brand-text-icon/40
              group
              ${action.hoverGradient}
            `}
            onClick={() => router.push(action.route)}
          >
            <action.icon 
              size={24} 
              className="text-brand-text-icon group-hover:scale-110 transition-transform" 
            />
            <span className="font-medium text-white">
              {action.title}
            </span>
          </button>
        ))}
      </section>
    </div>
  );
};

export default QuickActionsClient;