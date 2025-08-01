
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
import { useAppointments } from "@/hooks/useAppointments";
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

const Appointments = () => {
  const [date, setDate] = useState<Date>();
  const [formData, setFormData] = useState({
    clientName: "",
    clientId: "",
    services: [] as Service[],
    products: [] as Product[],
    time: "",
    notes: "",
    discountType: 'percentage' as 'percentage' | 'amount',
    discountValue: 0
  });
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { addAppointment, updateAppointment } = useAppointments();
  const { clients } = useClients();
  const editingAppointment = location.state?.editingAppointment;

  // Preencher formulário se estiver editando
  useEffect(() => {
    if (editingAppointment) {
      console.log("Editing appointment:", editingAppointment);
      
      // Converter serviços e produtos antigos para nova estrutura
      const services = [];
      const products = [];
      
      if (editingAppointment.service) {
        // Mapear serviços antigos
        const serviceMap = {
          "Corte + Escova": { value: "corte-escova", label: "Corte + Escova", price: 45 },
          "Barba + Bigode": { value: "barba-bigode", label: "Barba + Bigode", price: 25 },
          "Limpeza de Pele": { value: "limpeza-pele", label: "Limpeza de Pele", price: 80 },
          "Corte Masculino": { value: "corte-masculino", label: "Corte Masculino", price: 30 },
        };
        
        const mappedService = serviceMap[editingAppointment.service as keyof typeof serviceMap];
        if (mappedService) {
          services.push(mappedService);
        }
      }
      
      setFormData({
        clientName: editingAppointment.clients?.name || "",
        clientId: editingAppointment.client_id || "",
        services: services,
        products: products,
        time: format(new Date(editingAppointment.appointment_date), "HH:mm"),
        notes: editingAppointment.description || "",
        discountType: 'percentage',
        discountValue: 0
      });
      
      // Usar appointment_date do banco de dados
      if (editingAppointment.appointment_date) {
        try {
          console.log("Parsing appointment_date:", editingAppointment.appointment_date);
          
          const parsedDate = new Date(editingAppointment.appointment_date);
          
          if (isValid(parsedDate)) {
            setDate(parsedDate);
            console.log("Date parsed successfully:", parsedDate);
          } else {
            console.error("Parsed date is invalid:", parsedDate);
            setDate(new Date());
          }
        } catch (error) {
          console.error("Erro ao converter data:", error);
          setDate(new Date());
        }
      }
    }
  }, [editingAppointment]);

  const handleSubmit = async (e: React.FormEvent & { generateAccount?: boolean; totalAmount?: number }) => {
    e.preventDefault();
    if (!date) {
      toast({
        title: "Erro",
        description: "Selecione uma data para o agendamento.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.services.length === 0 && formData.products.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um serviço ou produto.",
        variant: "destructive"
      });
      return;
    }

    // Find client by ID
    const client = clients.find(c => c.id === formData.clientId);
    if (!client) {
      toast({
        title: "Erro",
        description: "Cliente não encontrado. Selecione um cliente.",
        variant: "destructive"
      });
      return;
    }
    
    const appointmentDate = new Date(date);
    const [hours, minutes] = formData.time.split(':');
    appointmentDate.setHours(parseInt(hours), parseInt(minutes));
    
    // Use o totalAmount calculado no AppointmentForm ou calcule novamente
    const totalAmount = e.totalAmount || (formData.services.reduce((sum, s) => sum + s.price, 0) + formData.products.reduce((sum, p) => sum + p.price, 0));
    
    const appointmentData = {
      client_id: client.id,
      title: formData.services.map(s => s.label).join(", ") || "Agendamento",
      description: formData.notes,
      appointment_date: appointmentDate.toISOString(),
      duration: 60, // Default duration
      status: 'scheduled' as const,
      total_amount: totalAmount,
      service_id: formData.services[0]?.value || null
    };

    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, appointmentData);
      navigate(-1);
    } else {
      const result = await addAppointment({
        ...appointmentData,
        generateAccount: e.generateAccount
      });
      if (result) {
        setFormData({ 
          clientName: "",
          clientId: "", 
          services: [], 
          products: [], 
          time: "", 
          notes: "",
          discountType: 'percentage',
          discountValue: 0
        });
        setDate(undefined);
      }
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
