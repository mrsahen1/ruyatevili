import Link from "next/link";
import Image from "next/image";
import { resetPassword } from "./actions";

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
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
          <h1 className="font-display text-3xl text-night-50 mb-2 text-center">Şifremi Unuttum</h1>
          <p className="text-center text-night-300 mb-8 text-sm">
            E-posta adresinize sıfırlama linki gönderelim
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

          <form action={resetPassword} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">E-posta</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                placeholder="ornek@email.com"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Sıfırlama Linki Gönder
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-night-700 text-center">
            <Link href="/auth/login" className="text-gold-300 hover:text-gold-200 text-sm">
              ← Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
