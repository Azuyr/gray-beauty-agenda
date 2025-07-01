import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Service {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchServices = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [user]);

  const addService = async (serviceData: Omit<Service, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'active'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('services')
        .insert([{
          ...serviceData,
          user_id: user.id,
          active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [data, ...prev]);
      toast({
        title: "Serviço cadastrado!",
        description: `${serviceData.name} foi adicionado com sucesso.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar serviço",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      const { data, error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setServices(prev => prev.map(service => 
        service.id === id ? data : service
      ));
      
      toast({
        title: "Serviço atualizado!",
        description: "As informações foram atualizadas com sucesso.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar serviço",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteService = async (id: string) => {
    try {
      // Soft delete - marca como inativo
      const { error } = await supabase
        .from('services')
        .update({ active: false })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setServices(prev => prev.filter(service => service.id !== id));
      toast({
        title: "Serviço removido!",
        description: "O serviço foi removido com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover serviço",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    services,
    loading,
    addService,
    updateService,
    deleteService,
    refetch: fetchServices
  };
}