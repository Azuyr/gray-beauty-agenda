import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const CalendarView = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock data para agendamentos
  const appointments = [
    {
      id: 1,
      date: new Date(),
      time: "09:00",
      clientName: "Maria Silva",
      service: "Corte + Escova",
      status: "confirmado"
    },
    {
      id: 2,
      date: new Date(),
      time: "10:30",
      clientName: "João Santos",
      service: "Barba + Bigode",
      status: "pendente"
    },
    {
      id: 3,
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      time: "14:00",
      clientName: "Ana Costa",
      service: "Limpeza de Pele",
      status: "confirmado"
    },
    {
      id: 4,
      date: new Date(new Date().setDate(new Date().getDate() + 2)),
      time: "15:30",
      clientName: "Pedro Oliveira",
      service: "Corte Masculino",
      status: "confirmado"
    }
  ];

  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      format(apt.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'cancelado':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-brand-gray-100 text-brand-gray-800 hover:bg-brand-gray-100';
    }
  };

  const appointmentsForSelectedDate = getAppointmentsForDate(selectedDate);

  // Destacar datas com agendamentos
  const datesWithAppointments = appointments.map(apt => apt.date);

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
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-brand-gray-900 mb-2">
                Calendário de Agendamentos
              </h1>
              <p className="text-brand-gray-600">
                Visualize e gerencie seus agendamentos
              </p>
            </div>
            <Button className="bg-brand-gray-700 hover:bg-brand-gray-800">
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
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
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
                <p className="text-brand-gray-500 text-center py-8">
                  Nenhum agendamento para esta data
                </p>
              ) : (
                <div className="space-y-4">
                  {appointmentsForSelectedDate.map((appointment) => (
                    <div 
                      key={appointment.id}
                      className="p-4 border border-brand-gray-200 rounded-lg bg-white"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-brand-gray-900">
                          {appointment.time}
                        </span>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-brand-gray-600 mb-1">
                        <User className="h-3 w-3 mr-1" />
                        {appointment.clientName}
                      </div>
                      <p className="text-sm text-brand-gray-500">
                        {appointment.service}
                      </p>
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
              {appointments.slice(0, 4).map((appointment) => (
                <div 
                  key={appointment.id}
                  className="p-4 border border-brand-gray-200 rounded-lg bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-brand-gray-900">
                      {format(appointment.date, "dd/MM", { locale: ptBR })}
                    </span>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-brand-gray-600 mb-1">
                    {appointment.time} - {appointment.clientName}
                  </p>
                  <p className="text-xs text-brand-gray-500">
                    {appointment.service}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalendarView;
