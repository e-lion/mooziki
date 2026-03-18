-- 1. Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 2. Define RLS Policies for 'users'
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own non-balance metadata"
ON public.users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND 
    (balance IS NOT DISTINCT FROM (SELECT balance FROM public.users WHERE id = auth.uid()))
);

-- 3. Define RLS Policies for 'requests'
CREATE POLICY "Anyone can view requests" 
ON public.requests FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Attendees can insert requests" 
ON public.requests FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = attendee_id);

CREATE POLICY "DJs can update status of their own requests" 
ON public.requests FOR UPDATE 
TO authenticated 
USING (auth.uid() = dj_id OR dj_id IS NULL)
WITH CHECK (auth.uid() = dj_id);

-- 4. Define RLS Policies for 'transactions'
CREATE POLICY "Users can view their own transactions" 
ON public.transactions FOR SELECT 
TO authenticated 
USING (auth.uid() = dj_id OR auth.uid() = (SELECT attendee_id FROM public.requests WHERE id = request_id));

-- 5. Automate Payouts with a Trigger
CREATE OR REPLACE FUNCTION public.process_payout() 
RETURNS TRIGGER AS $$
DECLARE
    platform_fee_percent NUMERIC := 30; -- 30% commission
    total_amount NUMERIC;
    dj_share NUMERIC;
    platform_share NUMERIC;
BEGIN
    -- Only trigger when status changes to 'played'
    IF NEW.status = 'played' AND (OLD.status IS DISTINCT FROM 'played') THEN
        total_amount := NEW.fee_amount;
        platform_share := (total_amount * platform_fee_percent) / 100;
        dj_share := total_amount - platform_share;

        -- Update DJ Balance
        UPDATE public.users 
        SET balance = balance + dj_share
        WHERE id = NEW.dj_id;

        -- Record Transaction
        INSERT INTO public.transactions (request_id, dj_id, total_amount, dj_amount, platform_amount)
        VALUES (NEW.id, NEW.dj_id, total_amount, dj_share, platform_share);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_played
AFTER UPDATE ON public.requests
FOR EACH ROW
EXECUTE FUNCTION public.process_payout();

-- 6. Automate User Creation Sync
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, role, name, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')::public.users.role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
