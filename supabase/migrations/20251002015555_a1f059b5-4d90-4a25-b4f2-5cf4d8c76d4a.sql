-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'profissional', 'cliente');

-- Criar tabela user_roles
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Super admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'super_admin'));

-- Migrate existing data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 
  CASE 
    WHEN tipo = 'super_admin' THEN 'super_admin'::app_role
    WHEN tipo = 'admin' THEN 'admin'::app_role
    WHEN tipo = 'profissional' THEN 'profissional'::app_role
    ELSE 'cliente'::app_role
  END
FROM public.profiles
ON CONFLICT (user_id, role) DO NOTHING;

-- Update profiles trigger to also create role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Determine role from metadata or default to cliente
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'tipo')::app_role,
    'cliente'::app_role
  );

  -- Insert into profiles
  INSERT INTO public.profiles (user_id, nome, tipo)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.email), 
    user_role::user_type
  );

  -- Insert into user_roles
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create super admin user manually (run this after migration)
-- The user needs to sign up first with email knvduarte@gmail.com
-- Then run: INSERT INTO public.user_roles (user_id, role) 
-- SELECT id, 'super_admin'::app_role FROM auth.users WHERE email = 'knvduarte@gmail.com'
-- ON CONFLICT DO NOTHING;