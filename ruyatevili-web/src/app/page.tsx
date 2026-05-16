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
      <nav className="relative container mx-auto px-6 py-6 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logo.png"
            alt="RUYATEVİLİ"
            width={44}
            height={44}
            priority
            className="group-hover:rotate-12 transition-transform duration-500"
          />
          <span className="font-display text-xl text-night-50 tracking-widest uppercase">
            ruyatevili
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="btn-ghost">
            Giriş
          </Link>
          <Link href="/auth/register" className="btn-secondary">
            Kayıt Ol
          </Link>
        </div>
      </nav>

      {/* GERİ SAYIM */}
      <div className="container mx-auto px-6 mb-8 relative z-10">
        <CountdownBanner />
      </div>

      {/* HERO */}
      <section className="relative container mx-auto px-6 pt-12 pb-24 text-center animate-fade-in z-10">
        {/* HİLAL DEKORASYONU */}
        <div className="absolute top-0 right-12 hidden lg:block">
          <div className="text-9xl text-gold-400/10 animate-float">☾</div>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-night-800/50 border border-gold-400/30 text-gold-300 text-sm backdrop-blur-sm shadow-lg shadow-gold-400/10">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-twinkle"></span>
          Geleneksel Tevil İlmi · Sertifikalı Yorumcu
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-light text-night-50 mb-6 max-w-4xl mx-auto leading-tight relative">
          Uykudaki{" "}
          <em className="text-gold-300 not-italic font-normal relative inline-block">
            ilham kırıntılarını
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400/60 to-transparent animate-shimmer"></span>
          </em>
          , ilimle gerçeğe dönüştürüyoruz
        </h1>

        <p className="text-lg md:text-xl text-night-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          Doğru teşhis ve doğru bilgiyle rüyalarınızın dilini çözün. Detaylı analiz
          sistemimizle rüyanızın dokusunu ve içeriğini birlikte inceleyelim,
          kalbinizin pusulasını beraber bulalım.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="btn-primary text-lg px-8 py-4 relative group overflow-hidden"
          >
            <span className="relative z-10">Hemen Başla</span>
            <span className="absolute inset-0 bg-gradient-to-r from-gold-300 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
          </Link>
          <Link href="#nasil-calisir" className="btn-ghost">
            Nasıl Çalışır? ↓
          </Link>
        </div>

        {/* HEDIYE ROZETI */}
        <div className="mt-8 inline-block">
          <p className="text-sm text-gold-300/80">
            🎁 Kayıt olunca <span className="font-semibold">1 ücretsiz token</span> hediye!
          </p>
        </div>
      </section>

      {/* KANCA MESAJ - PARLAK */}
      <section className="relative container mx-auto px-6 py-12 z-10">
        <div className="card-elevated max-w-3xl mx-auto text-center relative overflow-hidden group">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-gold-400/10 rounded-full blur-3xl group-hover:bg-gold-400/20 transition-all duration-700"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-gold-400/10 rounded-full blur-3xl group-hover:bg-gold-400/20 transition-all duration-700"></div>
          <p className="font-display text-2xl md:text-3xl text-night-50 leading-relaxed italic relative">
            &quot;Her rüya size özel bir mesaj taşır. Hayatınızda cevabını aradığınız büyük
            soruların şifresi belki de son rüyanızda gizlidir.&quot;
          </p>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="relative container mx-auto px-6 py-20 z-10">
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
              desc: "İhtiyacınıza uygun paketi seçin. Açılışa özel %90 indirim aktif.",
            },
            {
              num: "02",
              icon: "✍️",
              title: "Rüyanı Yaz",
              desc: "5 bölümlük detaylı anamnez formuyla rüyanızı paylaşın. Adım adım yönlendiriyoruz.",
            },
            {
              num: "03",
              icon: "🔔",
              title: "Bildirim Bekle",
              desc: "Yorumunuz hazır olduğunda veya rüyanız demlenmeye bırakıldığında haberdar olun.",
            },
          ].map((step, idx) => (
            <div
              key={step.num}
              className="card hover:border-gold-400/60 transition-all duration-500 group relative overflow-hidden"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* hover ışığı */}
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
      <section id="paketler" className="relative container mx-auto px-6 py-20 z-10">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-400/20 text-gold-300 text-sm font-medium mb-4 animate-pulse-slow">
            🎉 Açılışa Özel %90 İndirim
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
            const originalPrice = Number(pkg.price_try) * 10;
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
                    {/* parlama */}
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
                    <p className="text-xs text-gold-400 mt-1 font-medium">%90 İNDİRİM</p>
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

      {/* OTORİTE */}
      <section className="relative container mx-auto px-6 py-20 z-10">
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
            <p className="text-sm text-night-300">
              &quot;Rüya ve Ta&apos;bir/Te&apos;vil İlmi&quot; eğitim sertifikası mevcuttur.
            </p>
          </div>
        </div>
      </section>

      {/* SON CTA */}
      <section className="relative container mx-auto px-6 py-20 z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-night-50 mb-4">
            Rüyanız Sizi Bekliyor
          </h2>
          <p className="text-night-300 mb-8">
            Şimdi kayıt olun, 1 ücretsiz token hediyemizle ilk rüyanızı yorumlatın.
          </p>
          <Link
            href="/auth/register"
            className="btn-primary text-lg px-10 py-4 inline-block"
          >
            🎁 Ücretsiz Başla
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-night-700 mt-20 z-10">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="RUYATEVİLİ" width={32} height={32} />
            <span className="font-display text-night-50 tracking-widest uppercase">
              ruyatevili
            </span>
          </div>
          <p className="text-sm text-night-400">
            © {new Date().getFullYear()} RUYATEVİLİ · Tüm hakları saklıdır
          </p>
        </div>
      </footer>
    </main>
  );
}
