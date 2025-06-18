
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Plus, Edit, Trash2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number;
  name: string;
  description: string;
  brand: string;
  price: string;
  stock: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: "Shampoo Anticaspa", description: "Shampoo para cabelos oleosos", brand: "Seda", price: "15.90", stock: "25" },
    { id: 2, name: "Condicionador Hidratante", description: "Condicionador nutritivo", brand: "Pantene", price: "18.50", stock: "30" },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "",
    price: "",
    stock: ""
  });
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      setProducts(prev => prev.map(product => 
        product.id === editingId 
          ? { ...product, ...formData }
          : product
      ));
      toast({
        title: "Produto atualizado!",
        description: `${formData.name} foi atualizado com sucesso.`,
      });
      setEditingId(null);
    } else {
      const newProduct = {
        id: Date.now(),
        ...formData
      };
      setProducts(prev => [...prev, newProduct]);
      toast({
        title: "Produto cadastrado!",
        description: `${formData.name} foi adicionado com sucesso.`,
      });
    }
    
    setFormData({ name: "", description: "", brand: "", price: "", stock: "" });
    setShowForm(false);
  };

  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      brand: product.brand,
      price: product.price,
      stock: product.stock
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(product => product.id !== id));
    toast({
      title: "Produto removido!",
      description: "O produto foi removido com sucesso.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleNewProduct = () => {
    setFormData({ name: "", description: "", brand: "", price: "", stock: "" });
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
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Produtos</h1>
              <p className="text-slate-400">Cadastre e gerencie os produtos disponíveis</p>
            </div>
            <Button onClick={handleNewProduct} className="bg-blue-600 hover:bg-blue-700">
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
                  <Package className="h-5 w-5 mr-2" />
                  {editingId ? "Editar Produto" : "Novo Produto"}
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
                  <Label htmlFor="name" className="text-slate-300">Nome do Produto</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Ex: Shampoo Anticaspa"
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
                    placeholder="Descrição do produto"
                  />
                </div>

                <div>
                  <Label htmlFor="brand" className="text-slate-300">Marca</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className="mt-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    placeholder="Ex: Seda, Pantene"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="15.90"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock" className="text-slate-300">Estoque</Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      className="mt-1 bg-slate-700 border-slate-600 text-white"
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? "Atualizar Produto" : "Salvar Produto"}
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
              <Package className="h-5 w-5 mr-2" />
              Produtos Cadastrados ({products.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {products.length > 0 ? (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="p-4 bg-slate-700 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{product.name}</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="bg-slate-600 border-slate-500 text-slate-300 hover:bg-slate-500"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{product.description}</p>
                    <p className="text-slate-300 text-sm mb-2">Marca: {product.brand}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Estoque: {product.stock} un</span>
                      <span className="text-green-400 font-semibold">R$ {product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400">Nenhum produto cadastrado ainda.</p>
                <Button onClick={handleNewProduct} className="mt-4 bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Primeiro Produto
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Products;
