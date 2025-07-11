
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Search, DollarSign, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AccountsList from "@/components/AccountsList";
import NewAccountDialog from "@/components/NewAccountDialog";
import { useAccountsReceivable, type AccountReceivable } from "@/hooks/useAccountsReceivable";

// Interface removida - usando AccountReceivable do hook

const AccountsReceivable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'vencido'>('todos');
  
  const { accounts, loading, addAccount, updateAccount, markInstallmentAsPaid } = useAccountsReceivable();

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'todos') return matchesSearch;
    
    const hasStatus = account.installments?.some(installment => installment.status === statusFilter);
    return matchesSearch && hasStatus;
  });

  // Calcular totais
  const totalReceivable = accounts.reduce((sum, account) => 
    sum + (account.installments?.filter(i => i.status !== 'pago').reduce((s, i) => s + i.amount, 0) || 0), 0
  );
  
  const totalReceived = accounts.reduce((sum, account) => 
    sum + (account.installments?.filter(i => i.status === 'pago').reduce((s, i) => s + i.amount, 0) || 0), 0
  );
  
  const totalOverdue = accounts.reduce((sum, account) => 
    sum + (account.installments?.filter(i => i.status === 'vencido').reduce((s, i) => s + i.amount, 0) || 0), 0
  );

  const handleCreateAccount = async (newAccount: any) => {
    const result = await addAccount(newAccount);
    if (result) {
      // Força atualização da lista após criar nova conta
      window.location.reload();
    }
  };

  const handleUpdateAccount = async (accountId: number, updatedData: any) => {
    const accountStringId = filteredAccounts.find(acc => parseInt(acc.id) === accountId)?.id;
    if (accountStringId) {
      await updateAccount(accountStringId, updatedData);
    }
  };

  const handleMarkAsPaid = async (accountId: number, installmentId: number) => {
    const account = filteredAccounts.find(acc => parseInt(acc.id) === accountId);
    const installment = account?.installments?.find(inst => parseInt(inst.id) === installmentId);
    if (installment) {
      await markInstallmentAsPaid(installment.id);
    }
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
            <NewAccountDialog onCreateAccount={handleCreateAccount} />
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
        {loading ? (
          <div className="text-center text-white">Carregando contas...</div>
        ) : filteredAccounts.length > 0 ? (
          <AccountsList
            accounts={filteredAccounts.map(account => ({
              id: parseInt(account.id),
              title: account.title,
              clientName: account.client_name,
              totalAmount: account.total_amount,
              createdAt: new Date(account.created_at),
              installments: account.installments?.map(installment => ({
                id: parseInt(installment.id),
                number: installment.number,
                amount: installment.amount,
                dueDate: new Date(installment.due_date),
                status: installment.status as 'pendente' | 'pago' | 'vencido',
                paymentDate: installment.payment_date ? new Date(installment.payment_date) : undefined
              })) || []
            }))}
            getStatusColor={getStatusColor}
            onUpdateAccount={handleUpdateAccount}
            onMarkAsPaid={handleMarkAsPaid}
          />
        ) : (
          <div className="text-center text-slate-400 py-8">
            Nenhuma conta encontrada
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountsReceivable;
