-- Criar enum para tipos de usuário
CREATE TYPE user_type AS ENUM ('cliente', 'profissional', 'admin', 'super_admin');

-- Criar enum para status de agendamento
CREATE TYPE booking_status AS ENUM ('agendado', 'confirmado', 'cancelado', 'concluido', 'falta');

-- Criar enum para status de assinatura
CREATE TYPE subscription_status AS ENUM ('ativo', 'cancelado', 'pausado', 'vencido');

-- Criar enum para tipo de plano
CREATE TYPE plan_type AS ENUM ('basico', 'avancado', 'premium');

-- Criar enum para tipo de cupom
CREATE TYPE coupon_type AS ENUM ('percentual', 'valor_fixo');

-- Tabela de perfis de usuários (conecta com auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  tipo user_type DEFAULT 'cliente',
  salao_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de salões
CREATE TABLE public.saloes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  endereco TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  link_personalizado TEXT UNIQUE,
  logo_url TEXT,
  tema_cores JSONB DEFAULT '{"primary": "#0A0A0A", "secondary": "#E8DCCA", "accent": "#D77A61"}',
  horario_funcionamento JSONB DEFAULT '{"seg": "09:00-18:00", "ter": "09:00-18:00", "qua": "09:00-18:00", "qui": "09:00-18:00", "sex": "09:00-18:00", "sab": "09:00-15:00", "dom": "fechado"}',
  politica_cancelamento TEXT DEFAULT '24 horas de antecedência',
  mensagens_whatsapp JSONB DEFAULT '{"confirmacao": "Olá [nome_cliente]! Seu agendamento para [servico] com [profissional] está confirmado para [data] às [hora] no [nome_salao]. Obrigado!", "lembrete": "Lembrete: Você tem um agendamento amanhã para [servico] com [profissional] às [hora] no [nome_salao]. Te esperamos!"}',
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de profissionais
CREATE TABLE public.profissionais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidades TEXT[] DEFAULT '{}',
  foto_url TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE public.servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  profissional_id UUID REFERENCES public.profissionais(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_minutos INTEGER NOT NULL DEFAULT 60,
  preco DECIMAL(10,2) NOT NULL,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  data_nascimento DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos(id) ON DELETE CASCADE,
  profissional_id UUID NOT NULL REFERENCES public.profissionais(id) ON DELETE CASCADE,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  data_agendamento DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  status booking_status DEFAULT 'agendado',
  observacoes TEXT,
  valor_pago DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de assinaturas (para o SaaS)
CREATE TABLE public.assinaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  plano plan_type NOT NULL DEFAULT 'basico',
  status subscription_status DEFAULT 'ativo',
  valor_mensal DECIMAL(10,2) NOT NULL,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_fim DATE,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de cupons de desconto
CREATE TABLE public.cupons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salao_id UUID REFERENCES public.saloes(id) ON DELETE CASCADE,
  codigo TEXT NOT NULL,
  tipo coupon_type NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  validade DATE,
  limite_uso INTEGER,
  usado_vezes INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  global BOOLEAN DEFAULT false, -- Para cupons criados pelo super admin
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações globais do SaaS
CREATE TABLE public.configuracoes_globais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preco_basico DECIMAL(10,2) DEFAULT 29.00,
  preco_avancado DECIMAL(10,2) DEFAULT 59.00,
  preco_premium DECIMAL(10,2) DEFAULT 99.00,
  texto_landing TEXT DEFAULT 'Agendamentos inteligentes para salões sofisticados',
  whatsapp_suporte TEXT DEFAULT '(11) 91234-5678',
  email_suporte TEXT DEFAULT 'suporte@studiogloss.com',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Inserir configuração padrão
INSERT INTO public.configuracoes_globais (id) VALUES (gen_random_uuid());

-- Tabela de mensagens de suporte
CREATE TABLE public.mensagens_suporte (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  salao_id UUID NOT NULL REFERENCES public.saloes(id) ON DELETE CASCADE,
  mensagem TEXT NOT NULL,
  resposta TEXT,
  respondido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saloes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profissionais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes_globais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mensagens_suporte ENABLE ROW LEVEL SECURITY;

-- Criar função para verificar tipo de usuário
CREATE OR REPLACE FUNCTION public.get_user_type(user_uuid UUID)
RETURNS user_type AS $$
BEGIN
  RETURN (SELECT tipo FROM public.profiles WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Criar função para verificar se usuário é super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT tipo FROM public.profiles WHERE user_id = user_uuid) = 'super_admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Criar função para verificar se usuário pertence ao salão
CREATE OR REPLACE FUNCTION public.user_belongs_to_salao(user_uuid UUID, salao_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = user_uuid 
    AND (p.salao_id = salao_uuid OR p.tipo = 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Políticas RLS para profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.is_super_admin(auth.uid()));

-- Políticas RLS para salões
CREATE POLICY "Super admins can manage all saloes" ON public.saloes
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Salao admins can view own salao" ON public.saloes
  FOR SELECT USING (
    admin_id = auth.uid() OR 
    public.user_belongs_to_salao(auth.uid(), id)
  );

CREATE POLICY "Salao admins can update own salao" ON public.saloes
  FOR UPDATE USING (admin_id = auth.uid());

-- Políticas RLS para profissionais
CREATE POLICY "Profissionais can view own data" ON public.profissionais
  FOR SELECT USING (
    user_id = auth.uid() OR 
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

CREATE POLICY "Salao admins can manage profissionais" ON public.profissionais
  FOR ALL USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

-- Políticas RLS para serviços
CREATE POLICY "Anyone can view active services" ON public.servicos
  FOR SELECT USING (ativo = true);

CREATE POLICY "Salao members can manage services" ON public.servicos
  FOR ALL USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

-- Políticas RLS para clientes
CREATE POLICY "Salao members can view clients" ON public.clientes
  FOR SELECT USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    user_id = auth.uid() OR
    public.is_super_admin(auth.uid())
  );

CREATE POLICY "Salao members can manage clients" ON public.clientes
  FOR ALL USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

-- Políticas RLS para agendamentos
CREATE POLICY "Users can view related bookings" ON public.agendamentos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = cliente_id AND c.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profissionais p WHERE p.id = profissional_id AND p.user_id = auth.uid()) OR
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

CREATE POLICY "Salao members can manage bookings" ON public.agendamentos
  FOR ALL USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

-- Políticas RLS para assinaturas
CREATE POLICY "Super admins can manage all subscriptions" ON public.assinaturas
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Salao admins can view own subscription" ON public.assinaturas
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.saloes s WHERE s.id = salao_id AND s.admin_id = auth.uid())
  );

-- Políticas RLS para cupons
CREATE POLICY "Anyone can view active coupons" ON public.cupons
  FOR SELECT USING (ativo = true);

CREATE POLICY "Salao admins can manage own coupons" ON public.cupons
  FOR ALL USING (
    public.user_belongs_to_salao(auth.uid(), salao_id) OR
    public.is_super_admin(auth.uid())
  );

-- Políticas RLS para configurações globais
CREATE POLICY "Super admins can manage global config" ON public.configuracoes_globais
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Anyone can read global config" ON public.configuracoes_globais
  FOR SELECT USING (true);

-- Políticas RLS para mensagens de suporte
CREATE POLICY "Super admins can manage all support messages" ON public.mensagens_suporte
  FOR ALL USING (public.is_super_admin(auth.uid()));

CREATE POLICY "Salao admins can manage own messages" ON public.mensagens_suporte
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.saloes s WHERE s.id = salao_id AND s.admin_id = auth.uid())
  );

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, tipo)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), 
    COALESCE((NEW.raw_user_meta_data->>'tipo')::user_type, 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função para atualizar timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_saloes_updated_at BEFORE UPDATE ON public.saloes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profissionais_updated_at BEFORE UPDATE ON public.profissionais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON public.servicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_assinaturas_updated_at BEFORE UPDATE ON public.assinaturas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cupons_updated_at BEFORE UPDATE ON public.cupons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_configuracoes_globais_updated_at BEFORE UPDATE ON public.configuracoes_globais FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mensagens_suporte_updated_at BEFORE UPDATE ON public.mensagens_suporte FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados de exemplo
-- Criar super admin
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_user_meta_data) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@studiogloss.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  '{"nome": "Super Admin", "tipo": "super_admin"}'
);

