
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ContactButtonsProps {
  clientName: string;
  service: string;
  date: Date;
  time: string;
}

const ContactButtons = ({ clientName, service, date, time }: ContactButtonsProps) => {
  const sendEmail = () => {
    const subject = encodeURIComponent("Confirmação de Agendamento - BeautyBook");
    const body = encodeURIComponent(`Olá ${clientName},\n\nSeu agendamento foi confirmado:\n\nServiço: ${service}\nData: ${format(date, "dd/MM/yyyy", { locale: ptBR })}\nHorário: ${time}\n\nObrigado por escolher nossos serviços!`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(`Olá ${clientName}! Seu agendamento foi confirmado:\n\nServiço: ${service}\nData: ${format(date, "dd/MM/yyyy", { locale: ptBR })}\nHorário: ${time}\n\nObrigado por escolher nossos serviços!`);
    window.open(`https://wa.me/?text=${message}`);
  };

  return (
    <div className="flex space-x-2">
      <Button 
        type="button" 
        variant="outline" 
        onClick={sendEmail}
        className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
      >
        <Mail className="h-4 w-4 mr-2" />
        Enviar por E-mail
      </Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={sendWhatsApp}
        className="flex-1 bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        Enviar WhatsApp
      </Button>
    </div>
  );
};

export default ContactButtons;
