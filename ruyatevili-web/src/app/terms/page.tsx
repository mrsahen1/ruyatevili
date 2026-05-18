import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Kullanım Şartları | ruyatevili",
  description:
    "Hizmetimizin kullanım şartları ve kuralları. Üye olmadan önce lütfen okuyun.",
};

export default function TermsPage() {
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
          Kullanım Şartları
        </h1>
        <p className="text-night-400 text-sm mb-8">
          Son güncelleme: 18 Mayıs 2026
        </p>

        <div className="prose-content space-y-6 text-night-200 leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              1. Hizmet Tanımı
            </h2>
            <p>
              ruyatevili (&quot;hizmet&quot;), kullanıcıların gördükleri rüyaları
              klasik tabir ilmi geleneği çerçevesinde sertifikalı bir yorumcu
              tarafından yorumlatabilecekleri bir platform sunar. Hizmet, token
              bazlı çalışan dijital bir abonelik sistemidir.
            </p>
            <p>
              Bu Kullanım Şartları, hizmetimizi kullanmanız sırasında bağlı kalmanız
              gereken kuralları ve sorumluluklarınızı tanımlar. Hizmeti kullanarak bu
              şartları kabul etmiş sayılırsınız.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              2. Hesap Oluşturma ve Kullanım
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Hizmeti kullanabilmek için <strong className="text-night-50">18
                yaşından büyük</strong> olmanız gerekir.
              </li>
              <li>
                Kayıt sırasında verdiğiniz bilgilerin doğru ve güncel olması zorunludur.
              </li>
              <li>
                Şifrenizin gizliliğinden ve hesabınızdan yapılan tüm işlemlerden
                <strong className="text-night-50"> siz sorumlusunuz</strong>.
              </li>
              <li>
                Bir kişi sadece <strong className="text-night-50">bir hesap</strong>{" "}
                açabilir. Çoklu hesap oluşturulduğu tespit edilirse hepsi kapatılır.
              </li>
              <li>Hesabınızı başkalarına devredemezsiniz veya satamazsınız.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              3. Token Sistemi
            </h2>
            <p>
              Hizmet, dijital token (jeton) bazlı çalışır. Tokenler:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Satın alındığında hesabınıza tanımlanır</li>
              <li>Rüya analize gönderdiğinizde 1 adet harcanır</li>
              <li>Geri ödemeye konu değildir (aşağıdaki istisnalar hariç)</li>
              <li>
                <strong className="text-night-50">Demlenmeye bırakılan</strong>{" "}
                rüyalar için tokeniniz otomatik olarak iade edilir
              </li>
              <li>Üçüncü kişilere devredilemez veya nakit olarak çekilemez</li>
              <li>
                Hesap kapatıldığında tüm tokenler iptal edilir, geri ödeme yapılmaz
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              4. Rüya Yorumlama Hizmeti
            </h2>
            <p>
              Rüya yorumları, klasik İslam tabir ilmi geleneğine (İmam Muhammed İbn
              Sirin&apos;den gelen ekol) dayanır.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Yorumlar <strong className="text-night-50">manevi rehberlik</strong>{" "}
                niteliğindedir, kesin bir kehanet veya geleceği bildiren bilgiler değildir.
              </li>
              <li>
                Hizmet <strong className="text-night-50">tıbbi, hukuki veya
                finansal tavsiye değildir</strong>. Bu konularda profesyonellerden
                destek almanız gerekir.
              </li>
              <li>
                Yorumcumuz rüyanızı uygun göremezse veya yeterli içerik bulamazsa
                <strong className="text-night-50">
                  {" "}
                  &quot;demlenmeye bırakma&quot;
                </strong>{" "}
                kararı verebilir; bu durumda tokeniniz iade edilir.
              </li>
              <li>
                Yorumlama süresi rüya yoğunluğuna göre değişir, garanti edilen bir
                süre yoktur. Genellikle 1-7 gün arasında cevap verilir.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              5. Ödeme ve İade Politikası
            </h2>

            <h3 className="text-night-50 font-medium mt-3 mb-2">5.1. Ödeme</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ödemeler Shopier güvenli ödeme altyapısı üzerinden alınır</li>
              <li>Türk Lirası (TL) bazında fiyatlandırma yapılır</li>
              <li>
                Satın alma sonrası tokenleriniz{" "}
                <strong className="text-night-50">en geç 24 saat içinde</strong>{" "}
                hesabınıza yüklenir
              </li>
            </ul>

            <h3 className="text-night-50 font-medium mt-3 mb-2">5.2. İade Şartları</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong className="text-night-50">Kullanılmamış tokenler</strong>{" "}
                satın alma tarihinden itibaren 14 gün içinde iade talep edilebilir
              </li>
              <li>
                <strong className="text-night-50">Kullanılmış tokenler</strong> (rüya
                analize gönderilmiş ve yorumlanmış) iade edilemez
              </li>
              <li>
                İade talepleri için{" "}
                <a
                  href="mailto:janysarry84@gmail.com"
                  className="text-gold-300 hover:text-gold-200 underline"
                >
                  janysarry84@gmail.com
                </a>{" "}
                adresine başvurun
              </li>
              <li>İade onaylanırsa 7 iş günü içinde işleme alınır</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              6. Kullanıcı Davranış Kuralları
            </h2>
            <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Başkalarının rüyalarını kendininki gibi paylaşmak</li>
              <li>Yorumcuya veya diğer kullanıcılara hakaret etmek</li>
              <li>Spam, virüs, kötü amaçlı içerik göndermek</li>
              <li>Sistemin güvenliğini test etmek veya açıklarını sömürmek</li>
              <li>Hizmeti yasadışı amaçlarla kullanmak</li>
              <li>Birden fazla hesap açıp hediye tokenlerle kötüye kullanım</li>
              <li>
                Yorumları izinsiz olarak çoğaltmak, yayımlamak veya ticari amaçla
                kullanmak
              </li>
            </ul>
            <p className="mt-3">
              Bu kuralların ihlali halinde hesabınız uyarısız kapatılabilir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              7. Fikri Mülkiyet
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Site tasarımı, logo ve içerikler ruyatevili&apos;ye aittir
              </li>
              <li>
                Yorumcumuzun yazdığı rüya tabirleri size kişiseldir; bunları
                çoğaltmak, yayımlamak yasaktır
              </li>
              <li>
                Yazdığınız rüya metinleri size aittir; ancak hizmeti vermek için
                gerekli olduğu sürece işlenmesine izin vermiş olursunuz
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              8. Sorumluluk Sınırları
            </h2>
            <p>
              Hizmet &quot;olduğu gibi&quot; sunulur. Aşağıdaki durumlardan sorumlu
              değiliz:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Yorumların kişisel hayatınızda alacağınız kararlara etkisinden doğan
                sonuçlar
              </li>
              <li>
                Geçici sistem kesintileri (bakım, sunucu sorunları, internet altyapısı)
              </li>
              <li>Üçüncü taraf hizmetlerindeki kesintiler (Supabase, Vercel, Shopier)</li>
              <li>Force majeure (doğal afet, yasal değişiklikler vb.)</li>
            </ul>
            <p className="mt-3">
              Sorumluluğumuz, en fazla son 12 ay içinde tarafımıza ödediğiniz tutarla
              sınırlıdır.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              9. Hesabın Sonlandırılması
            </h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Hesabınızı istediğiniz zaman silmek için bizimle iletişime geçebilirsiniz
              </li>
              <li>
                Kullanım şartlarını ihlal ettiğiniz tespit edilirse hesabınız uyarısız
                kapatılabilir
              </li>
              <li>
                Hesap kapatıldığında kullanılmamış tokenler iptal edilir, geri ödeme
                yapılmaz (zaten haksız tahsilat varsa hariç)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              10. Değişiklikler
            </h2>
            <p>
              Bu Kullanım Şartları zaman zaman güncellenebilir. Önemli değişiklikler
              için kullanıcılarımızı e-posta veya site içi bildirim ile bilgilendireceğiz.
              Güncellemeler sonrası hizmeti kullanmaya devam etmek, yeni şartları
              kabul ettiğiniz anlamına gelir.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              11. Uygulanacak Hukuk ve Yargı Yetkisi
            </h2>
            <p>
              Bu sözleşme, Türkiye Cumhuriyeti yasalarına tabidir. Doğabilecek
              uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
            </p>
            <p>
              Tüketici uyuşmazlıkları için Tüketici Hakem Heyeti veya Tüketici
              Mahkemeleri&apos;ne başvuru hakkınız saklıdır.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-gold-300 mb-3">
              12. İletişim
            </h2>
            <p>
              Bu Kullanım Şartları hakkında sorularınız için:
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
            Bu Kullanım Şartlarını okuduktan sonra anlaşılmayan herhangi bir nokta
            varsa, hizmeti kullanmadan önce bizimle iletişime geçin.
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-night-700">
          <Link href="/privacy" className="btn-secondary">
            🔒 Gizlilik Politikası
          </Link>
          <Link href="/" className="btn-ghost">
            ← Ana Sayfa
          </Link>
        </div>
      </article>
    </main>
  );
}
