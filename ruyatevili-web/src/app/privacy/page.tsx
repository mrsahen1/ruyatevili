import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Gizlilik Politikası | ruyatevili",
  description:
    "Kişisel verilerinizin nasıl işlendiği, korunduğu ve kullanıldığı hakkında detaylı 1 bilgi.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen">
      {/* Üst navigasyon */}
      <nav className="container mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <Image src="/logo.png" alt="RUYATEVİLİ" width={40} height={40} />
          <span className="hidden sm:inline font-display text-xl text-night-50 tracking-widest uppercase">
            ruyatevili
          </span>
        </Link>
        <Link href="/" className="btn-ghost text-sm">
          ← Ana Sayfa
        </Link>
      </nav>

      <article className="container mx-auto px-4 sm:px-6 py-12 max-w-3xl">
        <h1 className="font-display text-4xl md:text-5xl text-night-50 mb-4">
          Gizlilik Politikası
        </h1>
        <p className="text-night-400 text-sm mb-8">
          Son güncelleme: 18 Mayıs 2026
        </p>

        <div className="prose-content space-y-6 text-night-200 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">1. Giriş</h2>
            <p>
              ruyatevili (&quot;biz&quot;, &quot;hizmet&quot;) olarak, kullanıcılarımızın
              gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası, web sitemizi
              (ruyatevili.com) ve mobil uygulamamızı kullanırken bizimle paylaştığınız
              kişisel verilerin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
            </p>
            <p>
              Hizmetimizi kullanarak bu politikayı kabul etmiş sayılırsınız.
              Türkiye Cumhuriyeti 6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK)
              ve ilgili mevzuat çerçevesinde verileriniz işlenir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              2. Toplanan Veriler
            </h2>
            <p>Hizmetimiz aşağıdaki verileri toplar:</p>

            <h3 className="text-night-50 font-medium mt-4 mb-2">
              2.1. Hesap Bilgileri
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ad ve soyad</li>
              <li>E-posta adresi</li>
              <li>Şifre (şifrelenmiş olarak saklanır)</li>
            </ul>

            <h3 className="text-night-50 font-medium mt-4 mb-2">
              2.2. Rüya İçerikleri
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Yazdığınız rüya metinleri</li>
              <li>Rüya öncesi/sonrası hisleriniz, fiziksel durumunuz</li>
              <li>Rüya ile ilgili kişisel notlarınız</li>
            </ul>

            <h3 className="text-night-50 font-medium mt-4 mb-2">
              2.3. Ödeme Bilgileri
            </h3>
            <p>
              Ödeme işlemleri Shopier altyapısı üzerinden gerçekleştirilir.
              <strong className="text-night-50"> Kredi kartı bilgileriniz bizim
              sunucularımızda saklanmaz</strong>. Sadece sipariş numarası ve ödenen
              tutar gibi bilgiler kayıt altına alınır.
            </p>

            <h3 className="text-night-50 font-medium mt-4 mb-2">
              2.4. Otomatik Toplanan Veriler
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP adresi (güvenlik amaçlı, kısa süreli)</li>
              <li>Tarayıcı türü ve sürümü</li>
              <li>Ziyaret tarih ve saatleri</li>
              <li>Cihaz türü (mobil/masaüstü)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              3. Verilerin Kullanım Amaçları
            </h2>
            <p>Verileriniz aşağıdaki amaçlarla işlenir:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Rüya yorumlama hizmeti sunmak</li>
              <li>Hesabınızı oluşturmak ve yönetmek</li>
              <li>Token bakiyenizi ve işlemlerinizi takip etmek</li>
              <li>Rüya yorumunuz hazır olduğunda size bildirim göndermek</li>
              <li>Müşteri desteği sağlamak</li>
              <li>Hizmet kalitemizi iyileştirmek</li>
              <li>Yasal yükümlülüklerimizi yerine getirmek</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              4. Rüya İçeriklerinin Gizliliği
            </h2>
            <p>
              <strong className="text-night-50">Yazdığınız rüyalar son derece kişisel
              içeriklerdir.</strong> Bu içerikler:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Yalnızca sertifikalı yorumcumuz tarafından okunur</li>
              <li>Üçüncü taraflarla paylaşılmaz</li>
              <li>Yapay zeka modellerini eğitmek için kullanılmaz</li>
              <li>Reklam veya pazarlama amaçlı işlenmez</li>
              <li>Anonim istatistik dışında hiçbir yerde yayımlanmaz</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              5. Verilerin Saklama Süresi
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong className="text-night-50">Hesap verileri:</strong> Hesabınız
                aktif olduğu sürece saklanır. Hesap silindiğinde 30 gün içinde
                tüm verileriniz silinir.
              </li>
              <li>
                <strong className="text-night-50">Rüya içerikleri:</strong> Hesap
                silindiğinde otomatik silinir. Siz de istediğiniz zaman tek tek
                rüyalarınızı silebilirsiniz.
              </li>
              <li>
                <strong className="text-night-50">Ödeme kayıtları:</strong> Türk Vergi
                Mevzuatı gereği 5 yıl saklanmak zorundadır.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              6. Üçüncü Taraf Hizmetleri
            </h2>
            <p>Hizmetimizin çalışması için aşağıdaki üçüncü taraf sağlayıcıları kullanırız:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong className="text-night-50">Supabase:</strong> Veritabanı ve
                kimlik doğrulama (sunucular AB&apos;de)
              </li>
              <li>
                <strong className="text-night-50">Vercel:</strong> Web sitesi barındırma
              </li>
              <li>
                <strong className="text-night-50">Shopier:</strong> Ödeme işleme (Türkiye)
              </li>
              <li>
                <strong className="text-night-50">Resend:</strong> E-posta bildirimleri
              </li>
              <li>
                <strong className="text-night-50">Google AdMob:</strong> Mobil
                uygulamada reklam gösterimi (sadece Android uygulama)
              </li>
            </ul>
            <p className="mt-3">
              Her sağlayıcının kendi gizlilik politikası vardır ve onların sitelerinden
              detaylarını inceleyebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              7. AdMob Reklamları (Mobil Uygulama)
            </h2>
            <p>
              Android mobil uygulamamızda Google AdMob aracılığıyla reklamlar gösterilir.
              AdMob, kişiselleştirilmiş reklamlar sunmak için cihaz tanımlayıcılarını
              ve reklam etkileşimlerinizi kullanabilir.
            </p>
            <p>
              Kişiselleştirilmiş reklamları kapatmak için cihaz ayarlarınızdan
              &quot;Reklam İzlemeyi Sınırla&quot; (iOS) veya &quot;Reklam Kimliğini
              Sıfırla&quot; (Android) seçeneklerini kullanabilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              8. KVKK Kapsamındaki Haklarınız
            </h2>
            <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>Verilerinize erişme ve kopyasını talep etme</li>
              <li>Yanlış veya eksik verilerin düzeltilmesini isteme</li>
              <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              <li>İşlemeye itiraz etme</li>
              <li>Zarar uğramanız halinde tazminat talep etme</li>
            </ul>
            <p className="mt-3">
              Bu haklarınızı kullanmak için bizimle{" "}
              <a
                href="mailto:janysarry84@gmail.com"
                className="text-gold-300 hover:text-gold-200 underline"
              >
                janysarry84@gmail.com
              </a>{" "}
              adresinden iletişime geçebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              9. Çocukların Gizliliği
            </h2>
            <p>
              Hizmetimiz 18 yaşın üzerindeki kişilere yöneliktir. 18 yaşın altındaki
              kullanıcılardan bilerek veri toplamayız. Eğer 18 yaşın altında olduğunu
              fark ettiğimiz bir hesap varsa, derhal silinir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              10. Güvenlik
            </h2>
            <p>
              Verilerinizi korumak için endüstri standardı güvenlik önlemleri kullanırız:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>HTTPS şifreleme (SSL/TLS)</li>
              <li>Şifreli veritabanı bağlantıları</li>
              <li>Şifrelerin bcrypt ile hash&apos;lenmesi</li>
              <li>Düzenli güvenlik güncellemeleri</li>
            </ul>
            <p className="mt-3">
              Buna rağmen internet üzerinden iletim %100 güvenli değildir. Veri
              sızıntısı durumunda kullanıcılara mümkün olan en kısa sürede haber verilir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              11. Çerezler (Cookies)
            </h2>
            <p>
              Site, sadece zorunlu çerezleri kullanır (oturum bilgisi). Reklam veya
              takip amaçlı çerez kullanmaz. Tarayıcı ayarlarınızdan çerezleri
              yönetebilirsiniz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              12. Politika Güncellemeleri
            </h2>
            <p>
              Bu politikada yapılacak önemli değişiklikler için kullanıcılarımızı
              e-posta veya site içi bildirim ile bilgilendireceğiz. Güncellemeleri
              takip etmek için bu sayfayı periyodik olarak kontrol etmenizi öneririz.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              13. İletişim
            </h2>
            <p>
              Bu Gizlilik Politikası hakkında sorularınız veya endişeleriniz varsa:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong className="text-night-50">E-posta:</strong>{" "}
                <a
                  href="mailto:janysarry84@gmail.com"
                  className="text-gold-300 hover:text-gold-200 underline"
                >
                  janysarry84@gmail.com
                </a>
              </li>
              <li>
                <strong className="text-night-50">Web sitesi:</strong>{" "}
                <a
                  href="https://ruyatevili.com"
                  className="text-gold-300 hover:text-gold-200 underline"
                >
                  ruyatevili.com
                </a>
              </li>
            </ul>
          </section>

          <hr className="border-night-700 my-8" />

          <p className="text-sm text-night-400 text-center">
            Bu gizlilik politikası KVKK ve Play Store şartlarına uygun olarak hazırlanmıştır.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-night-700">
          <Link href="/terms" className="btn-secondary">
            📋 Kullanım Şartları
          </Link>
          <Link href="/" className="btn-ghost">
            ← Ana Sayfa
          </Link>
        </div>
      </article>
    </main>
  );
}
