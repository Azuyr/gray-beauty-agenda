
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Settings as SettingsIcon, Bell, Clock, Mail, Palette } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: "BeautyBook",
    companyEmail: "contato@beautybook.com",
    companyPhone: "(11) 99999-9999",
    companyAddress: "Rua das Flores, 123 - São Paulo, SP",
    workingHours: {
      start: "09:00",
      end: "18:00",
      lunch: "12:00-14:00"
    },
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    booking: {
      advanceTime: "15",
      cancelTime: "24",
      autoConfirm: false
    }
  });

  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Configurações salvas com sucesso!",
      description: "Todas as alterações foram aplicadas ao sistema.",
    });
  };

  const handleInputChange = (section: string, field: string, value: string | boolean) => {
    setSettings(prev => {
      if (section === 'workingHours') {
        return {
          ...prev,
          workingHours: {
            ...prev.workingHours,
            [field]: value
          }
        };
      } else if (section === 'notifications') {
        return {
          ...prev,
          notifications: {
            ...prev.notifications,
            [field]: value
          }
        };
      } else if (section === 'booking') {
        return {
          ...prev,
          booking: {
            ...prev.booking,
            [field]: value
          }
        };
      }
      return prev;
    });
  };

  const handleDirectChange = (field: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">
            Configurações do Sistema
          </h1>
          <p className="text-slate-400">
            Configure as preferências e parâmetros do sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName" className="text-white">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    value={settings.companyName}
                    onChange={(e) => handleDirectChange("companyName", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyEmail" className="text-white">E-mail</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleDirectChange("companyEmail", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyPhone" className="text-white">Telefone</Label>
                  <Input
                    id="companyPhone"
                    value={settings.companyPhone}
                    onChange={(e) => handleDirectChange("companyPhone", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="companyAddress" className="text-white">Endereço</Label>
                  <Input
                    id="companyAddress"
                    value={settings.companyAddress}
                    onChange={(e) => handleDirectChange("companyAddress", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Horário de Funcionamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startTime" className="text-white">Abertura</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={settings.workingHours.start}
                    onChange={(e) => handleInputChange("workingHours", "start", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="endTime" className="text-white">Fechamento</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={settings.workingHours.end}
                    onChange={(e) => handleInputChange("workingHours", "end", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="lunchTime" className="text-white">Intervalo de Almoço</Label>
                  <Input
                    id="lunchTime"
                    value={settings.workingHours.lunch}
                    onChange={(e) => handleInputChange("workingHours", "lunch", e.target.value)}
                    placeholder="12:00-14:00"
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configurações de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <Label className="text-white">Notificações por E-mail</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) => handleInputChange("notifications", "email", e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-slate-400" />
                    <Label className="text-white">Notificações Push</Label>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) => handleInputChange("notifications", "push", e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agendamentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                Configurações de Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="advanceTime" className="text-white">Antecedência Mínima (minutos)</Label>
                  <Input
                    id="advanceTime"
                    type="number"
                    value={settings.booking.advanceTime}
                    onChange={(e) => handleInputChange("booking", "advanceTime", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="cancelTime" className="text-white">Prazo para Cancelamento (horas)</Label>
                  <Input
                    id="cancelTime"
                    type="number"
                    value={settings.booking.cancelTime}
                    onChange={(e) => handleInputChange("booking", "cancelTime", e.target.value)}
                    className="mt-1 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Label className="text-white">Confirmação Automática</Label>
                <input
                  type="checkbox"
                  checked={settings.booking.autoConfirm}
                  onChange={(e) => handleInputChange("booking", "autoConfirm", e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
