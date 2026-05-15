import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import type { TokenPackage } from "@/lib/types/database";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: packages } = await supabase
    .from("token_packages")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  return (
    <main className="min-h-screen">
      {/* Üst gezinti */}
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="ruyatevili" width={44} height={44} priority />
          <span className="font-display text-xl text-night-50 tracking-wide">ruyatevili</span>
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

      {/* Açılış indirim banner'ı */}
      <div className="container mx-auto px-6">
        <div className="bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 border border-gold-400/40 rounded-2xl px-6 py-3 text-center mb-8">
          <p className="text-gold-100 font-medium">
            🎉 <span className="font-display text-lg">Açılışa Özel</span> · Tüm paketlerde
            <span className="text-gold-300 font-bold mx-1">%90 İNDİRİM</span> · Sınırlı süreli
          </p>
        </div>
      </div>

      {/* HERO */}
      <section className="container mx-auto px-6 pt-12 pb-24 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-night-800/50 border border-gold-400/20 text-gold-300 text-sm">
          <span className="w-2 h-2 rounded-full bg-gold-400 animate-twinkle"></span>
          Geleneksel Tevil İlmi · Sertifikalı Yorumcu
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-light text-night-50 mb-6 max-w-4xl mx-auto leading-tight">
          Uykudaki <em className="text-gold-300 not-italic font-normal">ilham kırıntılarını</em>,
          ilimle gerçeğe dönüştürüyoruz
        </h1>

        <p className="text-lg md:text-xl text-night-200 max-w-2xl mx-auto mb-12 leading-relaxed">
          Doğru teşhis ve doğru bilgiyle rüyalarınızın dilini çözün. Detaylı analiz
          sistemimizle rüyanızın dokusunu ve içeriğini birlikte inceleyelim,
          kalbinizin pusulasını beraber bulalım.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/auth/register" className="btn-primary text-lg px-8 py-4">
            Hemen Başla
          </Link>
          <Link href="#nasil-calisir" className="btn-ghost">
            Nasıl Çalışır? ↓
          </Link>
        </div>
      </section>

      {/* KANCA MESAJ */}
      <section className="container mx-auto px-6 py-12">
        <div className="card-elevated max-w-3xl mx-auto text-center">
          <p className="font-display text-2xl md:text-3xl text-night-50 leading-relaxed italic">
            "Her rüya size özel bir mesaj taşır. Hayatınızda cevabını aradığınız büyük
            soruların şifresi belki de son rüyanızda gizlidir."
          </p>
        </div>
      </section>

      {/* NASIL ÇALIŞIR */}
      <section id="nasil-calisir" className="container mx-auto px-6 py-20">
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
          ].map((step) => (
            <div key={step.num} className="card hover:border-gold-400/40 transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-4">
                <span className="font-display text-3xl text-gold-400/60">{step.num}</span>
                <span className="text-3xl">{step.icon}</span>
              </div>
              <h3 className="font-display text-2xl text-night-50 mb-3">{step.title}</h3>
              <p className="text-night-200 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PAKETLER */}
      <section id="paketler" className="container mx-auto px-6 py-20">
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 rounded-full bg-gold-400/20 text-gold-300 text-sm font-medium mb-4">
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
            // Orijinal fiyat = %90 indirimli fiyat × 10
            const originalPrice = Number(pkg.price_try) * 10;
            return (
              <div
                key={pkg.id}
                className={`relative ${pkg.is_featured ? "card-elevated lg:scale-105" : "card"} hover:transform hover:-translate-y-1 transition-all duration-300`}
              >
                {pkg.is_featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-400 text-night-950 text-xs font-medium rounded-full">
                    En Avantajlı
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-display text-2xl text-night-50 mb-2">{pkg.name}</h3>
                  <div className="mb-4">
                    <p className="text-xs text-night-400 line-through">
                      {originalPrice.toLocaleString("tr-TR")} ₺
                    </p>
                    <span className="font-display text-4xl text-gold-300">
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
      <section className="container mx-auto px-6 py-20">
        <div className="card-elevated max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6">
            <Image src="/logo.png" alt="ruyatevili" width={64} height={64} />
          </div>
          <h2 className="font-display text-3xl text-night-50 mb-4">
            Rüyanızı Sıradan Yorumlara Bırakmayın
          </h2>
          <p className="text-night-200 leading-relaxed mb-6 text-lg">
            Burada konuşulan dil İmam Muhammed İbn Sirin'den Erdem Akça hocaya uzanan
            klasik tevil ilminin dilidir. Her rüya, geleneksel kaynaklar ışığında ve
            kişisel hayatınızla bağı kurularak özenle yorumlanır.
          </p>
          <p className="text-sm text-night-300">
            "Rüya ve Ta'bir/Te'vil İlmi" eğitim sertifikası mevcuttur.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-night-700 mt-20">
        <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="ruyatevili" width={32} height={32} />
            <span className="font-display text-night-50">ruyatevili</span>
          </div>
          <p className="text-sm text-night-400">
            © {new Date().getFullYear()} ruyatevili · Tüm hakları saklıdır
          </p>
        </div>
      </footer>
    </main>
  );
}
