
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Save, Calendar as CalendarIcon } from "lucide-react";
import ServiceProductCombobox from "@/components/ServiceProductCombobox";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import ContactButtons from "./ContactButtons";

interface FormData {
  clientName: string;
  service: string;
  time: string;
  notes: string;
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
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleServiceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      service: value
    }));
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
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName" className="text-slate-300">Nome do Cliente</Label>
            <Input
              id="clientName"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              required
              className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          
          <div>
            <Label className="text-slate-300">Serviço/Produto</Label>
            <div className="mt-1">
              <ServiceProductCombobox
                value={formData.service}
                onChange={handleServiceChange}
                placeholder="Selecionar serviço ou produto..."
              />
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
            
            {formData.clientName && date && formData.time && (
              <ContactButtons
                clientName={formData.clientName}
                service={formData.service}
                date={date}
                time={formData.time}
              />
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
