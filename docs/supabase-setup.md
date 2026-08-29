# Supabase Database Setup

To set up your own database instead of using the Lovable one, follow these steps:

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Once created, go to **Settings > API** to find your keys.
3. Update your `.env` file with your new keys:
   ```env
   VITE_SUPABASE_URL="https://your-project.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   ```
4. Go to the **SQL Editor** in the Supabase dashboard and run the following script to set up all tables, roles, and policies:

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  image_url text,
  reading_time text NOT NULL DEFAULT '5 daqiqa',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "published articles are public" ON public.articles FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "admins read all articles" ON public.articles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins update articles" ON public.articles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete articles" ON public.articles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.subscribers TO authenticated;
GRANT ALL ON public.subscribers TO service_role;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read subscribers" ON public.subscribers FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  ip text,
  country text,
  city text,
  device text,
  browser text,
  os text,
  user_agent text,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX visits_created_at_idx ON public.visits (created_at DESC);
GRANT SELECT ON public.visits TO authenticated;
GRANT ALL ON public.visits TO service_role;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read visits" ON public.visits FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- You will need to create the 'article-images' bucket manually in the Supabase Storage dashboard before running these policies.
-- Create a new bucket named 'article-images', leave it Private.
CREATE POLICY "admins upload article images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins read article images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins delete article images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'article-images' AND public.has_role(auth.uid(), 'admin'));

-- Sample data
INSERT INTO public.articles (slug, title, category, excerpt, body, image_url, reading_time, created_at) VALUES
('sakkiz-soatlik-uyqu','Nima uchun 8 soatlik uyqu ham yetarli bo''lmasligi mumkin?','uyqu-stress','Sifatli dam olishning biologik va psixologik jihatlari haqida yangi tadqiqotlar tahlili.','Uyqu davomiyligi — bu faqat raqam. Tadqiqotlar shuni ko''rsatadiki, uyqu sifati, ya''ni chuqur va REM bosqichlarining nisbati, ertangi kunimizdagi diqqat va hissiy barqarorlikni davomiylikdan ko''ra kuchliroq belgilaydi.

Kechki yorug''lik, kofein va tartibsiz uyqu vaqti sirkad ritmni siljitadi. Natijada siz to''shakda sakkiz soat yotasiz, ammo miya o''zining tiklanish sikllarini to''liq yakunlay olmaydi.

Amaliy xulosa oddiy: har kuni bir xil vaqtda uyg''oning, ertalabki tabiiy yorug''likni oling va kechqurun ekran yorqinligini pasaytiring.

Uyqu — dam olish emas, balki xotira, hissiyot va qaror qabul qilish tizimlarining tungi ta''mirlash ishi.','/article-sleep.jpg','6 daqiqa', now() - interval '1 day'),
('neyroplastiklik-va-odatlar','Neyroplastiklik: qanday qilib eski odatlardan voz kechish mumkin?','xarakter','Miya tuzilmasini o''zgartirish orqali shaxsiy rivojlanishga erishish yo''llari.','Odat — bu miyaning energiya tejash strategiyasi. Takrorlangan xatti-harakat bazal ganglionlarda avtomatlashadi va ongli e''tiborni talab qilmay qo''yadi.

Shu sababli odatni «kuch bilan» yo''q qilish samarasiz. Uni almashtirish ancha ishonchli: bir xil ishorani saqlab, unga yangi harakatni ulash kerak.

Neyroplastiklik — miyaning bog''lanishlarni qayta qurish qobiliyati — yoshdan qat''i nazar saqlanadi.

Kichik, aniq va kundalik takrorlanadigan harakat — katta, ammo tartibsiz urinishlardan doim ustun keladi.','/article-habits.jpg','8 daqiqa', now() - interval '2 day'),
('hissiy-intellekt','Hissiy intellekt va uning martaba o''sishidagi o''rni','psixologiya','Nima uchun EQ ko''pincha IQ dan ko''ra muhimroq hisoblanadi?','Hissiy intellekt — o''z va o''zgalar hissiyotlarini tanib olish, nomlash va boshqarish qobiliyati. U tug''ma iste''dod emas, o''rganiladigan ko''nikma.

Jamoada ishlash, nizolarni hal qilish va rahbarlik — bularning barchasi texnik bilimdan ko''ra hissiy o''qish qobiliyatiga tayanadi.

EQ ni rivojlantirishning eng oddiy mashqi — kun oxirida uchta his-tuyg''uni aniq so''z bilan yozib qo''yish.','/article-eq.jpg','7 daqiqa', now() - interval '3 day');
```
