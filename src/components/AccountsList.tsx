
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, DollarSign, Calendar, User } from "lucide-react";
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

interface AccountsListProps {
  accounts: Account[];
  getStatusColor: (status: string) => string;
}

const AccountsList = ({ accounts, getStatusColor }: AccountsListProps) => {
  const handleMarkAsPaid = (accountId: number, installmentId: number) => {
    console.log(`Marcar parcela ${installmentId} da conta ${accountId} como paga`);
    // Implementar lógica para marcar como pago
  };

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <Card key={account.id} className="bg-slate-800 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-white text-lg">{account.title}</CardTitle>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {account.clientName}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(account.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    R$ {account.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-slate-300">
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-slate-300">
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="text-slate-300 font-medium">Parcelas:</h4>
              {account.installments.map((installment) => (
                <div 
                  key={installment.id}
                  className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-white font-medium">
                      {installment.number}ª parcela
                    </span>
                    <span className="text-slate-300">
                      R$ {installment.amount.toFixed(2)}
                    </span>
                    <span className="text-slate-400 text-sm">
                      Vencimento: {format(installment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                    {installment.paymentDate && (
                      <span className="text-slate-400 text-sm">
                        Pago em: {format(installment.paymentDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(installment.status)}>
                      {installment.status}
                    </Badge>
                    {installment.status !== 'pago' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkAsPaid(account.id, installment.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Marcar como Pago
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AccountsList;
