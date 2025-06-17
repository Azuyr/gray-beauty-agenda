
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
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pendente':
        return 'bg-brand-gray-100 text-brand-gray-800 hover:bg-brand-gray-100';
      case 'cancelado':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-brand-gray-100 text-brand-gray-800 hover:bg-brand-gray-100';
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
      <div className="flex items-center justify-between p-4 border border-brand-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 bg-brand-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-brand-blue-600" />
          </div>
          
          <div>
            <h4 className="font-semibold text-brand-gray-900">{appointment.clientName}</h4>
            <p className="text-sm text-brand-gray-600">{appointment.service}</p>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center text-xs text-brand-gray-500">
                <Clock className="h-3 w-3 mr-1" />
                {appointment.time} • {appointment.date}
              </div>
              <div className="flex items-center text-xs text-brand-gray-500">
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
              <Button variant="outline" size="sm" className="text-brand-blue-600 border-brand-blue-200 hover:bg-brand-blue-50">
                Ver detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Detalhes do Agendamento
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Cliente:</span>
                  <span className="text-brand-gray-600">{appointment.clientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Serviço:</span>
                  <span className="text-brand-gray-600">{appointment.service}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Data:</span>
                  <span className="text-brand-gray-600">{appointment.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Horário:</span>
                  <span className="text-brand-gray-600">{appointment.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Preço:</span>
                  <span className="text-brand-gray-600">{appointment.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand-gray-900">Status:</span>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={handleEdit} className="w-full bg-brand-gray-700 hover:bg-brand-gray-800">
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
