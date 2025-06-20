
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Service {
  value: string;
  label: string;
  price: number;
}

interface Product {
  value: string;
  label: string;
  price: number;
}

interface ContactButtonsProps {
  clientName: string;
  services: Service[];
  products: Product[];
  date: Date;
  time: string;
  servicesTotal: number;
  productsTotal: number;
  discountAmount: number;
  totalAmount: number;
}

const ContactButtons = ({ 
  clientName, 
  services, 
  products, 
  date, 
  time,
  servicesTotal,
  productsTotal,
  discountAmount,
  totalAmount
}: ContactButtonsProps) => {
  
  const formatMessage = () => {
    let message = `Olá ${clientName}!\n\nSeu agendamento foi confirmado:\n\n`;
    message += `📅 Data: ${format(date, "dd/MM/yyyy", { locale: ptBR })}\n`;
    message += `🕐 Horário: ${time}\n\n`;
    
    if (services.length > 0) {
      message += `💇 SERVIÇOS:\n`;
      services.forEach(service => {
        message += `• ${service.label} - R$ ${service.price.toFixed(2)}\n`;
      });
      message += `Subtotal Serviços: R$ ${servicesTotal.toFixed(2)}\n\n`;
    }
    
    if (products.length > 0) {
      message += `🛍️ PRODUTOS:\n`;
      products.forEach(product => {
        message += `• ${product.label} - R$ ${product.price.toFixed(2)}\n`;
      });
      message += `Subtotal Produtos: R$ ${productsTotal.toFixed(2)}\n\n`;
    }
    
    message += `💰 RESUMO FINANCEIRO:\n`;
    message += `Subtotal: R$ ${(servicesTotal + productsTotal).toFixed(2)}\n`;
    
    if (discountAmount > 0) {
      message += `Desconto: -R$ ${discountAmount.toFixed(2)}\n`;
    }
    
    message += `💸 TOTAL: R$ ${totalAmount.toFixed(2)}\n\n`;
    message += `Obrigado por escolher nossos serviços! ✨`;
    
    return message;
  };

  const sendEmail = () => {
    const subject = encodeURIComponent("Confirmação de Agendamento - BeautyBook");
    const body = encodeURIComponent(formatMessage());
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(formatMessage());
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
