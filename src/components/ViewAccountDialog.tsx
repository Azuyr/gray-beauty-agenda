
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
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
  createdAt: Date;
}

interface ViewAccountDialogProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStatusColor: (status: string) => string;
}

const ViewAccountDialog = ({ account, open, onOpenChange, getStatusColor }: ViewAccountDialogProps) => {
  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Detalhes da Conta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{account.title}</h3>
            <p className="text-slate-400">Cliente: {account.clientName}</p>
            <p className="text-slate-400">
              Criado em: {format(account.createdAt, "dd/MM/yyyy", { locale: ptBR })}
            </p>
            <p className="text-slate-400">
              Valor Total: R$ {account.totalAmount.toFixed(2)}
            </p>
          </div>
          
          <div>
            <h4 className="text-slate-300 font-medium mb-3">Parcelas:</h4>
            <div className="space-y-2">
              {account.installments.map((installment) => (
                <div 
                  key={installment.id}
                  className="flex justify-between items-center p-3 bg-slate-700 rounded-lg"
                >
                  <div>
                    <span className="text-white font-medium">
                      {installment.number}ª parcela - R$ {installment.amount.toFixed(2)}
                    </span>
                    <div className="text-slate-400 text-sm">
                      Vencimento: {format(installment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
                      {installment.paymentDate && (
                        <span className="ml-4">
                          Pago em: {format(installment.paymentDate, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge className={getStatusColor(installment.status)}>
                    {installment.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAccountDialog;
