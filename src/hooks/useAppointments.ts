import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Appointment {
  id: string;
  user_id: string;
  client_id: string;
  service_id?: string;
  title: string;
  description?: string;
  appointment_date: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  total_amount?: number;
  created_at: string;
  updated_at: string;
  clients?: {
    name: string;
  };
  services?: {
    name: string;
    price: number;
  };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAppointments = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          clients(name),
          services(name, price)
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar agendamentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const addAppointment = async (appointmentData: Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([{
          ...appointmentData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAppointments(); // Refetch to get joined data
      toast({
        title: "Agendamento criado!",
        description: `Agendamento para ${appointmentData.title} foi criado com sucesso.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar agendamento",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAppointment = async (id: string, appointmentData: Partial<Appointment>) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update(appointmentData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      await fetchAppointments(); // Refetch to get joined data
      toast({
        title: "Agendamento atualizado!",
        description: "As informações foram atualizadas com sucesso.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar agendamento",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
      toast({
        title: "Agendamento removido!",
        description: "O agendamento foi removido com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover agendamento",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    refetch: fetchAppointments
  };
}