import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, Search, DollarSign, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AccountsList from "@/components/AccountsList";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Account {
  id: number;
  title: string;
  clientName: string;
  totalAmount: number;
  installments: {
    id: number;
    number: number;
    amount: number;
    dueDate: Date;
    status: 'pendente' | 'pago' | 'vencido';
    paymentDate?: Date;
  }[];
  appointmentId?: number;
  createdAt: Date;
}

const AccountsReceivable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'vencido'>('todos');

  // Mock data para contas a receber
  const accounts: Account[] = [
    {
      id: 1,
      title: "Agendamento - Maria Silva",
      clientName: "Maria Silva",
      totalAmount: 120.00,
      installments: [
        {
          id: 1,
          number: 1,
          amount: 60.00,
          dueDate: new Date(),
          status: 'pago',
          paymentDate: new Date()
        },
        {
          id: 2,
          number: 2,
          amount: 60.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          status: 'pendente'
        }
      ],
      appointmentId: 1,
      createdAt: new Date()
    },
    {
      id: 2,
      title: "Agendamento - João Santos",
      clientName: "João Santos",
      totalAmount: 85.00,
      installments: [
        {
          id: 3,
          number: 1,
          amount: 85.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() - 5)),
          status: 'vencido'
        }
      ],
      appointmentId: 2,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 10))
    },
    {
      id: 3,
      title: "Agendamento - Ana Costa",
      clientName: "Ana Costa",
      totalAmount: 200.00,
      installments: [
        {
          id: 4,
          number: 1,
          amount: 100.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
          status: 'pendente'
        },
        {
          id: 5,
          number: 2,
          amount: 100.00,
          dueDate: new Date(new Date().setDate(new Date().getDate() + 35)),
          status: 'pendente'
        }
      ],
      appointmentId: 3,
      createdAt: new Date(new Date().setDate(new Date().getDate() - 2))
    }
  ];

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'todos') return matchesSearch;
    
    const hasStatus = account.installments.some(installment => installment.status === statusFilter);
    return matchesSearch && hasStatus;
  });

  // Calcular totais
  const totalReceivable = accounts.reduce((sum, account) => 
    sum + account.installments.filter(i => i.status !== 'pago').reduce((s, i) => s + i.amount, 0), 0
  );
  
  const totalReceived = accounts.reduce((sum, account) => 
    sum + account.installments.filter(i => i.status === 'pago').reduce((s, i) => s + i.amount, 0), 0
  );
  
  const totalOverdue = accounts.reduce((sum, account) => 
    sum + account.installments.filter(i => i.status === 'vencido').reduce((s, i) => s + i.amount, 0), 0
  );

  const handleViewAccount = (accountId: number) => {
    console.log(`Visualizando conta ${accountId}`);
    // Implementar navegação para detalhes da conta
  };

  const handleEditAccount = (accountId: number) => {
    console.log(`Editando conta ${accountId}`);
    // Implementar navegação para edição da conta
  };

  const handleNewAccount = () => {
    console.log("Criando nova conta");
    // Implementar navegação para criação de nova conta
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'vencido':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
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
                Contas a Receber
              </h1>
              <p className="text-slate-400">
                Gerencie as contas e parcelas dos seus clientes
              </p>
            </div>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total a Receber
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {totalReceivable.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Recebido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                R$ {totalReceived.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Vencido
              </CardTitle>
              <DollarSign className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">
                R$ {totalOverdue.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Buscar por cliente ou título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Status</Label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                >
                  <option value="todos">Todos</option>
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                  <option value="vencido">Vencido</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de contas */}
        <AccountsList 
          accounts={filteredAccounts} 
          getStatusColor={getStatusColor}
          onViewAccount={handleViewAccount}
          onEditAccount={handleEditAccount}
          onNewAccount={handleNewAccount}
        />
      </div>
    </div>
  );
};

export default AccountsReceivable;
