
import { useState, useEffect } from "react";
import { Calendar, Users, Clock, TrendingUp, Scissors, Heart, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/StatsCard";
import AppointmentCard from "@/components/AppointmentCard";
import TrialBanner from "@/components/TrialBanner";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(5);
  const { toast } = useToast();

  // Mock authentication state
  useEffect(() => {
    // Simulate checking authentication status
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      // Calculate trial days (mock)
      const trialStart = localStorage.getItem('trialStart');
      if (trialStart) {
        const days = Math.max(0, 5 - Math.floor((Date.now() - parseInt(trialStart)) / (1000 * 60 * 60 * 24)));
        setTrialDaysLeft(days);
      }
    }
  }, []);

  const handleGoogleLogin = () => {
    // Mock Google login
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('trialStart', Date.now().toString());
    setIsAuthenticated(true);
    setTrialDaysLeft(5);
    toast({
      title: "Login realizado com sucesso!",
      description: "Bem-vindo! Você tem 5 dias de teste grátis.",
    });
  };

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue-50 to-brand-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <div className="mb-8 animate-fade-in">
              <div className="flex items-center justify-center mb-6">
                <div className="p-4 bg-brand-blue-600 rounded-full mr-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-brand-blue-600 to-brand-blue-800 bg-clip-text text-transparent">
                  BeautyBook
                </h1>
              </div>
              <p className="text-xl text-brand-gray-600 mb-2">
                Sistema de Agendamento Profissional
              </p>
              <p className="text-brand-gray-500 mb-8">
                Para Salões de Beleza • Barbearias • Clínicas de Estética
              </p>
            </div>

            <Card className="w-full max-w-md animate-fade-in shadow-xl border-0 gradient-card">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-brand-gray-800">
                  Comece seu teste grátis
                </CardTitle>
                <p className="text-brand-gray-600">
                  5 dias gratuitos • Sem compromisso
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-brand-blue-600 hover:bg-brand-blue-700 text-white py-3 text-lg transition-all duration-200 transform hover:scale-105"
                  size="lg"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </Button>
                
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-4 text-sm text-brand-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Agendamentos ilimitados
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      Gestão de clientes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-brand-gray-100">
                <Scissors className="h-8 w-8 text-brand-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-brand-gray-800 mb-2">Salões de Beleza</h3>
                <p className="text-sm text-brand-gray-600">Gerencie cortes, colorações e tratamentos</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-brand-gray-100">
                <Scissors className="h-8 w-8 text-brand-blue-600 mx-auto mb-3 rotate-45" />
                <h3 className="font-semibold text-brand-gray-800 mb-2">Barbearias</h3>
                <p className="text-sm text-brand-gray-600">Organize cortes masculinos e barbearia</p>
              </div>
              <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-brand-gray-100">
                <Heart className="h-8 w-8 text-brand-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-brand-gray-800 mb-2">Clínicas de Estética</h3>
                <p className="text-sm text-brand-gray-600">Controle procedimentos e consultas</p>
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
            Visão geral dos seus agendamentos e estatísticas
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
                <Button variant="outline" size="sm">
                  Ver todos
                </Button>
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
              <Button className="w-full bg-brand-blue-600 hover:bg-brand-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Adicionar Cliente
              </Button>
              <Button variant="outline" className="w-full">
                <Clock className="h-4 w-4 mr-2" />
                Ver Agenda
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
