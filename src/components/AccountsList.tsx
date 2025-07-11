
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, DollarSign, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ViewAccountDialog from "./ViewAccountDialog";
import EditAccountDialog from "./EditAccountDialog";
import MarkAsPaidDialog from "./MarkAsPaidDialog";

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
  onUpdateAccount: (accountId: number, updatedData: Partial<Account>) => void;
  onMarkAsPaid: (accountId: number, installmentId: number) => void;
}

const AccountsList = ({ accounts, getStatusColor, onUpdateAccount, onMarkAsPaid }: AccountsListProps) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [markAsPaidDialogOpen, setMarkAsPaidDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedInstallment, setSelectedInstallment] = useState<{ accountId: number; installmentId: number; number: number } | null>(null);

  const handleViewAccount = (account: Account) => {
    setSelectedAccount(account);
    setViewDialogOpen(true);
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setEditDialogOpen(true);
  };

  const handleMarkAsPaidClick = (accountId: number, installmentId: number, installmentNumber: number) => {
    setSelectedInstallment({ accountId, installmentId, number: installmentNumber });
    setMarkAsPaidDialogOpen(true);
  };

  const handleConfirmMarkAsPaid = () => {
    if (selectedInstallment) {
      onMarkAsPaid(selectedInstallment.accountId, selectedInstallment.installmentId);
      setMarkAsPaidDialogOpen(false);
      setSelectedInstallment(null);
    }
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewAccount(account)}
                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEditAccount(account)}
                  className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                >
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
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                      <span className="text-white font-medium">
                        {installment.number}ª parcela
                      </span>
                      <span className="text-slate-300">
                        R$ {installment.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-400">
                        Vencimento: {format(installment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      {installment.paymentDate && (
                        <span className="text-green-400">
                          Pago em: {format(installment.paymentDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(installment.status)}>
                      {installment.status}
                    </Badge>
                    {installment.status !== 'pago' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleMarkAsPaidClick(account.id, installment.id, installment.number)}
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

      <ViewAccountDialog
        account={selectedAccount}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        getStatusColor={getStatusColor}
      />

      <EditAccountDialog
        account={selectedAccount}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateAccount={onUpdateAccount}
      />

      <MarkAsPaidDialog
        open={markAsPaidDialogOpen}
        onOpenChange={setMarkAsPaidDialogOpen}
        onConfirm={handleConfirmMarkAsPaid}
        installmentNumber={selectedInstallment?.number || 0}
      />
    </div>
  );
};

export default AccountsList;
