
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet } from "lucide-react";

interface ExportOptionsProps {
  onExportPDF: () => void;
  onExportExcel: () => void;
  label?: string;
}

const ExportOptions = ({ onExportPDF, onExportExcel, label = "Exportar" }: ExportOptionsProps) => {
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
          onClick={onExportPDF}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileText className="h-4 w-4 mr-2" />
          Exportar como PDF
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onExportExcel}
          className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
        >
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Exportar como Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportOptions;
