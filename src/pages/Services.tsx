
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Edit, Trash2, Scissors } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Service {
  id: number;
  name: string;
  description: string;
  duration: string;
  price: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: "Corte Masculino", description: "Corte tradicional", duration: "30", price: "25.00" },
    { id: 2, name: "Corte + Barba", description: "Corte completo com barba", duration: "45", price: "35.00" },
  ]);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: ""
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setServices(prev => prev.map(service => 
        service.id === editingId 
          ? { ...service, ...formData }
          : service
      ));
      toast({
        title: "Serviço atualizado!",
        description: `${formData.name} foi atualizado com sucesso.`,
      });
      setEditingId(null);
    } else {
      const newService = {
        id: Date.now(),
        ...formData
      };
      setServices(prev => [...prev, newService]);
      toast({
        title: "Serviço cadastrado!",
        description: `${formData.name} foi adicionado com sucesso.`,
      });
    }
    
    setFormData({ name: "", description: "", duration: "", price: "" });
  };

  const handleEdit = (service: Service) => {
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price
    });
    setEditingId(service.id);
  };

  const handleDelete = (id: number) => {
    setServices(prev => prev.filter(service => service.id !== id));
    toast({
      title: "Serviço removido!",
      description: "O serviço foi removido com sucesso.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
            className="mb-4 bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Serviços</h1>
          <p className="text-slate-400">Cadastre e gerencie os serviços oferecidos</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Plus className="h-5 w-5 mr-2" />
                {editingId ? "Editar Serviço" : "Novo Serviço"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Nome do Serviço</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Ex: Corte Masculino"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-slate-300">Descrição</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Descrição do serviço"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration" className="text-slate-300">Duração (min)</Label>
                    <Input
                      id="duration"
                      name="duration"
                      type="number"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      placeholder="30"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price" className="text-slate-300">Preço (R$)</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      placeholder="25.00"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? "Atualizar Serviço" : "Salvar Serviço"}
                </Button>
                
                {editingId && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setEditingId(null);
                      setFormData({ name: "", description: "", duration: "", price: "" });
                    }}
                    className="w-full bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Cancelar
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Scissors className="h-5 w-5 mr-2" />
                Serviços Cadastrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{service.name}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(service)}
                          className="bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{service.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Duração: {service.duration} min</span>
                      <span className="text-green-400 font-semibold">R$ {service.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Services;