-- Criar salão exemplo
INSERT INTO public.saloes (
  id,
  nome,
  endereco,
  telefone,
  whatsapp,
  email,
  link_personalizado,
  admin_id
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Studio Gloss Premium',
  'Rua das Flores, 123 - São Paulo/SP',
  '(11) 3333-4444',
  '5511912345678',
  'contato@studiogloss.com',
  'studio-premium',
  '00000000-0000-0000-0000-000000000001'
);

-- Criar serviços exemplo
INSERT INTO public.servicos (salao_id, nome, descricao, duracao_minutos, preco) VALUES
('11111111-1111-1111-1111-111111111111', 'Alongamento de Cílios', 'Técnica volume russo com fios de seda', 120, 150.00),
('11111111-1111-1111-1111-111111111111', 'Manicure Gel', 'Esmaltação em gel com design personalizado', 60, 70.00),
('11111111-1111-1111-1111-111111111111', 'Design de Sobrancelha', 'Modelagem e design com henna', 40, 50.00),
('11111111-1111-1111-1111-111111111111', 'Manutenção de Cílios', 'Retoque e manutenção do alongamento', 60, 80.00);

-- Criar cupom exemplo
INSERT INTO public.cupons (salao_id, codigo, tipo, valor, validade, limite_uso) VALUES
('11111111-1111-1111-1111-111111111111', 'BEMVINDA10', 'percentual', 10.00, CURRENT_DATE + INTERVAL '30 days', 100);

-- Criar assinatura exemplo
INSERT INTO public.assinaturas (salao_id, plano, valor_mensal) VALUES
('11111111-1111-1111-1111-111111111111', 'premium', 99.00);