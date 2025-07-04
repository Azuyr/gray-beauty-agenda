-- Criar função para criar parcelas automaticamente quando uma conta a receber é criada
CREATE OR REPLACE FUNCTION public.create_default_installment()
RETURNS TRIGGER AS $$
BEGIN
  -- Criar uma parcela padrão com valor total e vencimento em 30 dias
  INSERT INTO public.installments (
    account_id,
    number,
    amount,
    due_date,
    status
  ) VALUES (
    NEW.id,
    1,
    NEW.total_amount,
    CURRENT_DATE + INTERVAL '30 days',
    'pendente'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para executar a função após inserir uma conta a receber
CREATE OR REPLACE TRIGGER trigger_create_default_installment
  AFTER INSERT ON public.accounts_receivable
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_installment();