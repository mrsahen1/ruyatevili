# ruyatevili — Web Sitesi

Token bazlı rüya tabiri hizmeti. Next.js 14 + Supabase + Tailwind CSS.

**Slogan:** Uykudaki ilham kırıntılarını, ilimle gerçeğe dönüştürüyoruz.

## 🚀 Hızlı Başlangıç (Yerel Test)

### Gereksinimler
- Node.js 18+ ([nodejs.org](https://nodejs.org)'dan indir)
- Supabase projesi (zaten kurulu)

### Adımlar

1. **Klasöre gir:**
   ```bash
   cd ruyatevili-web
   ```

2. **Bağımlılıkları yükle:**
   ```bash
   npm install
   ```

3. **Geliştirme sunucusunu başlat:**
   ```bash
   npm run dev
   ```

4. Tarayıcıda aç: [http://localhost:3000](http://localhost:3000)

`.env.local` dosyası senin Supabase bilgilerinle zaten doldurulmuş.

---

## 🎉 İlk Önce: Açılış İndirim SQL'ini Çalıştır

Paketleri %90 indirimli yapmak için:

1. Supabase Dashboard > SQL Editor
2. `supabase-launch-discount.sql` dosyasının içeriğini yapıştır
3. Run

Bu sonra paketleri:
- 1 Token: 500 ₺ → **50 ₺**
- 3 Token: 1300 ₺ → **130 ₺**
- 5 Token: 2000 ₺ → **200 ₺** ⭐
- 10 Token: 3800 ₺ → **380 ₺**

olarak günceller.

---

## 📦 GitHub'a Yükleme

1. **GitHub'da yeni bir repo oluştur:**
   - [github.com/new](https://github.com/new)
   - Repository name: `ruyatevili-web` (veya istediğin)
   - Public veya Private — Vercel ikisini de destekler
   - "Create repository" tıkla

2. **Bu klasörü Git ile başlat ve yükle:**
   ```bash
   cd ruyatevili-web
   git init
   git add .
   git commit -m "İlk commit"
   git branch -M main
   git remote add origin https://github.com/KULLANICI-ADIN/ruyatevili-web.git
   git push -u origin main
   ```

   (KULLANICI-ADIN'ı kendi GitHub kullanıcı adınla değiştir)

⚠️ **Önemli:** `.env.local` dosyası `.gitignore`'da olduğu için GitHub'a YÜKLENMEZ. Bu güvenlik için doğru.

---

## ☁️ Vercel'e Deploy

1. **Vercel hesabı aç:** [vercel.com](https://vercel.com) → "Sign up with GitHub"

2. **Projeyi import et:**
   - Vercel Dashboard → "Add New..." → "Project"
   - GitHub repo listesinden `ruyatevili-web`'i seç → "Import"

3. **Environment Variables ekle (KRİTİK!):**
   Deploy butonuna basmadan ÖNCE "Environment Variables" bölümünde şunları ekle:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://koipfmsojpcwvwzxnicf.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_uvSgA-Nx6xc5z19Kz6iR4A_5WTO1dC5` |
   | `NEXT_PUBLIC_SITE_URL` | `https://ruyatevili.site` (domain bağlandıktan sonra) |

4. **"Deploy" butonuna bas.** 2-3 dakika sonra siten yayında!

5. **İlk deploy sonrası:**
   - Vercel sana `xxx.vercel.app` URL verir
   - **Supabase Dashboard > Authentication > URL Configuration**'a git
   - Site URL'i bu URL ile değiştir
   - Redirect URLs'e ekle: `https://xxx.vercel.app/**`

---

## 🌐 Custom Domain: ruyatevili.site

1. Domain'i satın al (örn: Sahibinden, GoDaddy, Namecheap, Hostinger)
2. **Vercel Dashboard > Settings > Domains** → "Add" → `ruyatevili.site`
3. Vercel sana DNS kayıtları gösterir
4. Domain sağlayıcının DNS panelinde bu kayıtları ekle
5. 5-30 dk içinde aktif olur
6. **Supabase URL Configuration**'ı `https://ruyatevili.site` ile güncelle
7. Vercel environment variables'ta `NEXT_PUBLIC_SITE_URL`'i de güncelle
8. **Android uygulamasındaki `SITE_URL`'i de güncelle** (build.gradle)

---

## 🔐 İlk Test

1. Yayına alındıktan sonra siteni aç
2. "Kayıt Ol" → kendine yeni bir test hesabı aç
3. E-postanı doğrula
4. Giriş yap → Dashboard'u gör
5. Admin hesabınla `/admin/dreams` adresine git
6. Test rüyası gönder ve yorumla

---

## 📂 Proje Yapısı

```
ruyatevili-web/
├── src/
│   ├── app/                    # Next.js sayfalar
│   │   ├── page.tsx            # Ana sayfa (Landing)
│   │   ├── auth/               # Login, kayıt, şifre sıfırlama
│   │   ├── dashboard/          # Kullanıcı paneli
│   │   ├── dream/              # Rüya gönderme ve görüntüleme
│   │   ├── wallet/             # Token cüzdanı
│   │   └── admin/              # Admin panel (rüya yorumla)
│   ├── components/             # React bileşenleri
│   └── lib/
│       ├── supabase/           # Supabase client'lar
│       └── types/              # TypeScript tipleri
├── public/
│   ├── logo.png                # Ana logo
│   └── logo-256.png            # Küçük logo
├── .env.local                  # Supabase ayarları (git'e gitmez)
├── package.json
├── supabase-launch-discount.sql  # %90 indirim SQL'i
└── tailwind.config.ts          # Renk teması (gece + altın)
```

---

## 🛠️ Sık Karşılaşılan Sorunlar

**"Database error" alıyorum:**
- Supabase schema.sql'inin doğru kurulduğunu kontrol et
- Sol menü > Table Editor'da 5 tablo görünmeli

**Giriş yapamıyorum:**
- Supabase > Authentication > URL Configuration'da Site URL doğru mu?
- Vercel'e deploy ettiysen Site URL'i de güncelledin mi?

**Sayfalar yüklenmiyor:**
- Vercel'de environment variables doğru mu girildi?
- Browser console (F12) hata gösteriyor mu?

---

## 🎯 Sonraki Adımlar

- [ ] Shopier ödeme entegrasyonu (cüzdan sayfasındaki "Yakında" butonları)
- [ ] E-posta bildirimleri (Resend API)
- [ ] Supabase Realtime ile anlık durum güncellemesi
- [ ] Sembol sözlüğü sayfası (Otorite hissini güçlendirir)
- [ ] Erdem Akça sertifikası PDF'ini Otorite bölümüne ekle
- [ ] Privacy Policy ve Şartlar sayfaları (Play Store için gerekli)

---

İyi çalışmalar! 🌙
