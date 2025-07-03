
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Clock, User, Edit, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "@/hooks/useAppointments";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { appointments, loading } = useAppointments();

  // Converter appointments do banco para formato esperado
  const formattedAppointments = appointments.map(apt => ({
    id: apt.id,
    date: new Date(apt.appointment_date),
    time: format(new Date(apt.appointment_date), "HH:mm"),
    clientName: apt.clients?.name || "Cliente não encontrado",
    service: apt.title,
    status: apt.status === 'scheduled' ? 'pendente' : 
           apt.status === 'confirmed' ? 'confirmado' :
           apt.status === 'completed' ? 'concluído' : 'cancelado',
    originalAppointment: apt
  }));

  const getAppointmentsForDate = (date: Date) => {
    return formattedAppointments.filter(apt => 
      format(apt.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'concluído':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'cancelado':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDetailDialogOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setIsDetailDialogOpen(false);
    navigate('/appointments', { 
      state: { 
        editingAppointment: appointment.originalAppointment 
      }
    });
  };

  const handleNewAppointment = () => {
    navigate('/appointments');
  };

  const appointmentsForSelectedDate = getAppointmentsForDate(selectedDate);

  // Destacar datas com agendamentos
  const datesWithAppointments = formattedAppointments.map(apt => apt.date);

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Calendário de Agendamentos
              </h1>
              <p className="text-slate-400">
                Visualize e gerencie seus agendamentos
              </p>
            </div>
            <Button onClick={handleNewAppointment} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Novo Agendamento
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="w-full pointer-events-auto"
                modifiers={{
                  hasAppointment: datesWithAppointments
                }}
                modifiersStyles={{
                  hasAppointment: {
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    fontWeight: 'bold'
                  }
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Agendamentos - {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appointmentsForSelectedDate.length === 0 ? (
                <p className="text-slate-400 text-center py-8">
                  Nenhum agendamento para esta data
                </p>
              ) : (
                <div className="space-y-4">
                  {appointmentsForSelectedDate.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="p-4 border border-slate-600 rounded-lg bg-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">
                          {appointment.time}
                        </span>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-slate-300 mb-1">
                        <User className="h-3 w-3 mr-1" />
                        {appointment.clientName}
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {appointment.service}
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewDetails(appointment)}
                        className="w-full text-blue-400 border-blue-700 hover:bg-blue-900 bg-slate-700"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Resumo dos próximos agendamentos */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {formattedAppointments.slice(0, 4).map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 border border-slate-600 rounded-lg bg-slate-700 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewDetails(appointment)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white">
                      {format(appointment.date, "dd/MM", { locale: ptBR })}
                    </span>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-300 mb-1">
                    {appointment.time} - {appointment.clientName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {appointment.service}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de detalhes do agendamento */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="sm:max-w-[425px] bg-slate-800 border-slate-700">
            <DialogHeader>
              <DialogTitle className="flex items-center text-white">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Detalhes do Agendamento
              </DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Cliente:</span>
                  <span className="text-slate-400">{selectedAppointment.clientName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Serviço:</span>
                  <span className="text-slate-400">{selectedAppointment.service}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Data:</span>
                  <span className="text-slate-400">
                    {format(selectedAppointment.date, "dd/MM/yyyy", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Horário:</span>
                  <span className="text-slate-400">{selectedAppointment.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-white">Status:</span>
                  <Badge className={getStatusColor(selectedAppointment.status)}>
                    {selectedAppointment.status}
                  </Badge>
                </div>
                <div className="pt-4 border-t border-slate-700">
                  <Button 
                    onClick={() => handleEditAppointment(selectedAppointment)} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar Agendamento
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CalendarView;
