
import { Calendar, Users, Clock, TrendingUp, Scissors, Heart, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import AppointmentCard from "@/components/AppointmentCard";
import TrialBanner from "@/components/TrialBanner";
import { useAuth } from "@/hooks/useAuth";
import { useAppointments } from "@/hooks/useAppointments";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Index = () => {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { stats } = useDashboardStats();
  const trialDaysLeft = 5; // Mock trial days

  // Filter upcoming appointments
  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.appointment_date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      return appointmentDate >= today && appointmentDate <= tomorrow;
    })
    .slice(0, 3);

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 to-brand-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-brand-gray-700 rounded-full mr-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-gray-700 to-brand-gray-900 bg-clip-text text-transparent">
                  BeautyBook
                </h1>
              </div>
              <p className="text-xl text-brand-gray-700 mb-2">
                Sistema de Agendamento Profissional
              </p>
              <p className="text-brand-gray-600 mb-8">
                Para Salões de Beleza • Barbearias • Clínicas de Estética
              </p>
            </div>

            <Link to="/auth">
              <Button size="lg" className="mb-8">
                Entrar / Cadastrar
              </Button>
            </Link>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="text-center p-6 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                <Scissors className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Salões de Beleza</h3>
                <p className="text-sm text-slate-400">Gerencie cortes, colorações e tratamentos</p>
              </div>
              <div className="text-center p-6 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                <Scissors className="h-8 w-8 text-blue-400 mx-auto mb-3 rotate-45" />
                <h3 className="font-semibold text-white mb-2">Barbearias</h3>
                <p className="text-sm text-slate-400">Organize cortes masculinos e barbearia</p>
              </div>
              <div className="text-center p-6 bg-slate-800 rounded-lg shadow-sm border border-slate-700">
                <Heart className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="font-semibold text-white mb-2">Clínicas de Estética</h3>
                <p className="text-sm text-slate-400">Controle procedimentos e consultas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-gray-50">
      <Navbar />
      
      {trialDaysLeft > 0 && <TrialBanner daysLeft={trialDaysLeft} />}
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-brand-gray-600">
            Bem-vindo, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Agendamentos Hoje"
            value={stats.todayAppointments.toString()}
            icon={Calendar}
          />
          <StatsCard
            title="Clientes Ativos"
            value={stats.activeClients.toString()}
            icon={Users}
          />
          <StatsCard
            title="Receita do Mês"
            value={`R$ ${stats.monthlyRevenue.toFixed(2)}`}
            icon={TrendingUp}
          />
          <StatsCard
            title="Taxa de Ocupação"
            value={`${stats.occupancyRate}%`}
            icon={Clock}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Próximos Agendamentos</span>
                <Link to="/calendar">
                  <Button variant="outline" size="sm">
                    Ver calendário
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => (
                    <AppointmentCard key={appointment.id} appointment={appointment} />
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">
                    Nenhum agendamento para hoje
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/appointments">
                <Button className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </Link>
              <Link to="/client-management">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Gerenciar Clientes
                </Button>
              </Link>
              <Link to="/calendar">
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Ver Agenda
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
