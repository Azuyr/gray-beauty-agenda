import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Installment {
  id: string;
  account_id: string;
  number: number;
  amount: number;
  due_date: string;
  payment_date?: string;
  status: 'pendente' | 'pago' | 'vencido';
  created_at: string;
  updated_at: string;
}

export interface AccountReceivable {
  id: string;
  user_id: string;
  client_id: string;
  client_name: string;
  title: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  installments?: Installment[];
}

export function useAccountsReceivable() {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAccounts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('accounts_receivable')
        .select(`
          *,
          installments(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAccounts(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar contas a receber",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [user]);

  const addAccount = async (accountData: Omit<AccountReceivable, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('accounts_receivable')
        .insert([{
          ...accountData,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchAccounts(); // Refetch to get joined data
      toast({
        title: "Conta criada!",
        description: `Conta para ${accountData.client_name} foi criada com sucesso.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao criar conta",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateAccount = async (id: string, accountData: Partial<AccountReceivable>) => {
    try {
      const { data, error } = await supabase
        .from('accounts_receivable')
        .update(accountData)
        .eq('id', id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      await fetchAccounts(); // Refetch to get joined data
      toast({
        title: "Conta atualizada!",
        description: "As informações foram atualizadas com sucesso.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar conta",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteAccount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('accounts_receivable')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setAccounts(prev => prev.filter(account => account.id !== id));
      toast({
        title: "Conta removida!",
        description: "A conta foi removida com sucesso.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao remover conta",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const markInstallmentAsPaid = async (installmentId: string) => {
    try {
      const { error } = await supabase
        .from('installments')
        .update({
          status: 'pago',
          payment_date: new Date().toISOString().split('T')[0]
        })
        .eq('id', installmentId);

      if (error) throw error;

      await fetchAccounts(); // Refetch to get updated data
      toast({
        title: "Parcela paga!",
        description: "A parcela foi marcada como paga.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Erro ao marcar parcela como paga",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    accounts,
    loading,
    addAccount,
    updateAccount,
    deleteAccount,
    markInstallmentAsPaid,
    refetch: fetchAccounts
  };
}