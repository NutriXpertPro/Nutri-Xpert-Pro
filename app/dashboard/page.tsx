import { getAuthSession } from "@/lib/auth";
import { PlusCircle, BookOpen, Activity, Users2, AlertTriangle, HeartPulse, Utensils, FileDown, UserPlus, Calendar, ClipboardList, ChefHat, ShieldCheck, Users } from "lucide-react";
import FunctionalCard from "./components/FunctionalCard";
import React from "react";
import Link from "next/link";
import QuickActionsClient from "./components/QuickActionsClient"; // Import the new client component
import { prisma } from "@/lib/prisma";

async function getTotalPatients(nutritionistId: string) {
  return await prisma.client.count({ where: { nutritionistId } });
}

async function getTodayAppointments(nutritionistId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await prisma.appointment.count({
    where: {
      nutritionistId,
      date: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
}

async function getActiveDiets(nutritionistId: string) {
  return await prisma.diet.count({ where: { nutritionistId, active: true } });
}

async function getExpiringDiets(nutritionistId: string) {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return await prisma.diet.count({
    where: {
      nutritionistId,
      active: true,
      updatedAt: { // Assuming updatedAt is the date the diet was last updated
        gte: today,
        lt: nextWeek,
      },
    },
  });
}


// --- Componentes do Dashboard --- //

// --- Componentes do Dashboard --- //

const DashboardHeader = async () => {
  const session = await getAuthSession();
  const userName = session?.user?.name?.split(' ')[0] || 'Anderson';

  return (
        <header className="flex flex-col gap-4 py-6 px-[10%] border-b border-brand-text-icon/20 mb-6 backdrop-blur-sm bg-gradient-to-r from-brand-dark-blue/90 to-brand-medium-blue/80">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-brand-text-icon text-sm mb-2">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-white">Visão Geral</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-brand-text-light to-brand-text-icon bg-clip-text text-transparent">
            Bem-vindo, {userName}!
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input 
              type="search" 
              placeholder="Buscar..."
              className="bg-brand-light-blue/20 border border-brand-text-icon/20 rounded-lg py-2 px-4 text-sm text-white placeholder-brand-text-icon/60 focus:outline-none focus:border-brand-text-icon/40 w-64"
            />
          </div>
          <div className="w-14 h-14 rounded-full bg-[#8FAAD9] overflow-hidden ring-2 ring-white/20">
            <img src={session?.user?.image || `/assets/nutri.png`} alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
};

const FunctionalCards = () => {
  const cards = [
    {
      title: "Clientes",
      href: "/dashboard/clients",
      icon: Users2,
      bg: "bg-gradient-to-br from-brand-card-start/90 to-brand-card-end/90 border border-brand-text-icon/20 backdrop-blur-sm",
      iconClasses: "text-brand-text-icon group-hover:scale-110 transition-transform",
      textClasses: "text-white"
    },

    {
      title: "Dietas",
      href: "/dashboard/diets",
      icon: Utensils,
      bg: "bg-gradient-to-br from-brand-green-neon/20 to-atlantis/20 border border-brand-text-icon/20 backdrop-blur-sm",
      iconClasses: "text-brand-text-icon group-hover:scale-110 transition-transform",
      textClasses: "text-white"
    },
    {
      title: "Anamnese",
      href: "/dashboard/anamnesis",
      icon: ClipboardList,
      bg: "bg-gradient-to-br from-purple-600/90 to-purple-800/90 border border-brand-text-icon/20 backdrop-blur-sm",
      iconClasses: "text-brand-text-icon group-hover:scale-110 transition-transform",
      textClasses: "text-white"
    }
  ];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-white mb-4 mx-[10%]">Áreas Principais</h2>
      <section className="mx-[10%] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 relative z-10" style={{ fontFamily: 'Inter, sans-serif' }}>
        {cards.map((card) => {
          const cardContent = (
            <div
              key={card.title}
              className={`group flex flex-col items-center justify-center h-[90px] md:h-[100px] lg:h-[110px] w-full rounded-[16px] transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm ${card.bg} ${card.href ? 'cursor-pointer' : ''}`}
            >
              <card.icon size={32} className={`mb-2 md:mb-3 ${card.iconClasses} transition-colors duration-300`} />
              <span className={`font-medium text-[15px] md:text-[16px] ${card.textClasses} transition-colors duration-300`} style={{ fontWeight: 500 }}>{card.title}</span>
            </div>
          );

          return card.href ? <Link key={card.title} href={card.href}>{cardContent}</Link> : cardContent;
        })}
        {/* Card de próxima consulta */}
        <div className="group h-[90px] md:h-[100px] lg:h-[110px] w-full rounded-[16px] bg-gradient-to-br from-brand-medium-blue/90 to-brand-action-blue-light/90 border border-brand-text-icon/20 p-3 md:p-4 transition-all duration-300 hover:border-brand-text-icon/40 backdrop-blur-sm shadow-lg hover:shadow-xl flex items-center">
          <div className="flex items-center gap-2 md:gap-3 h-full w-full">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-brand-light-blue/30 flex items-center justify-center flex-shrink-0">
              <Calendar className="text-white w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <h3 className="text-brand-text-light text-xs md:text-sm mb-0.5">Próxima Consulta</h3>
              <p className="text-base md:text-lg font-medium text-white truncate">João da Silva</p>
              <div className="flex items-center gap-1 md:gap-2">
                <span className="text-xs md:text-sm text-brand-text-light">10:00</span>
                <span className="px-1.5 py-0.5 text-[10px] md:text-xs rounded-full bg-brand-cyan text-white">ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </section>    </div>
  );
};



// --- Página Principal do Dashboard --- //



// --- Página Principal do Dashboard --- //

export default async function DashboardPage() {
  const session = await getAuthSession(); // Get session here
  const nutritionistId = session?.user?.id;

  if (!nutritionistId) {
    // Handle case where there is no nutritionistId, maybe redirect to login
    return <div>Não autorizado</div>;
  }

  const totalPatients = await getTotalPatients(nutritionistId);
  const todayAppointments = await getTodayAppointments(nutritionistId);
  const activeDiets = await getActiveDiets(nutritionistId);
  const expiringDiets = await getExpiringDiets(nutritionistId);

  return (
    <div
      className="flex w-full min-h-screen text-white relative"
      style={{
        backgroundImage: "url('/assets/Background%202.png'), linear-gradient(to bottom, #081A34, #0C264A)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="flex-1 bg-transparent flex flex-col h-screen">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto custom-scrollbar pb-8">
          {/* Overview Section */}
          <section className="mx-[10%] grid grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-brand-card-start/90 to-brand-card-end/90 p-4 rounded-xl border border-brand-text-icon/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-text-light text-sm">Total de Pacientes</span>
              <Users size={20} className="text-brand-text-icon" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{totalPatients}</span>
              <span className="text-brand-green-neon text-sm">+12% ↑</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-light-blue/90 to-brand-action-blue-light/90 p-4 rounded-xl border border-brand-text-icon/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-text-light text-sm">Consultas Hoje</span>
              <Activity size={20} className="text-brand-text-icon" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{todayAppointments}</span>
              <span className="text-xs text-brand-text-light">de 8 agendadas</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-green-neon/20 to-atlantis/20 p-4 rounded-xl border border-brand-text-icon/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-text-light text-sm">Dietas Ativas</span>
              <Utensils size={20} className="text-brand-text-icon" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{activeDiets}</span>
              <span className="text-brand-green-neon text-sm">93% ativos</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-brand-alert-orange/20 to-brand-alert-orange/40 p-4 rounded-xl border border-brand-text-icon/20 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-brand-text-light text-sm">Dietas a Vencer</span>
              <AlertTriangle size={20} className="text-brand-alert-orange" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{expiringDiets}</span>
              <span className="text-xs text-brand-text-light">para esta semana</span>
            </div>
          </div>
        </section>

          <QuickActionsClient />
          <FunctionalCards />
        </main>
      </div>
    </div>
  );
}