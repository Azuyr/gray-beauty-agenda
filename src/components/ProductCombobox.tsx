
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
import { useProducts } from "@/hooks/useProducts";

interface Product {
  value: string;
  label: string;
  price: number;
}

interface ProductComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ProductCombobox = ({ value, onChange, placeholder = "Selecionar produto..." }: ProductComboboxProps) => {
  const [open, setOpen] = useState(false);
  const { products: dbProducts } = useProducts();

  const products: Product[] = dbProducts.map(product => ({
    value: product.id,
    label: product.name,
    price: product.price
  }));

  const selectedProduct = products.find(product => product.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
        >
          {selectedProduct ? (
            <div className="flex items-center justify-between w-full">
              <span>{selectedProduct.label}</span>
              <span className="text-slate-400 text-sm">R$ {selectedProduct.price}</span>
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
            placeholder="Buscar produtos..." 
            className="bg-slate-800 text-white border-slate-700"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="text-slate-400">Nenhum produto encontrado.</CommandEmpty>
            
            <CommandGroup className="text-slate-300">
              {products.map((product) => (
                <CommandItem
                  key={product.value}
                  value={product.value}
                  onSelect={(currentValue) => {
                    const selectedProduct = products.find(p => p.value === currentValue);
                    if (selectedProduct) {
                      onChange(JSON.stringify(selectedProduct));
                    }
                    setOpen(false);
                  }}
                  className="text-slate-200 hover:bg-slate-700"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{product.label}</span>
                    <span className="text-slate-400 text-sm">R$ {product.price}</span>
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

export default ProductCombobox;
