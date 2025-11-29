-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create events table
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  event_name text NOT NULL,
  event_type text NOT NULL,
  event_date date NOT NULL,
  budget_total numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Users can view their own events" 
ON public.events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create expenses table
CREATE TABLE public.expenses (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events ON DELETE CASCADE,
  category text NOT NULL,
  title text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for expenses
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for expenses (based on event ownership)
CREATE POLICY "Users can view expenses for their events" 
ON public.expenses 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = expenses.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create expenses for their events" 
ON public.expenses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = expenses.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update expenses for their events" 
ON public.expenses 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = expenses.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete expenses for their events" 
ON public.expenses 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = expenses.event_id 
    AND events.user_id = auth.uid()
  )
);

-- Create gifts_to_give table
CREATE TABLE public.gifts_to_give (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events ON DELETE CASCADE,
  recipient_name text NOT NULL,
  budget numeric NOT NULL DEFAULT 0,
  gift_item text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for gifts_to_give
ALTER TABLE public.gifts_to_give ENABLE ROW LEVEL SECURITY;

-- Create policies for gifts_to_give
CREATE POLICY "Users can view gifts_to_give for their events" 
ON public.gifts_to_give 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_to_give.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create gifts_to_give for their events" 
ON public.gifts_to_give 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_to_give.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update gifts_to_give for their events" 
ON public.gifts_to_give 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_to_give.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete gifts_to_give for their events" 
ON public.gifts_to_give 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_to_give.event_id 
    AND events.user_id = auth.uid()
  )
);

-- Create gifts_received table
CREATE TABLE public.gifts_received (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events ON DELETE CASCADE,
  giver_name text NOT NULL,
  gift_item text NOT NULL,
  gift_value numeric NOT NULL DEFAULT 0,
  return_status text NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for gifts_received
ALTER TABLE public.gifts_received ENABLE ROW LEVEL SECURITY;

-- Create policies for gifts_received
CREATE POLICY "Users can view gifts_received for their events" 
ON public.gifts_received 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_received.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create gifts_received for their events" 
ON public.gifts_received 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_received.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update gifts_received for their events" 
ON public.gifts_received 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_received.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete gifts_received for their events" 
ON public.gifts_received 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = gifts_received.event_id 
    AND events.user_id = auth.uid()
  )
);

-- Create checklist_items table
CREATE TABLE public.checklist_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL REFERENCES public.events ON DELETE CASCADE,
  title text NOT NULL,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for checklist_items
ALTER TABLE public.checklist_items ENABLE ROW LEVEL SECURITY;

-- Create policies for checklist_items
CREATE POLICY "Users can view checklist_items for their events" 
ON public.checklist_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = checklist_items.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create checklist_items for their events" 
ON public.checklist_items 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = checklist_items.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update checklist_items for their events" 
ON public.checklist_items 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = checklist_items.event_id 
    AND events.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete checklist_items for their events" 
ON public.checklist_items 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = checklist_items.event_id 
    AND events.user_id = auth.uid()
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates on events
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'name', new.email)
  );
  RETURN new;
END;
$$;

-- Create trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();