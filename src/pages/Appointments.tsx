import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Save, Calendar as CalendarIcon, Clock, User, Mail, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

const Appointments = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    service: "",
    time: "",
    notes: ""
  });
  const { toast } = useToast();
  const location = useLocation();
  const editingAppointment = location.state?.editingAppointment;

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (editingAppointment) {
      console.log("Editing appointment:", editingAppointment);
      
      setFormData({
        clientName: editingAppointment.clientName || "",
        service: editingAppointment.service || "",
        time: editingAppointment.time || "",
        notes: ""
      });
      
      // Converter a data do formato dd/MM/yyyy para Date com validação
      if (editingAppointment.date) {
        try {
          console.log("Parsing date:", editingAppointment.date);
          const parsedDate = parse(editingAppointment.date, "dd/MM/yyyy", new Date());
          
          if (isValid(parsedDate)) {
            setDate(parsedDate);
            console.log("Date parsed successfully:", parsedDate);
          } else {
            console.error("Parsed date is invalid:", parsedDate);
            toast({
              title: "Erro",
              description: "Data do agendamento inválida.",
              variant: "destructive"
            });
          }
        } catch (error) {
          console.error("Erro ao converter data:", error);
          toast({
            title: "Erro",
            description: "Erro ao processar a data do agendamento.",
            variant: "destructive"
          });
        }
      }
    }
  }, [editingAppointment, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Erro",
        description: "Selecione uma data para o agendamento.",
        variant: "destructive"
      });
      return;
    }
    
    const action = editingAppointment ? "atualizado" : "criado";
    toast({
      title: `Agendamento ${action} com sucesso!`,
      description: `Agendamento para ${formData.clientName} em ${format(date, "dd/MM/yyyy", { locale: ptBR })} às ${formData.time}.`,
    });
    setFormData({ clientName: "", service: "", time: "", notes: "" });
    setDate(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Confirmação de Agendamento - BeautyBook");
    const body = encodeURIComponent(`Olá ${formData.clientName},\n\nSeu agendamento foi confirmado:\n\nServiço: ${formData.service}\nData: ${date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : ""}\nHorário: ${formData.time}\n\nObrigado por escolher nossos serviços!`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(`Olá ${formData.clientName}! Seu agendamento foi confirmado:\n\nServiço: ${formData.service}\nData: ${date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : ""}\nHorário: ${formData.time}\n\nObrigado por escolher nossos serviços!`);
    window.open(`https://wa.me/?text=${message}`);
  };

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-brand-gray-900 mb-2">
            {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
          </h1>
          <p className="text-brand-gray-600">
            {editingAppointment ? "Edite os dados do agendamento" : "Crie um novo agendamento para seu cliente"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Dados do Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    required
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="service">Serviço</Label>
                  <Input
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    placeholder="Ex: Corte + Escova"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Data</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={setDate}
                          initialFocus
                          className="pointer-events-auto"
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Horário</Label>
                    <Input
                      id="time"
                      name="time"
                      type="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Observações</Label>
                  <Input
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Observações especiais..."
                    className="mt-1"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button type="submit" className="bg-brand-gray-700 hover:bg-brand-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    {editingAppointment ? "Atualizar Agendamento" : "Salvar Agendamento"}
                  </Button>
                  
                  {formData.clientName && date && formData.time && (
                    <div className="flex space-x-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={sendEmail}
                        className="flex-1"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Enviar por E-mail
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={sendWhatsApp}
                        className="flex-1"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Enviar WhatsApp
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horários Disponíveis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, time }))}
                    className={formData.time === time ? "bg-brand-blue-100 border-brand-blue-500" : ""}
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
