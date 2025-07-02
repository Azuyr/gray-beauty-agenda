import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  todayAppointments: number;
  activeClients: number;
  monthlyRevenue: number;
  occupancyRate: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    todayAppointments: 0,
    activeClients: 0,
    monthlyRevenue: 0,
    occupancyRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) return;
    
    try {
      const today = new Date().toISOString().split('T')[0];
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      // Agendamentos de hoje
      const { data: todayAppointmentsData } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user.id)
        .gte('appointment_date', `${today}T00:00:00`)
        .lt('appointment_date', `${today}T23:59:59`);

      // Clientes ativos
      const { data: clientsData } = await supabase
        .from('clients')
        .select('id')
        .eq('user_id', user.id);

      // Receita do mês
      const { data: monthlyRevenueData } = await supabase
        .from('appointments')
        .select('total_amount')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('appointment_date', `${startOfMonth}T00:00:00`)
        .lte('appointment_date', `${endOfMonth}T23:59:59`);

      const revenue = monthlyRevenueData?.reduce((sum, appointment) => 
        sum + (appointment.total_amount || 0), 0) || 0;

      // Taxa de ocupação (simplificada - baseada em agendamentos confirmados/completados)
      const { data: confirmedAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user.id)
        .in('status', ['confirmed', 'completed'])
        .gte('appointment_date', `${startOfMonth}T00:00:00`)
        .lte('appointment_date', `${endOfMonth}T23:59:59`);

      const { data: totalAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('user_id', user.id)
        .gte('appointment_date', `${startOfMonth}T00:00:00`)
        .lte('appointment_date', `${endOfMonth}T23:59:59`);

      const occupancy = totalAppointments?.length ? 
        Math.round((confirmedAppointments?.length || 0) / totalAppointments.length * 100) : 0;

      setStats({
        todayAppointments: todayAppointmentsData?.length || 0,
        activeClients: clientsData?.length || 0,
        monthlyRevenue: revenue,
        occupancyRate: occupancy
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    refetch: fetchStats
  };
}