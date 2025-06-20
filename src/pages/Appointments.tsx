
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import AppointmentForm from "@/components/AppointmentForm";
import TimeSlots from "@/components/TimeSlots";
import { useToast } from "@/hooks/use-toast";
import { format, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
      
      // Melhor tratamento para conversão de data
      if (editingAppointment.date) {
        try {
          console.log("Parsing date:", editingAppointment.date);
          
          // Tentar diferentes formatos de data
          let parsedDate;
          
          if (editingAppointment.date.includes('/')) {
            // Formato dd/MM/yyyy
            parsedDate = parse(editingAppointment.date, "dd/MM/yyyy", new Date());
          } else if (editingAppointment.date.includes('-')) {
            // Formato yyyy-MM-dd
            parsedDate = parse(editingAppointment.date, "yyyy-MM-dd", new Date());
          } else {
            // Tentar como Date diretamente
            parsedDate = new Date(editingAppointment.date);
          }
          
          if (isValid(parsedDate)) {
            setDate(parsedDate);
            console.log("Date parsed successfully:", parsedDate);
          } else {
            console.error("Parsed date is invalid:", parsedDate);
            // Definir data atual como fallback
            setDate(new Date());
          }
        } catch (error) {
          console.error("Erro ao converter data:", error);
          setDate(new Date());
        }
      }
    }
  }, [editingAppointment]);

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
    
    // Se for uma edição, navegar de volta; se for novo, limpar o formulário
    if (editingAppointment) {
      navigate(-1); // Volta para a página anterior
    } else {
      setFormData({ clientName: "", service: "", time: "", notes: "" });
      setDate(undefined);
    }
  };

  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time }));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            {editingAppointment ? "Editar Agendamento" : "Novo Agendamento"}
          </h1>
          <p className="text-slate-400">
            {editingAppointment ? "Edite os dados do agendamento" : "Crie um novo agendamento para seu cliente"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentForm
            formData={formData}
            setFormData={setFormData}
            date={date}
            setDate={setDate}
            onSubmit={handleSubmit}
            isEditing={!!editingAppointment}
          />

          <TimeSlots
            selectedTime={formData.time}
            onTimeSelect={handleTimeSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default Appointments;
