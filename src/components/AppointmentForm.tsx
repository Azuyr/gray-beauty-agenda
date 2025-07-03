import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Save, Calendar as CalendarIcon, X } from "lucide-react";
import ServiceCombobox from "@/components/ServiceCombobox";
import ProductCombobox from "@/components/ProductCombobox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ContactButtons from "./ContactButtons";
import { Badge } from "@/components/ui/badge";
import { useClients } from "@/hooks/useClients";

interface Service {
  value: string;
  label: string;
  price: number;
}

interface Product {
  value: string;
  label: string;
  price: number;
}

interface FormData {
  clientName: string;
  clientId: string;
  services: Service[];
  products: Product[];
  time: string;
  notes: string;
  discountType: 'percentage' | 'amount';
  discountValue: number;
}

interface AppointmentFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  date: Date | undefined;
  setDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  onSubmit: (e: React.FormEvent) => void;
  isEditing: boolean;
}

const AppointmentForm = ({ 
  formData, 
  setFormData, 
  date, 
  setDate, 
  onSubmit, 
  isEditing 
}: AppointmentFormProps) => {
  const { clients } = useClients();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceAdd = (serviceValue: string) => {
    const services = [
      { value: "corte-escova", label: "Corte + Escova", price: 45 },
      { value: "barba-bigode", label: "Barba + Bigode", price: 25 },
      { value: "limpeza-pele", label: "Limpeza de Pele", price: 80 },
      { value: "corte-masculino", label: "Corte Masculino", price: 30 },
      { value: "coloracao", label: "Coloração", price: 120 },
      { value: "hidratacao", label: "Hidratação", price: 60 },
      { value: "sobrancelha", label: "Design de Sobrancelha", price: 35 },
      { value: "manicure", label: "Manicure", price: 25 },
      { value: "pedicure", label: "Pedicure", price: 30 },
    ];
    
    const service = services.find(s => s.value === serviceValue);
    if (service && !formData.services.find(s => s.value === serviceValue)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, service]
      }));
    }
  };

  const handleProductAdd = (productValue: string) => {
    const products = [
      { value: "shampoo-premium", label: "Shampoo Premium", price: 45 },
      { value: "condicionador", label: "Condicionador", price: 35 },
      { value: "mascara-hidratante", label: "Máscara Hidratante", price: 55 },
      { value: "oleo-argan", label: "Óleo de Argan", price: 75 },
      { value: "protetor-termico", label: "Protetor Térmico", price: 40 },
      { value: "esmalte", label: "Esmalte", price: 15 },
      { value: "base-unha", label: "Base para Unha", price: 12 },
      { value: "creme-maos", label: "Creme para Mãos", price: 25 },
      { value: "removedor", label: "Removedor de Esmalte", price: 18 },
    ];
    
    const product = products.find(p => p.value === productValue);
    if (product && !formData.products.find(p => p.value === productValue)) {
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, product]
      }));
    }
  };

  const handleServiceRemove = (serviceValue: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.value !== serviceValue)
    }));
  };

  const handleProductRemove = (productValue: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.value !== productValue)
    }));
  };

  const handleDiscountChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calcular totais
  const servicesTotal = formData.services.reduce((total, service) => total + service.price, 0);
  const productsTotal = formData.products.reduce((total, product) => total + product.price, 0);
  const subtotal = servicesTotal + productsTotal;
  
  let discountAmount = 0;
  if (formData.discountType === 'percentage') {
    discountAmount = (subtotal * formData.discountValue) / 100;
  } else {
    discountAmount = formData.discountValue;
  }
  
  const totalAmount = Math.max(0, subtotal - discountAmount);

  const createAccountsReceivable = (totalAmount: number, installments: number = 1) => {
    const installmentAmount = totalAmount / installments;
    const accounts = [];
    
    for (let i = 0; i < installments; i++) {
      accounts.push({
        number: i + 1,
        amount: installmentAmount,
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + i)),
        status: 'pendente' as const
      });
    }
    
    return {
      title: `Agendamento - ${formData.clientName}`,
      clientName: formData.clientName,
      totalAmount: totalAmount,
      installments: accounts,
      appointmentId: Date.now(), // Mock ID
      createdAt: new Date()
    };
  };

  const handleSubmitWithAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar conta a receber automaticamente quando salvar o agendamento
    if (totalAmount > 0) {
      const accountData = createAccountsReceivable(totalAmount, 1); // Por enquanto, sempre 1 parcela
      console.log('Conta a receber criada:', accountData);
      // Aqui você salvaria a conta no estado global ou banco de dados
    }
    
    onSubmit(e);
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center text-white">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Dados do Agendamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmitWithAccounts} className="space-y-4">
          <div>
            <Label className="text-slate-300">Cliente</Label>
            <Select 
              value={formData.clientId} 
              onValueChange={(value) => {
                const selectedClient = clients.find(c => c.id === value);
                setFormData(prev => ({
                  ...prev,
                  clientId: value,
                  clientName: selectedClient?.name || ""
                }));
              }}
            >
              <SelectTrigger className="mt-1 bg-slate-700 border-slate-600 text-white">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Serviços</Label>
              <div className="mt-1">
                <ServiceCombobox
                  value=""
                  onChange={handleServiceAdd}
                  placeholder="Adicionar serviço..."
                />
              </div>
              <div className="mt-2 space-y-2">
                {formData.services.map((service) => (
                  <Badge key={service.value} variant="secondary" className="bg-blue-900 text-blue-200 hover:bg-blue-800">
                    {service.label} - R$ {service.price}
                    <X 
                      className="h-3 w-3 ml-2 cursor-pointer" 
                      onClick={() => handleServiceRemove(service.value)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <Label className="text-slate-300">Produtos</Label>
              <div className="mt-1">
                <ProductCombobox
                  value=""
                  onChange={handleProductAdd}
                  placeholder="Adicionar produto..."
                />
              </div>
              <div className="mt-2 space-y-2">
                {formData.products.map((product) => (
                  <Badge key={product.value} variant="secondary" className="bg-green-900 text-green-200 hover:bg-green-800">
                    {product.label} - R$ {product.price}
                    <X 
                      className="h-3 w-3 ml-2 cursor-pointer" 
                      onClick={() => handleProductRemove(product.value)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1 bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                      !date && "text-slate-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    className="pointer-events-auto text-white"
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div>
              <Label htmlFor="time" className="text-slate-300">Horário</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="mt-1 bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Seção de Desconto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-slate-300">Tipo de Desconto</Label>
              <select
                value={formData.discountType}
                onChange={(e) => handleDiscountChange('discountType', e.target.value)}
                className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="percentage">Percentual (%)</option>
                <option value="amount">Valor (R$)</option>
              </select>
            </div>
            <div>
              <Label className="text-slate-300">Valor do Desconto</Label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={formData.discountValue}
                onChange={(e) => handleDiscountChange('discountValue', parseFloat(e.target.value) || 0)}
                className="mt-1 bg-slate-700 border-slate-600 text-white"
                placeholder={formData.discountType === 'percentage' ? "%" : "R$"}
              />
            </div>
          </div>

          {/* Totalizador */}
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Total Serviços:</span>
                  <span>R$ {servicesTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Produtos:</span>
                  <span>R$ {productsTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Subtotal:</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Desconto:</span>
                    <span>- R$ {discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-lg border-t border-slate-600 pt-2">
                  <span>Total Final:</span>
                  <span>R$ {totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="notes" className="text-slate-300">Observações</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Observações especiais..."
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? "Atualizar Agendamento" : "Salvar Agendamento"}
            </Button>
            
            {formData.clientName && date && formData.time && (formData.services.length > 0 || formData.products.length > 0) && (
              <ContactButtons
                clientName={formData.clientName}
                services={formData.services}
                products={formData.products}
                date={date}
                time={formData.time}
                servicesTotal={servicesTotal}
                productsTotal={productsTotal}
                discountAmount={discountAmount}
                totalAmount={totalAmount}
              />
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
