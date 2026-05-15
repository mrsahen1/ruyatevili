import Link from "next/link";
import Image from "next/image";
import { login } from "./actions";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string; redirectTo?: string };
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
          <h1 className="font-display text-3xl text-night-50 mb-2 text-center">Giriş Yap</h1>
          <p className="text-center text-night-300 mb-8 text-sm">
            Hesabınıza erişerek rüyalarınızı yorumlatmaya devam edin
          </p>

          {searchParams.error && (
            <div className="mb-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
              {searchParams.error}
            </div>
          )}
          {searchParams.message && (
            <div className="mb-4 p-3 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
              {searchParams.message}
            </div>
          )}

          <form action={login} className="space-y-4">
            {searchParams.redirectTo && (
              <input type="hidden" name="redirectTo" value={searchParams.redirectTo} />
            )}

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
              <div className="flex items-center justify-between mb-2">
                <label className="label !mb-0" htmlFor="password">Şifre</label>
                <Link href="/auth/reset-password" className="text-sm text-gold-300 hover:text-gold-200">
                  Şifremi unuttum
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Giriş Yap
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-night-700 text-center">
            <p className="text-night-300 text-sm">
              Hesabınız yok mu?{" "}
              <Link href="/auth/register" className="text-gold-300 hover:text-gold-200 font-medium">
                Hemen kayıt olun
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
