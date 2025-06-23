
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, BarChart3, FileText, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ReportsCharts from "@/components/ReportsCharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Reports = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState({
    start: format(new Date(new Date().setMonth(new Date().getMonth() - 1)), "yyyy-MM-dd"),
    end: format(new Date(), "yyyy-MM-dd")
  });

  // Mock data para relatórios
  const appointmentsData = {
    total: 45,
    confirmed: 38,
    pending: 5,
    cancelled: 2,
    revenue: 3500.00
  };

  const servicesData = [
    { name: "Corte + Escova", count: 15, revenue: 675.00 },
    { name: "Coloração", count: 8, revenue: 960.00 },
    { name: "Hidratação", count: 12, revenue: 720.00 },
    { name: "Manicure", count: 20, revenue: 500.00 }
  ];

  const productsData = [
    { name: "Shampoo Premium", count: 10, revenue: 450.00 },
    { name: "Óleo de Argan", count: 5, revenue: 375.00 },
    { name: "Máscara Hidratante", count: 8, revenue: 440.00 }
  ];

  const accountsData = {
    totalReceivable: 2800.00,
    totalReceived: 3200.00,
    totalOverdue: 450.00,
    accountsCount: 25
  };

  const usersData = {
    totalClients: 150,
    newClientsThisMonth: 12,
    activeClients: 89,
    returningClients: 61
  };

  const handleExportReport = (type: string) => {
    console.log(`Exportando relatório de ${type}`);
    // Implementar lógica de exportação
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Relatórios
              </h1>
              <p className="text-slate-400">
                Análise e relatórios do seu negócio
              </p>
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800 border-slate-700">
            <TabsTrigger value="appointments" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Agendamentos
            </TabsTrigger>
            <TabsTrigger value="services" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Serviços/Produtos
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Contas a Receber
            </TabsTrigger>
            <TabsTrigger value="users" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Clientes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Total de Agendamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{appointmentsData.total}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Confirmados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{appointmentsData.confirmed}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Pendentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{appointmentsData.pending}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">
                    R$ {appointmentsData.revenue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Gráfico de Agendamentos</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('appointments')}
                  className="bg-slate-700 border-slate-600 text-slate-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <ReportsCharts data={appointmentsData} type="appointments" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Serviços Mais Procurados</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('services')}
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {servicesData.map((service, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          <p className="text-slate-400 text-sm">{service.count} agendamentos</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">R$ {service.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Produtos Mais Vendidos</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExportReport('products')}
                    className="bg-slate-700 border-slate-600 text-slate-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {productsData.map((product, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-slate-400 text-sm">{product.count} vendas</p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-400 font-medium">R$ {product.revenue.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="accounts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Total a Receber</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">
                    R$ {accountsData.totalReceivable.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Total Recebido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">
                    R$ {accountsData.totalReceived.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Total Vencido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400">
                    R$ {accountsData.totalOverdue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Número de Contas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{accountsData.accountsCount}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Fluxo de Caixa</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('accounts')}
                  className="bg-slate-700 border-slate-600 text-slate-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <ReportsCharts data={accountsData} type="accounts" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Total de Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{usersData.totalClients}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Novos Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400">{usersData.newClientsThisMonth}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Clientes Ativos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{usersData.activeClients}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-300">Clientes Recorrentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-400">{usersData.returningClients}</div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Análise de Clientes</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleExportReport('users')}
                  className="bg-slate-700 border-slate-600 text-slate-300"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </CardHeader>
              <CardContent>
                <ReportsCharts data={usersData} type="users" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
