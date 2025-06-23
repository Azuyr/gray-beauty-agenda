
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, MessageCircle, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ExportOptionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  label?: string;
  reportType?: string;
}

const ExportOptions = ({ onExportPDF, onExportExcel, label = "Exportar", reportType = "relatório" }: ExportOptionsProps) => {
  const { toast } = useToast();

  const handleExportPDF = () => {
    try {
      console.log(`Exportando ${reportType} como PDF`);
      
      // Criar um blob com conteúdo PDF simulado
      const pdfContent = `Relatório de ${reportType} - ${new Date().toLocaleDateString('pt-BR')}`;
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onExportPDF();
      
      toast({
        title: "PDF Exportado",
        description: `Relatório de ${reportType} exportado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro na Exportação",
        description: "Falha ao exportar o relatório em PDF.",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    try {
      console.log(`Exportando ${reportType} como Excel`);
      
      // Criar um blob com conteúdo Excel simulado (CSV)
      const csvContent = `Relatório de ${reportType}\nData,Valor\n${new Date().toLocaleDateString('pt-BR')},1000.00`;
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      
      // Criar link para download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onExportExcel();
      
      toast({
        title: "Excel Exportado",
        description: `Relatório de ${reportType} exportado com sucesso!`,
      });
    } catch (error) {
      toast({
        title: "Erro na Exportação",
        description: "Falha ao exportar o relatório em Excel.",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      console.log(`Criando PDF para envio via WhatsApp - ${reportType}`);
      
      // Simular criação de PDF
      const pdfContent = `Relatório de ${reportType} - ${new Date().toLocaleDateString('pt-BR')}`;
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Simular envio via WhatsApp
      const message = `Olá! Segue o relatório de ${reportType} em anexo.`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "WhatsApp Aberto",
        description: `Relatório preparado para envio via WhatsApp.`,
      });
    } catch (error) {
      toast({
        title: "Erro no Envio",
        description: "Falha ao preparar envio via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      console.log(`Criando PDF para envio via E-mail - ${reportType}`);
      
      // Simular criação de PDF
      const subject = `Relatório de ${reportType} - ${new Date().toLocaleDateString('pt-BR')}`;
      const body = `Olá,%0D%0A%0D%0ASegue em anexo o relatório de ${reportType}.%0D%0A%0D%0AAtenciosamente,`;
      
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailtoUrl;
      
      toast({
        title: "E-mail Aberto",
        description: `Relatório preparado para envio via e-mail.`,
      });
    } catch (error) {
      toast({
        title: "Erro no Envio",
        description: "Falha ao preparar envio via e-mail.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
        >
          <Download className="h-4 w-4 mr-2" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-slate-800 border-slate-700">
        <DropdownMenuItem 
          onClick={handleExportPDF}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleExportExcel}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar como Excel
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSendWhatsApp}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Enviar por WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSendEmail}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <Mail className="h-4 w-4 mr-2" />
          Enviar por E-mail
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
