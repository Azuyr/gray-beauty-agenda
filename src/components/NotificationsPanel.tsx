
import { useState } from "react";
import { Check, X, Bell, Clock, User, Calendar } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "user" | "system";
  read: boolean;
  timestamp: string;
}

interface NotificationsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsPanel = ({ open, onOpenChange }: NotificationsPanelProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Novo agendamento",
      message: "Maria Silva agendou um corte de cabelo para amanhã às 14h",
      type: "appointment",
      read: false,
      timestamp: "2 min atrás",
    },
    {
      id: "2",
      title: "Cancelamento",
      message: "João Santos cancelou o agendamento de hoje às 16h",
      type: "appointment",
      read: false,
      timestamp: "15 min atrás",
    },
    {
      id: "3",
      title: "Novo cliente",
      message: "Ana Oliveira se cadastrou na plataforma",
      type: "user",
      read: true,
      timestamp: "1 hora atrás",
    },
    {
      id: "4",
      title: "Atualização do sistema",
      message: "Nova versão disponível com melhorias de performance",
      type: "system",
      read: true,
      timestamp: "2 horas atrás",
    },
  ]);

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      case "system":
        return <Bell className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIconColor = (type: Notification["type"]) => {
    switch (type) {
      case "appointment":
        return "text-blue-500";
      case "user":
        return "text-green-500";
      case "system":
        return "text-orange-500";
      default:
        return "text-slate-500";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-slate-800 border-slate-700 text-slate-100">
        <SheetHeader>
          <SheetTitle className="text-white flex items-center justify-between">
            <span>Notificações</span>
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-slate-300">
            Acompanhe suas notificações e atualizações
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          {unreadCount > 0 && (
            <div className="mb-4">
              <Button
                onClick={markAllAsRead}
                variant="outline"
                size="sm"
                className="text-blue-300 border-slate-600 hover:bg-slate-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Marcar todas como lida
              </Button>
            </div>
          )}

          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id}>
                <div
                  className={`p-4 rounded-lg border transition-colors ${
                    notification.read
                      ? "border-slate-700 bg-slate-750"
                      : "border-blue-500 bg-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      
                      <p className="text-sm text-slate-300 mb-2">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {notification.timestamp}
                        </div>
                        
                        {!notification.read && (
                          <Button
                            onClick={() => markAsRead(notification.id)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-300 hover:text-blue-200 h-auto p-1"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Marcar como lida
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-slate-700" />
              </div>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma notificação encontrada</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsPanel;
