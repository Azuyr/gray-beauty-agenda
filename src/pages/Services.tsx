
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Edit, Trash2, Scissors, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useNavigate } from "react-router-dom";
import { useServices } from "@/hooks/useServices";

const Services = () => {
  const { services, loading, addService, updateService, deleteService } = useServices();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    price: ""
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const serviceData = {
      name: formData.name,
      description: formData.description,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price)
    };
    
    if (editingId) {
      await updateService(editingId, serviceData);
      setEditingId(null);
    } else {
      await addService(serviceData);
    }
    
    setFormData({ name: "", description: "", duration: "", price: "" });
    setShowForm(false);
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      description: service.description || "",
      duration: service.duration.toString(),
      price: service.price.toString()
    });
    setEditingId(service.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteService(id);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNewService = () => {
    setFormData({ name: "", description: "", duration: "", price: "" });
    setEditingId(null);
    setShowForm(true);
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Serviços</h1>
              <p className="text-slate-400">Cadastre e gerencie os serviços oferecidos</p>
            </div>
            <Button onClick={handleNewService} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Novo
            </Button>
          </div>
        </div>

        {showForm ? (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <span className="flex items-center">
                  <Scissors className="h-5 w-5 mr-2" />
                  {editingId ? "Editar Serviço" : "Novo Serviço"}
                </span>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </Button>
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

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Atualizar Serviço" : "Salvar Serviço"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                    className="bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : null}

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Scissors className="h-5 w-5 mr-2" />
              Serviços Cadastrados ({services.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-400">Carregando serviços...</span>
              </div>
            ) : services.length > 0 ? (
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
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(service.id)}
                          className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{service.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Duração: {service.duration} min</span>
                      <span className="text-green-400 font-semibold">R$ {service.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scissors className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum serviço cadastrado ainda.</p>
                <Button onClick={handleNewService} className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Serviço
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Services;
