
import { Calendar, Users, Clock, TrendingUp, Scissors, Heart, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import AppointmentCard from "@/components/AppointmentCard";
import TrialBanner from "@/components/TrialBanner";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user } = useAuth();
  const trialDaysLeft = 5; // Mock trial days

  const mockAppointments = [
    {
      id: 1,
      clientName: "Maria Silva",
      service: "Corte + Escova",
      time: "09:00",
      date: "Hoje",
      status: "confirmado",
      price: "R$ 85,00"
    },
    {
      id: 2,
      clientName: "João Santos",
      service: "Barba + Bigode",
      time: "10:30",
      date: "Hoje",
      status: "pendente",
      price: "R$ 35,00"
    },
    {
      id: 3,
      clientName: "Ana Costa",
      service: "Limpeza de Pele",
      time: "14:00",
      date: "Amanhã",
      status: "confirmado",
      price: "R$ 120,00"
    }
  ];

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
            value="8"
            icon={Calendar}
            trend="+12%"
            trendUp={true}
          />
          <StatsCard
            title="Clientes Ativos"
            value="156"
            icon={Users}
            trend="+5%"
            trendUp={true}
          />
          <StatsCard
            title="Receita do Mês"
            value="R$ 12.340"
            icon={TrendingUp}
            trend="+18%"
            trendUp={true}
          />
          <StatsCard
            title="Taxa de Ocupação"
            value="87%"
            icon={Clock}
            trend="+3%"
            trendUp={true}
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
                {mockAppointments.map((appointment) => (
                  <AppointmentCard key={appointment.id} appointment={appointment} />
                ))}
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
              <Link to="/add-client">
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  Adicionar Cliente
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
