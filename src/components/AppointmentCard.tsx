
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, DollarSign, Edit, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  clientName: string;
  service: string;
  time: string;
  date: string;
  status: string;
  price: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
}

const AppointmentCard = ({ appointment, onEdit }: AppointmentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-900 text-green-300 hover:bg-green-900';
      case 'pendente':
        return 'bg-slate-700 text-slate-300 hover:bg-slate-700';
      case 'cancelado':
        return 'bg-red-900 text-red-300 hover:bg-red-900';
      default:
        return 'bg-slate-700 text-slate-300 hover:bg-slate-700';
    }
  };

  const handleEdit = () => {
    setIsOpen(false);
    // Navegar para a página de agendamentos com os dados do agendamento
    navigate('/appointments', { 
      state: { 
        editingAppointment: appointment 
      }
    });
    
    if (onEdit) {
      onEdit(appointment);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:shadow-md transition-shadow bg-slate-800">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-blue-400" />
          </div>
          
          <div>
            <h4 className="font-semibold text-white">{appointment.clientName}</h4>
            <p className="text-sm text-slate-400">{appointment.service}</p>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center text-xs text-slate-500">
                <Clock className="h-3 w-3 mr-1" />
                {appointment.time} • {appointment.date}
              </div>
              <div className="flex items-center text-xs text-slate-500">
                <DollarSign className="h-3 w-3 mr-1" />
                {appointment.price}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge className={getStatusColor(appointment.status)}>
            {appointment.status}
          </Badge>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-blue-400 border-blue-700 hover:bg-blue-900 bg-slate-700">
                Ver detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="flex items-center text-white">
                  <Calendar className="h-5 w-5 mr-2" />
                  Detalhes do Agendamento
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Cliente:</span>
                  <span className="text-slate-400">{appointment.clientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Serviço:</span>
                  <span className="text-slate-400">{appointment.service}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Data:</span>
                  <span className="text-slate-400">{appointment.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Horário:</span>
                  <span className="text-slate-400">{appointment.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Preço:</span>
                  <span className="text-slate-400">{appointment.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Status:</span>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <Button onClick={handleEdit} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Agendamento
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

export default AppointmentCard;
