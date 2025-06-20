
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

interface Appointment {
  id: number;
  date: string;
  time: string;
  clientName: string;
  service: string;
  status: string;
}

interface SearchResultsProps {
  searchTerm: string;
  isOpen: boolean;
  onClose: () => void;
}

const SearchResults = ({ searchTerm, isOpen, onClose }: SearchResultsProps) => {
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const navigate = useNavigate();

  // Mock data de agendamentos
  const mockAppointments: Appointment[] = [
    {
      id: 1,
      date: "2024-01-15",
      time: "09:00",
      clientName: "Maria Silva",
      service: "Corte + Escova",
      status: "confirmado"
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "10:30",
      clientName: "João Santos",
      service: "Barba + Bigode",
      status: "pendente"
    },
    {
      id: 3,
      date: "2024-01-16",
      time: "14:00",
      clientName: "Ana Costa",
      service: "Limpeza de Pele",
      status: "confirmado"
    },
    {
      id: 4,
      date: "2024-01-17",
      time: "15:30",
      clientName: "Pedro Oliveira",
      service: "Corte Masculino",
      status: "confirmado"
    }
  ];

  useEffect(() => {
    if (searchTerm && searchTerm.length > 2) {
      const filtered = mockAppointments.filter(appointment =>
        appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.service.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments([]);
    }
  }, [searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditAppointment = (appointment: Appointment) => {
    navigate('/appointments', { 
      state: { 
        editingAppointment: appointment 
      } 
    });
    onClose();
  };

  if (!isOpen || !searchTerm || searchTerm.length <= 2) {
    return null;
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-2 z-50">
      <Card className="bg-slate-800 border-slate-700 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <User className="h-4 w-4 mr-2" />
              Resultados da pesquisa por "{searchTerm}"
            </CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAppointments.length === 0 ? (
            <p className="text-slate-400 text-center py-4">
              Nenhum agendamento encontrado
            </p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-3 border border-slate-600 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer"
                  onClick={() => handleEditAppointment(appointment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <span className="text-white text-sm">
                        {format(new Date(appointment.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span className="text-white text-sm">{appointment.time}</span>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="text-slate-300 text-sm">
                    <strong>{appointment.clientName}</strong>
                  </div>
                  <div className="text-slate-400 text-sm">
                    {appointment.service}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchResults;
