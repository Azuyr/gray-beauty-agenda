
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
import { useServices } from "@/hooks/useServices";

interface Service {
  value: string;
  label: string;
  price: number;
}

interface ServiceComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ServiceCombobox = ({ value, onChange, placeholder = "Selecionar serviço..." }: ServiceComboboxProps) => {
  const [open, setOpen] = useState(false);
  const { services: dbServices } = useServices();

  const services: Service[] = dbServices.map(service => ({
    value: service.id,
    label: service.name,
    price: service.price
  }));

  const selectedService = services.find(service => service.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          {selectedService ? (
            <div className="flex items-center justify-between w-full">
              <span>{selectedService.label}</span>
              <span className="text-slate-400 text-sm">R$ {selectedService.price}</span>
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
            placeholder="Buscar serviços..." 
            className="bg-slate-800 text-white border-slate-700"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="text-slate-400">Nenhum serviço encontrado.</CommandEmpty>
            
            <CommandGroup className="text-slate-300">
              {services.map((service) => (
                <CommandItem
                  key={service.value}
                  value={service.value}
                  onSelect={(currentValue) => {
                    const selectedService = services.find(s => s.value === currentValue);
                    if (selectedService) {
                      onChange(JSON.stringify(selectedService));
                    }
                    setOpen(false);
                  }}
                  className="text-slate-200 hover:bg-slate-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === service.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{service.label}</span>
                    <span className="text-slate-400 text-sm">R$ {service.price}</span>
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

export default ServiceCombobox;
