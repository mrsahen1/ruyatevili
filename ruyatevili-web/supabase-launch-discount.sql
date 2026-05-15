-- ============================================================
-- AÇILIŞ KAMPANYASI — Token paketlerini %90 indirimle güncelle
-- ============================================================
-- Bu SQL'i Supabase SQL Editor'a yapıştırıp çalıştır.
-- Sonra paketleri normal fiyata döndürmek için ikinci SQL'i çalıştırırsın.

-- Mevcut paketleri temizle ve yeniden ekle (indirimli)
delete from public.token_packages;

insert into public.token_packages (name, description, token_count, price_try, is_featured, display_order) values
  ('1 Token',  'Açılışa özel deneme paketi · %90 indirim',     1,    50.00, false, 1),
  ('3 Token',  'Açılışa özel · %90 indirim',                    3,   130.00, false, 2),
  ('5 Token',  '⭐ En avantajlı · Açılışa özel %90 indirim',    5,   200.00, true,  3),
  ('10 Token', 'Açılışa özel ekonomik paket · %90 indirim',    10,   380.00, false, 4);

-- Normal fiyatlar (referans):
-- 1 Token:  500 TL → 50 TL  (%90 indirim)
-- 3 Token:  1300 TL → 130 TL
-- 5 Token:  2000 TL → 200 TL
-- 10 Token: 3800 TL → 380 TL
