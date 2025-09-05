// pages/dashboard/index.tsx
"use client"
import { useRouter } from "next/router"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Users, FileText, PieChart, Utensils, Settings, Activity } from "lucide-react"
import ToggleTheme from "@/components/ui/toggle-theme"

export default function Dashboard() {
  const router = useRouter()

  const dashboardItems = [
    { title: "Clientes", description: "Gerencie seus clientes", icon: Users, href: "/dashboard/clients", color: "bg-blue-500" },
    { title: "Anamneses", description: "Avaliações e progresso", icon: FileText, href: "/dashboard/anamneses", color: "bg-green-500" },
    { title: "Dietas", description: "Planos alimentares", icon: Utensils, href: "/dashboard/diets", color: "bg-orange-500" },
    { title: "Relatórios", description: "Estatísticas completas", icon: PieChart, href: "/dashboard/reports", color: "bg-purple-500" },
    { title: "Alimentos", description: "Base nutricional", icon: Activity, href: "/dashboard/foods", color: "bg-red-500" },
    { title: "Configurações", description: "Ajustes do sistema", icon: Settings, href: "/dashboard/settings", color: "bg-gray-500" }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nutri Xpert Pro</h1>
          <div className="flex items-center space-x-4">
            <ToggleTheme />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-300">Gerencie seus clientes e dados nutricionais</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item) => (
            <Card key={item.title} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(item.href)}>
              <CardHeader className="flex items-center">
                <div className={`p-2 rounded-lg ${item.color} mr-3`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300">{item.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}