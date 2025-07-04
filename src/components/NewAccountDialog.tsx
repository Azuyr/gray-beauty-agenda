
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import { useAccountsReceivable } from "@/hooks/useAccountsReceivable";

interface NewAccountDialogProps {
  onCreateAccount?: (accountData: any) => void;
}

const NewAccountDialog = ({ onCreateAccount }: NewAccountDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    clientId: "",
    totalAmount: ""
  });
  const { clients } = useClients();
  const { addAccount } = useAccountsReceivable();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedClient = clients.find(c => c.id === formData.clientId);
    if (!selectedClient) return;

    const accountData = {
      client_id: formData.clientId,
      client_name: selectedClient.name,
      title: formData.title,
      total_amount: parseFloat(formData.totalAmount),
    };

    const result = await addAccount(accountData);
    if (result) {
      setOpen(false);
      setFormData({ title: "", clientId: "", totalAmount: "" });
      if (onCreateAccount) {
        onCreateAccount(result);
      }
    }
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
            <Select value={formData.clientId} onValueChange={(value) => setFormData({ ...formData, clientId: value })}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id} className="text-white">
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
