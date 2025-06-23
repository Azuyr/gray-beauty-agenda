
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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

interface EditAccountDialogProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateAccount: (accountId: number, updatedData: Partial<Account>) => void;
}

const EditAccountDialog = ({ account, open, onOpenChange, onUpdateAccount }: EditAccountDialogProps) => {
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    totalAmount: ""
  });

  useEffect(() => {
    if (account) {
      setFormData({
        title: account.title,
        clientName: account.clientName,
        totalAmount: account.totalAmount.toString()
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;

    const updatedData = {
      title: formData.title,
      clientName: formData.clientName,
      totalAmount: parseFloat(formData.totalAmount)
    };

    onUpdateAccount(account.id, updatedData);
    onOpenChange(false);
  };

  if (!account) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Editar Conta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-slate-300">Título</Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-slate-300">Cliente</Label>
            <Input
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div>
            <Label className="text-slate-300">Valor Total</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAccountDialog;
