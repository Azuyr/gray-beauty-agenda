
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

  const generatePDFContent = () => {
    // Criar conteúdo PDF básico usando formato PDF simples
    const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 73
>>
stream
BT
/F1 12 Tf
72 720 Td
(Relatório de ${reportType} - ${new Date().toLocaleDateString('pt-BR')}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000109 00000 n 
0000000158 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
259
%%EOF`;
    return pdfHeader;
  };

  const generateExcelContent = () => {
    // Criar conteúdo CSV válido para Excel
    const csvContent = `"Relatório de ${reportType}","Data: ${new Date().toLocaleDateString('pt-BR')}"\n` +
                      `"Item","Valor","Data","Status"\n` +
                      `"Exemplo 1","R$ 100,00","${new Date().toLocaleDateString('pt-BR')}","Ativo"\n` +
                      `"Exemplo 2","R$ 250,00","${new Date().toLocaleDateString('pt-BR')}","Pendente"\n` +
                      `"Total","R$ 350,00","",""\n`;
    return csvContent;
  };

  const handleExportPDF = () => {
    try {
      console.log(`Exportando ${reportType} como PDF`);
      
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
      
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
      console.error('Erro ao exportar PDF:', error);
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
      
      const csvContent = generateExcelContent();
      const BOM = '\uFEFF'; // Byte Order Mark para UTF-8
      const blob = new Blob([BOM + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.csv`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      onExportExcel();
      
      toast({
        title: "Excel Exportado",
        description: `Relatório de ${reportType} exportado como CSV com sucesso!`,
      });
    } catch (error) {
      console.error('Erro ao exportar Excel:', error);
      toast({
        title: "Erro na Exportação",
        description: "Falha ao exportar o relatório em Excel.",
        variant: "destructive",
      });
    }
  };

  const handleSendWhatsApp = async () => {
    try {
      console.log(`Preparando envio via WhatsApp - ${reportType}`);
      
      // Criar PDF para envio
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Criar arquivo temporário para download antes do envio
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Abrir WhatsApp com mensagem
      setTimeout(() => {
        const message = `Olá! Segue o relatório de ${reportType} em anexo. O arquivo foi baixado automaticamente para facilitar o envio.`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }, 500);
      
      toast({
        title: "WhatsApp Preparado",
        description: `Arquivo baixado. WhatsApp será aberto para envio.`,
      });
    } catch (error) {
      console.error('Erro ao preparar envio WhatsApp:', error);
      toast({
        title: "Erro no Envio",
        description: "Falha ao preparar envio via WhatsApp.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    try {
      console.log(`Preparando envio via E-mail - ${reportType}`);
      
      // Criar PDF para envio
      const pdfContent = generatePDFContent();
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      
      // Criar arquivo temporário para download antes do envio
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Abrir cliente de email
      setTimeout(() => {
        const subject = `Relatório de ${reportType} - ${new Date().toLocaleDateString('pt-BR')}`;
        const body = `Olá,%0D%0A%0D%0ASegue em anexo o relatório de ${reportType}. O arquivo foi baixado automaticamente para facilitar o envio.%0D%0A%0D%0AAtenciosamente,`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${body}`;
        window.location.href = mailtoUrl;
      }, 500);
      
      toast({
        title: "E-mail Preparado",
        description: `Arquivo baixado. Cliente de e-mail será aberto.`,
      });
    } catch (error) {
      console.error('Erro ao preparar envio email:', error);
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
