
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NewAccountDialogProps {
  onCreateAccount: (accountData: any) => void;
}

const NewAccountDialog = ({ onCreateAccount }: NewAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    totalAmount: "",
    installments: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAccount = {
      id: Date.now(),
      title: formData.title,
      clientName: formData.clientName,
      totalAmount: parseFloat(formData.totalAmount),
      installments: Array.from({ length: formData.installments }, (_, index) => ({
        id: Date.now() + index,
        number: index + 1,
        amount: parseFloat(formData.totalAmount) / formData.installments,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + index)),
        status: 'pendente' as const
      })),
      createdAt: new Date()
    };

    onCreateAccount(newAccount);
    setOpen(false);
    setFormData({ title: "", clientName: "", totalAmount: "", installments: 1 });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Nova Conta a Receber</DialogTitle>
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
          <div>
            <Label className="text-slate-300">Número de Parcelas</Label>
            <Input
              type="number"
              min="1"
              value={formData.installments}
              onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) })}
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Conta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAccountDialog;
