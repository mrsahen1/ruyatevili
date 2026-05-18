import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CountdownBanner } from "@/components/CountdownBanner";
import type { TokenPackage } from "@/lib/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("token_packages")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* HAREKETLİ YILDIZ ARKAPLANI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="star star-1"></div>
        <div className="star star-2"></div>
        <div className="star star-3"></div>
        <div className="star star-4"></div>
        <div className="star star-5"></div>
        <div className="star star-6"></div>
        <div className="star star-7"></div>
        <div className="star star-8"></div>
      </div>

      {/* PARLAYAN IŞIK GEÇİŞİ */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-slow"></div>

      {/* ÜST NAVIGASYON */}
      <nav className="relative container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between z-10 gap-2">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group min-w-0">
          <Image
            src="/logo.png"
            alt="RUYATEVİLİ"
            width={44}
            height={44}
            priority
            className="w-10 h-10 sm:w-11 sm:h-11 group-hover:rotate-12 transition-transform duration-500 flex-shrink-0"
          />
          <span className="hidden sm:inline font-display text-xl text-night-50 tracking-widest uppercase">
            ruyatevili
          </span>
        </Link>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="/auth/login"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-night-800/60 hover:bg-night-700/60 border border-night-600 text-night-50 text-sm font-medium rounded-lg transition-all"
          >
            Giriş
          </Link>
          <Link
            href="/auth/register"
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gold-400 hover:bg-gold-300 text-night-950 text-sm font-medium rounded-lg shadow-lg shadow-gold-400/20 transition-all"
          >
            Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* GERİ SAYIM */}
      <div className="container mx-auto px-4 sm:px-6 mb-8 relative z-10">
        <CountdownBanner />
      </div>

      {/* HERO */}
      <section className="relative container mx-auto px-4 sm:px-6 pt-12 pb-24 text-center animate-fade-in z-10">
        <div className="absolute top-0 right-12 hidden lg:block">
          <div className="text-9xl text-gold-400/10 animate-float">☾</div>
        </div>

        <div className="rotating-border-wrapper inline-block mb-8">
          <div className="rotating-border-inner px-6 py-2 bg-night-900 rounded-full">
            <span className="inline-flex items-center gap-2 text-gold-300 text-sm">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-twinkle"></span>
              Geleneksel Tevil İlmi · Sertifikalı Yorumcu
            </span>
          </div>
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-light text-night-50 mb-6 max-w-4xl mx-auto leading-tight relative">
          Uykudaki{" "}
          <em className="text-gold-300 not-italic font-normal relative inline-block">
            ilham kırıntılarını
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent animate-shimmer"></span>
          </em>
          , ilimle gerçeğe dönüştürüyoruz inşa&apos;Allah
        </h1>

        <p className="text-lg md:text-xl text-night-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          Doğru teşhis ve doğru bilgiyle rüyalarınızın dilini çözün. Detaylı analiz
          sistemimizle rüyanızın dokusunu ve içeriğini birlikte inceleyelim,
          kalbinizin pusulasını beraber bulalım inşa&apos;Allah.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="rotating-border-wrapper">
            <div className="rotating-border-inner bg-night-950 rounded-lg">
              <Link
                href="/auth/register"
                className="btn-primary text-lg px-8 py-4 block"
              >
                Hemen Başla
              </Link>
            </div>
          </div>
          <Link href="#nasil-calisir" className="btn-ghost">
            Nasıl Çalışır? ↓
          </Link>
        </div>
      </section>

      {/* KANCA MESAJ */}
      <section className="relative container mx-auto px-4 sm:px-6 py-12 z-10">
        <div className="rotating-border-wrapper max-w-3xl mx-auto">
          <div className="rotating-border-inner bg-night-900 rounded-xl">
            <div className="card-elevated !bg-transparent !border-0 text-center !rounded-xl">
              <p className="font-display text-2xl md:text-3xl text-night-50 leading-relaxed italic">
                &quot;Her rüya size özel bir mesaj taşır. Hayatınızda cevabını aradığınız büyük
                soruların şifresi belki de son rüyanızda gizlidir.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="relative container mx-auto px-4 sm:px-6 py-20 z-10">
        <h2 className="font-display text-4xl md:text-5xl text-center text-night-50 mb-4">
          Üç Basit Adım
        </h2>
        <p className="text-center text-night-300 mb-16 max-w-xl mx-auto">
          Süreç sadeleştirildi — siz rüyanıza odaklanın, gerisini biz halledelim.
        </p>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              num: "01",
              icon: "🪙",
              title: "Token Al",
              desc: "İhtiyacınıza uygun paketi seçin. Açılışa özel %30 indirim aktif.",
            },
            {
              num: "02",
              icon: "✍️",
              title: "Rüyanı Yaz",
              desc: "Detaylı anamnez formuyla rüyanızı paylaşın. Adım adım yönlendiriyoruz.",
            },
            {
              num: "03",
              icon: "🔔",
              title: "Bildirim Bekle",
              desc: "Yorumunuz hazır olduğunda veya rüyanız demlenmeye bırakıldığında haberdar olun.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="card hover:border-gold-400/60 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-400/0 via-gold-400/0 to-gold-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative">
                <div className="flex items-start gap-4 mb-4">
                  <span className="font-display text-3xl text-gold-400/60 group-hover:text-gold-300 transition-colors">
                    {step.num}
                  </span>
                  <span className="text-3xl group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-night-50 mb-3">{step.title}</h3>
                <p className="text-night-200 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PAKETLER */}
      <section id="paketler" className="relative container mx-auto px-4 sm:px-6 py-20 z-10">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-400/20 text-gold-300 text-sm font-medium mb-4 animate-pulse-slow">
            🎉 Açılışa Özel %30 İndirim
          </span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl text-center text-night-50 mb-4">
          Token Paketleri
        </h2>
        <p className="text-center text-night-300 mb-16 max-w-xl mx-auto">
          Her token, bir rüya yorumuna karşılık gelir. Demlenmeye bırakılan rüyalar için tokeniniz iade edilir.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {packages?.map((pkg: TokenPackage) => {
            const originalPrice = Math.round(Number(pkg.price_try) / 0.7);
            return (
              <div
                key={pkg.id}
                className={`relative ${pkg.is_featured ? "card-elevated lg:scale-105" : "card"} hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-gold-400/20 transition-all duration-500 group`}
              >
                {pkg.is_featured && (
                  <>
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-400 text-night-950 text-xs font-medium rounded-full animate-pulse-slow">
                      En Avantajlı
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-gold-400/0 via-gold-400/10 to-gold-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                  </>
                )}
                <div className="text-center relative">
                  <h3 className="font-display text-2xl text-night-50 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <p className="text-xs text-night-400 line-through">
                      {originalPrice.toLocaleString("tr-TR")} ₺
                    </p>
                    <span className="font-display text-4xl text-gold-300 group-hover:scale-110 inline-block transition-transform duration-300">
                      {Number(pkg.price_try).toLocaleString("tr-TR")}
                    </span>
                    <span className="text-night-300 ml-1">₺</span>
                    <p className="text-xs text-gold-400 mt-1 font-medium">%30 İNDİRİM</p>
                  </div>
                  <p className="text-sm text-night-200 mb-6">
                    {pkg.token_count} rüya yorumu hakkı
                  </p>
                  <Link
                    href="/auth/register"
                    className={pkg.is_featured ? "btn-primary w-full" : "btn-secondary w-full"}
                  >
                    Satın Al
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* OTORİTE + SERTİFİKA */}
      <section className="relative container mx-auto px-4 sm:px-6 py-20 z-10">
        <div className="card-elevated max-w-3xl mx-auto text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/5 via-transparent to-gold-400/5 pointer-events-none"></div>
          <div className="relative">
            <div className="inline-block mb-6 animate-float">
              <Image src="/logo.png" alt="RUYATEVİLİ" width={80} height={80} />
            </div>
            <h2 className="font-display text-3xl text-night-50 mb-4">
              Rüyanızı Sıradan Yorumlara Bırakmayın
            </h2>
            <p className="text-night-200 leading-relaxed mb-6 text-lg">
              Burada konuşulan dil İmam Muhammed İbn Sirin&apos;den Erdem Akça hocaya uzanan
              klasik tevil ilminin dilidir. Her rüya, geleneksel kaynaklar ışığında ve
              kişisel hayatınızla bağı kurularak özenle yorumlanır.
            </p>
            <p className="text-sm text-night-300 mb-8">
              &quot;Rüya ve Ta&apos;bir/Te&apos;vil İlmi&quot; eğitim sertifikası mevcuttur.
            </p>

            <div className="rotating-border-wrapper inline-block">
              <div className="rotating-border-inner bg-night-900 rounded-xl p-2">
                <Image
                  src="/certificate.jpg"
                  alt="Rüya Ta'bir ve Te'vil İlmi Eğitim Sertifikası"
                  width={600}
                  height={420}
                  className="rounded-lg max-w-full h-auto"
                />
              </div>
            </div>
            <p className="text-xs text-night-400 mt-4">
              Erdem Akça hocadan alınmış &quot;Rüya Ta&apos;bir ve Te&apos;vil İlmi&quot; katılım belgesi
            </p>
          </div>
        </div>
      </section>

      {/* SON CTA */}
      <section className="relative container mx-auto px-4 sm:px-6 py-20 z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-night-50 mb-4">
            Rüyanız Sizi Bekliyor
          </h2>
          <p className="text-night-300 mb-8">
            Şimdi kayıt olun, klasik tevil ilmiyle rüyanızın mesajını keşfedin inşa&apos;Allah.
          </p>
          <Link
            href="/auth/register"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            ✨ Hemen Başla
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-night-700 mt-20 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="RUYATEVİLİ" width={32} height={32} />
              <span className="font-display text-night-50 tracking-widest uppercase">
                ruyatevili
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <Link
                href="/privacy"
                className="text-night-300 hover:text-gold-300 transition-colors"
              >
                Gizlilik Politikası
              </Link>
              <span className="text-night-700">·</span>
              <Link
                href="/terms"
                className="text-night-300 hover:text-gold-300 transition-colors"
              >
                Kullanım Şartları
              </Link>
              <span className="text-night-700">·</span>
              <a
                href="mailto:janysarry84@gmail.com"
                className="text-night-300 hover:text-gold-300 transition-colors"
              >
                İletişim
              </a>
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-night-400">
              © {new Date().getFullYear()} RUYATEVİLİ · Tüm hakları saklıdır
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
