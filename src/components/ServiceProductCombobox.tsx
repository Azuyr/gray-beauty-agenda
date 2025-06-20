
import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ServiceProduct {
  value: string;
  label: string;
  type: 'service' | 'product';
  price?: number;
}

interface ServiceProductComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ServiceProductCombobox = ({ value, onChange, placeholder = "Selecionar serviço..." }: ServiceProductComboboxProps) => {
  const [open, setOpen] = useState(false);

  // Mock data de serviços e produtos
  const servicesAndProducts: ServiceProduct[] = [
    // Serviços
    { value: "corte-escova", label: "Corte + Escova", type: "service", price: 45 },
    { value: "barba-bigode", label: "Barba + Bigode", type: "service", price: 25 },
    { value: "limpeza-pele", label: "Limpeza de Pele", type: "service", price: 80 },
    { value: "corte-masculino", label: "Corte Masculino", type: "service", price: 30 },
    { value: "coloracao", label: "Coloração", type: "service", price: 120 },
    { value: "hidratacao", label: "Hidratação", type: "service", price: 60 },
    { value: "sobrancelha", label: "Design de Sobrancelha", type: "service", price: 35 },
    { value: "manicure", label: "Manicure", type: "service", price: 25 },
    { value: "pedicure", label: "Pedicure", type: "service", price: 30 },
    
    // Produtos
    { value: "shampoo-premium", label: "Shampoo Premium", type: "product", price: 45 },
    { value: "condicionador", label: "Condicionador", type: "product", price: 35 },
    { value: "mascara-hidratante", label: "Máscara Hidratante", type: "product", price: 55 },
    { value: "oleo-argan", label: "Óleo de Argan", type: "product", price: 75 },
    { value: "protetor-termico", label: "Protetor Térmico", type: "product", price: 40 },
    { value: "esmalte", label: "Esmalte", type: "product", price: 15 },
    { value: "base-unha", label: "Base para Unha", type: "product", price: 12 },
  ];

  const selectedItem = servicesAndProducts.find(item => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          {selectedItem ? (
            <div className="flex items-center justify-between w-full">
              <span>{selectedItem.label}</span>
              <span className="text-slate-400 text-sm">
                {selectedItem.type === 'service' ? 'Serviço' : 'Produto'} - R$ {selectedItem.price}
              </span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-slate-800 border-slate-700">
        <Command className="bg-slate-800">
          <CommandInput 
            placeholder="Buscar serviços e produtos..." 
            className="bg-slate-800 text-white border-slate-700"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="text-slate-400">Nenhum item encontrado.</CommandEmpty>
            
            <CommandGroup heading="Serviços" className="text-slate-300">
              {servicesAndProducts
                .filter(item => item.type === 'service')
                .map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="text-slate-200 hover:bg-slate-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      <span className="text-slate-400 text-sm">R$ {item.price}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
            
            <CommandGroup heading="Produtos" className="text-slate-300">
              {servicesAndProducts
                .filter(item => item.type === 'product')
                .map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                    className="text-slate-200 hover:bg-slate-700"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex items-center justify-between w-full">
                      <span>{item.label}</span>
                      <span className="text-slate-400 text-sm">R$ {item.price}</span>
                    </div>
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ServiceProductCombobox;
