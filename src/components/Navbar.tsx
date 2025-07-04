
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import SubscriptionPlans from "./SubscriptionPlans";
import NotificationsPanel from "./NotificationsPanel";
import SearchResults from "./SearchResults";
import { useToast } from "@/hooks/use-toast";

const Navbar = () => {
  const [notifications] = useState(3);
  const [showSubscriptionPlans, setShowSubscriptionPlans] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await signOut();
    if (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    } else {
      navigate("/auth");
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowSearchResults(value.length > 2);
  };

  const handleSearchResultsClose = () => {
    setShowSearchResults(false);
    setSearchTerm("");
  };

  return (
    <>
      <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {user && (
              <SidebarTrigger className="text-slate-300 hover:text-white hover:bg-slate-700 p-2 rounded" />
            )}
            
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-600 rounded-lg">
                <div className="h-6 w-6 bg-white rounded-sm"></div>
              </div>
              <span className="font-bold text-xl text-white">BeautyBook</span>
            </div>
          </div>

          {user && (
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-md mx-8 relative">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Buscar clientes, agendamentos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-blue-500 focus:bg-slate-600"
                />
              </div>
              <SearchResults 
                searchTerm={searchTerm}
                isOpen={showSearchResults}
                onClose={handleSearchResultsClose}
              />
            </div>
          )}

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                  onClick={() => setShowSubscriptionPlans(true)}
                >
                  Assinar agora
                </Button>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative text-slate-300 hover:text-white hover:bg-slate-700"
                  onClick={() => setShowNotifications(true)}
                >
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {notifications}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700">
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden md:block">
                        {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-56 bg-slate-800 border-slate-700 text-slate-100"
                  >
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer transition-colors focus:bg-slate-700 focus:text-red-300"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </nav>

      {user && (
        <>
          <SubscriptionPlans 
            open={showSubscriptionPlans} 
            onOpenChange={setShowSubscriptionPlans} 
          />
          
          <NotificationsPanel 
            open={showNotifications} 
            onOpenChange={setShowNotifications} 
          />
        </>
      )}
    </>
  );
};

export default Navbar;
