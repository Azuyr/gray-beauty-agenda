
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, DollarSign } from "lucide-react";

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
}

const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
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

  return (
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
        <Button variant="outline" size="sm" className="text-brand-blue-600 border-brand-blue-200 hover:bg-brand-blue-50">
          Ver detalhes
        </Button>
      </div>
    </div>
  );
};

export default AppointmentCard;
