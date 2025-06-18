
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User, Mail, Phone, Shield, Edit, Trash2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  active: boolean;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([
    { id: 1, name: "Admin", email: "admin@beautybook.com", phone: "(11) 99999-9999", role: "Administrador", active: true },
    { id: 2, name: "Maria Silva", email: "maria@beautybook.com", phone: "(11) 98888-8888", role: "Atendente", active: true },
  ]);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Atendente",
    password: ""
  });
  
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Editar usuário existente
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id 
          ? { ...user, name: formData.name, email: formData.email, phone: formData.phone, role: formData.role }
          : user
      ));
      toast({
        title: "Usuário atualizado com sucesso!",
        description: `${formData.name} foi atualizado no sistema.`,
      });
    } else {
      // Criar novo usuário
      const newUser: UserData = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        active: true
      };
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "Usuário criado com sucesso!",
        description: `${formData.name} foi adicionado ao sistema.`,
      });
    }
    
    setFormData({ name: "", email: "", phone: "", role: "Atendente", password: "" });
    setEditingUser(null);
    setIsDialogOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: ""
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (userId: number) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "Usuário removido",
      description: "O usuário foi removido do sistema.",
    });
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "", role: "Atendente", password: "" });
    setIsDialogOpen(true);
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
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Gerenciamento de Usuários
              </h1>
              <p className="text-slate-400">
                Gerencie os usuários que têm acesso ao sistema
              </p>
            </div>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleNewUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    {editingUser ? "Editar Usuário" : "Novo Usuário"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="name" className="text-white">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-white">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="(11) 99999-9999"
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="role" className="text-white">Função</Label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full mt-1 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                    >
                      <option value="Atendente">Atendente</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Gerente">Gerente</option>
                    </select>
                  </div>

                  {!editingUser && (
                    <div>
                      <Label htmlFor="password" className="text-white">Senha</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required={!editingUser}
                        className="mt-1 bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  )}

                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {editingUser ? "Atualizar Usuário" : "Criar Usuário"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Usuários do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border border-slate-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-blue-900 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-400" />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white">{user.name}</h4>
                      <p className="text-sm text-slate-400">{user.role}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center text-xs text-slate-500">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-xs text-slate-500">
                          <Phone className="h-3 w-3 mr-1" />
                          {user.phone}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(user)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(user.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserManagement;
