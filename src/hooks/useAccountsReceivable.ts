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

  const addAccount = async (accountData: Omit<AccountReceivable, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'installments'> & { installments?: number; firstDueDate?: string; daysBetweenInstallments?: number; showToast?: boolean }) => {
    if (!user) return null;

    try {
      const { installments, firstDueDate, daysBetweenInstallments, showToast = true, ...accountDataWithoutInstallments } = accountData;
      
      const { data, error } = await supabase
        .from('accounts_receivable')
        .insert([{
          ...accountDataWithoutInstallments,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;

      // Se especificou mais de 1 parcela, criar parcelas adicionais
      if (installments && installments > 1) {
        const installmentAmount = accountData.total_amount / installments;
        const installmentsToCreate = [];
        const baseDate = firstDueDate ? new Date(firstDueDate) : new Date();
        const intervalDays = daysBetweenInstallments || 30;
        
        // Criar parcelas adicionais (a primeira já foi criada pelo trigger)
        for (let i = 2; i <= installments; i++) {
          const dueDate = new Date(baseDate);
          dueDate.setDate(dueDate.getDate() + (intervalDays * (i - 1)));
          
          installmentsToCreate.push({
            account_id: data.id,
            number: i,
            amount: installmentAmount,
            due_date: dueDate.toISOString().split('T')[0],
            status: 'pendente'
          });
        }
        
        if (installmentsToCreate.length > 0) {
          await supabase.from('installments').insert(installmentsToCreate);
        }
        
        // Atualizar a primeira parcela com o valor correto e data de vencimento
        await supabase
          .from('installments')
          .update({ 
            amount: installmentAmount,
            due_date: firstDueDate || baseDate.toISOString().split('T')[0]
          })
          .eq('account_id', data.id)
          .eq('number', 1);
      } else if (firstDueDate) {
        // Se só tem 1 parcela mas especificou data de vencimento
        await supabase
          .from('installments')
          .update({ due_date: firstDueDate })
          .eq('account_id', data.id)
          .eq('number', 1);
      }

      await fetchAccounts(); // Refetch to get joined data
      
      if (showToast) {
        toast({
          title: "Conta criada!",
          description: `Conta para ${accountData.client_name} foi criada com sucesso.`,
        });
      }
      
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