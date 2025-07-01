
-- Criar tabela de clientes
CREATE TABLE public.clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de serviços
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- duração em minutos
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar enum para status de agendamentos
CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled');

-- Criar tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  service_id UUID REFERENCES public.services(id),
  title TEXT NOT NULL,
  description TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- duração em minutos
  status appointment_status DEFAULT 'scheduled',
  total_amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar enum para status de parcelas
CREATE TYPE installment_status AS ENUM ('pendente', 'pago', 'vencido');

-- Criar tabela de contas a receber
CREATE TABLE public.accounts_receivable (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  client_id UUID REFERENCES public.clients(id) NOT NULL,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de parcelas
CREATE TABLE public.installments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID REFERENCES public.accounts_receivable(id) ON DELETE CASCADE NOT NULL,
  number INTEGER NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status installment_status DEFAULT 'pendente',
  payment_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Criar tabela de itens de agendamento (para produtos usados no serviço)
CREATE TABLE public.appointment_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts_receivable ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.installments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointment_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para clientes
CREATE POLICY "Users can view their own clients" ON public.clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON public.clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" ON public.clients
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" ON public.clients
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para serviços
CREATE POLICY "Users can view their own services" ON public.services
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own services" ON public.services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own services" ON public.services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own services" ON public.services
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para produtos
CREATE POLICY "Users can view their own products" ON public.products
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" ON public.products
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" ON public.products
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para agendamentos
CREATE POLICY "Users can view their own appointments" ON public.appointments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointments" ON public.appointments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointments" ON public.appointments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointments" ON public.appointments
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para contas a receber
CREATE POLICY "Users can view their own accounts" ON public.accounts_receivable
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own accounts" ON public.accounts_receivable
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own accounts" ON public.accounts_receivable
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own accounts" ON public.accounts_receivable
  FOR DELETE USING (auth.uid() = user_id);

-- Políticas RLS para parcelas (baseadas no user_id da conta)
CREATE POLICY "Users can view installments of their accounts" ON public.installments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.accounts_receivable 
      WHERE id = account_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert installments for their accounts" ON public.installments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.accounts_receivable 
      WHERE id = account_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update installments of their accounts" ON public.installments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.accounts_receivable 
      WHERE id = account_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete installments of their accounts" ON public.installments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.accounts_receivable 
      WHERE id = account_id AND user_id = auth.uid()
    )
  );

-- Políticas RLS para itens de agendamento (baseadas no user_id do agendamento)
CREATE POLICY "Users can view items of their appointments" ON public.appointment_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE id = appointment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert items for their appointments" ON public.appointment_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE id = appointment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update items of their appointments" ON public.appointment_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE id = appointment_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete items of their appointments" ON public.appointment_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.appointments 
      WHERE id = appointment_id AND user_id = auth.uid()
    )
  );

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER handle_updated_at_clients BEFORE UPDATE ON public.clients
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_services BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_products BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_appointments BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_accounts BEFORE UPDATE ON public.accounts_receivable
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at_installments BEFORE UPDATE ON public.installments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Índices para melhor performance
CREATE INDEX idx_clients_user_id ON public.clients(user_id);
CREATE INDEX idx_services_user_id ON public.services(user_id);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX idx_appointments_client_id ON public.appointments(client_id);
CREATE INDEX idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX idx_accounts_user_id ON public.accounts_receivable(user_id);
CREATE INDEX idx_accounts_client_id ON public.accounts_receivable(client_id);
CREATE INDEX idx_installments_account_id ON public.installments(account_id);
CREATE INDEX idx_installments_due_date ON public.installments(due_date);
CREATE INDEX idx_appointment_items_appointment_id ON public.appointment_items(appointment_id);
