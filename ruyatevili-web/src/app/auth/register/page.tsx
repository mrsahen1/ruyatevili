import Link from "next/link";
import Image from "next/image";
import { signup } from "./actions";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-8">
          <div className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="ruyatevili" width={48} height={48} priority />
            <span className="font-display text-2xl text-night-50">ruyatevili</span>
          </div>
        </Link>

        <div className="card-elevated">
          <h1 className="font-display text-3xl text-night-50 mb-2 text-center">Kayıt Ol</h1>
          <p className="text-center text-night-300 mb-2 text-sm">
            Hemen başlayın, ilk rüyanızı yorumlatın
          </p>
          <p className="text-center mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 text-xs font-medium">
              🎉 Açılışa özel %90 indirim aktif
            </span>
          </p>

          {searchParams.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
              {searchParams.error}
            </div>
          )}

          <form action={signup} className="space-y-4">
            <div>
              <label className="label" htmlFor="full_name">Ad Soyad</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                autoComplete="name"
                className="input-field"
                placeholder="Adınız Soyadınız"
              />
            </div>

            <div>
              <label className="label" htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input-field"
                placeholder="ornek@email.com"
              />
            </div>

            <div>
              <label className="label" htmlFor="password">Şifre</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                className="input-field"
                placeholder="En az 6 karakter"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Hesap Oluştur
            </button>

            <p className="text-xs text-night-400 text-center leading-relaxed">
              Kayıt olarak gizlilik politikamızı kabul etmiş sayılırsınız.
            </p>
          </form>

          <div className="mt-6 pt-6 border-t border-night-700 text-center">
            <p className="text-night-300 text-sm">
              Zaten hesabınız var mı?{" "}
              <Link href="/auth/login" className="text-gold-300 hover:text-gold-200 font-medium">
                Giriş yapın
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
