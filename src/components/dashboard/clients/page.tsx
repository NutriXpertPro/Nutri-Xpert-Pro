'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { Plus, Search, Eye, Edit, Calendar, AlertCircle } from "lucide-react";

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  sex?: string;
  evaluationType: string;
  nextEvaluationDate?: string;
  createdAt: string;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  sex: string;
  profession: string;
  notes: string;
  evaluationType: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [dietTypeFilter, setDietTypeFilter] = useState("all"); // New state for diet type filter
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<ClientFormData>({
    name: "",
    email: "",
    phone: "",
    age: "",
    sex: "",
    profession: "",
    notes: "",
    evaluationType: "virtual",
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (filterType !== 'all') {
        params.append('type', filterType);
      }
      if (dietTypeFilter !== 'all') { // New filter parameter
        params.append('dietType', dietTypeFilter);
      }

      const response = await fetch(`/api/clients?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch clients on initial load
  useEffect(() => {
    fetchClients();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (value: string) => {
    setFilterType(value);
    fetchClients(); // Trigger fetch when filterType changes
  };

  const handleDietTypeFilterChange = (value: string) => { // New handler for diet type filter
    setDietTypeFilter(value);
    fetchClients(); // Trigger fetch when dietTypeFilter changes
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          age: formData.age ? parseInt(formData.age) : undefined,
          birthDate: formData.age ? new Date(new Date().getFullYear() - parseInt(formData.age), 0, 1) : undefined,
        }),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setFormData((prev: ClientFormData) => ({
          ...prev,
          name: "",
          email: "",
          phone: "",
          age: "",
          sex: "",
          profession: "",
          notes: "",
          evaluationType: "virtual",
        }));
        fetchClients();
      }
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  const getEvaluationStatus = (client: Client) => {
    if (!client.nextEvaluationDate) return "info";
    const dueDate = new Date(client.nextEvaluationDate);
    const today = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "due";
    return "ok";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Gestão de Clientes</h1>
            <p className="text-gray-600 dark:text-gray-300">Gerencie seus pacientes e acompanhe avaliações</p>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="shadow-md hover:shadow-none">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex flex-1 gap-4">
            <div className="flex flex-1 gap-2 max-w-md">
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      fetchClients();
                    }
                  }}
                />
                <Button onClick={fetchClients}>
                  <Search className="h-4 w-4 mr-2" />
                  Buscar
                </Button>
            </div>
            <Select value={filterType} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="virtual">Virtual</SelectItem>
                <SelectItem value="presencial">Presencial</SelectItem>
              </SelectContent>
            </Select>
            {/* New Select for Diet Type Filter */}
            <Select value={dietTypeFilter} onValueChange={handleDietTypeFilterChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por dieta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos de Dieta</SelectItem>
                <SelectItem value="VEGETARIANO">Vegetariano</SelectItem>
                <SelectItem value="VEGANO">Vegano</SelectItem>
                <SelectItem value="OMNIVORO">Onívoro</SelectItem>
                <SelectItem value="JEJUM_INTERMITENTE">Jejum Intermitente</SelectItem>
                <SelectItem value="CETOGENICA">Cetogênica</SelectItem>
                <SelectItem value="BAIXO_CARBOIDRATO">Baixo Carboidrato</SelectItem>
                <SelectItem value="ALTO_PROTEINA">Alto Proteína</SelectItem>
                <SelectItem value="MEDITERRANEA">Mediterrânea</SelectItem>
                <SelectItem value="SEM_GLUTEN">Sem Glúten</SelectItem>
                <SelectItem value="SEM_LACTOSE">Sem Lactose</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Button>
        </div>

        {/* Create Form Modal - logic remains the same */}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Buscando clientes...</p>
          </div>
        ) : (
          <>
            {clients.length === 0 && (searchTerm !== "" || filterType !== "all") ? (
              <div className="text-center py-12 mt-16">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Nenhum cliente encontrado
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Tente ajustar sua busca ou filtros.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.map((client) => {
                  const status = getEvaluationStatus(client);
                  return (
                    <Card key={client.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{client.name}</CardTitle>
                            <CardDescription>
                              {client.age && `${client.age} anos`}
                              {client.age && client.sex && " • "}
                              {client.sex}
                            </CardDescription>
                          </div>
                          {status === "overdue" && <AlertCircle className="h-5 w-5 text-red-500" />}
                          {status === "due" && <Calendar className="h-5 w-5 text-yellow-500" />}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {client.email && <p className="truncate">📧 {client.email}</p>}
                          {client.phone && <p>📱 {client.phone}</p>}
                          <p className="capitalize">🏥 Atendimento {client.evaluationType}</p>
                        </div>
                        <div className="flex gap-2 pt-3">
                          <Button size="sm" variant="outline" onClick={() => router.push(`/dashboard/clients/${client.id}`)} className="flex-1">
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Button>
                          <Button size="sm" onClick={() => router.push(`/anamnesis/${client.id}`)} className="flex-1">
                            <Edit className="h-4 w-4 mr-1" />
                            Anamnese
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
