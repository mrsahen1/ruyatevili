"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"request" | "update">("request");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Eğer kullanıcı email linki ile geldiyse (giriş yapmış oturum varsa) yeni şifre koyma moduna geç
  useEffect(() => {
    async function checkSession() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setMode("update");
      }
    }
    checkSession();
  }, []);

  // İlk form: e-posta gir, sıfırlama linki gönder
  async function handleRequestReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const supabase = createClient();
      const redirectUrl =
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?type=recovery`
          : "";

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      if (error) throw error;

      setSuccess(
        "Şifre sıfırlama linki e-posta adresinize gönderildi. Lütfen gelen kutunuzu kontrol edin (spam klasörüne de bakın)."
      );
      setEmail("");
    } catch (e: any) {
      setError(e.message || "Bir hata oluştu, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  // İkinci form: yeni şifre koy
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Şifreler eşleşmiyor");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setSuccess("Şifreniz başarıyla değiştirildi. Panele yönlendiriliyorsunuz...");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (e: any) {
      setError(e.message || "Şifre değiştirilemedi, lütfen tekrar deneyin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <Image src="/logo.png" alt="RUYATEVİLİ" width={48} height={48} />
          <span className="font-display text-2xl text-night-50 tracking-widest uppercase">
            ruyatevili
          </span>
        </Link>

        <div className="card-elevated">
          <h1 className="font-display text-2xl text-night-50 mb-2">
            {mode === "request" ? "Şifremi Unuttum" : "Yeni Şifre Belirle"}
          </h1>
          <p className="text-night-300 text-sm mb-6">
            {mode === "request"
              ? "E-posta adresinizi yazın, size sıfırlama linki gönderelim."
              : "Yeni şifrenizi belirleyin."}
          </p>

          {mode === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <label className="label">E-posta Adresi</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="input-field"
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full"
              >
                {loading ? "Gönderiliyor..." : "Sıfırlama Linki Gönder"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <label className="label">Yeni Şifre</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="input-field"
                  disabled={loading}
                  minLength={6}
                />
              </div>

              <div>
                <label className="label">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Şifreyi tekrar yazın"
                  className="input-field"
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-3 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !newPassword || !confirmPassword}
                className="btn-primary w-full"
              >
                {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-night-700 text-center">
            <Link
              href="/auth/login"
              className="text-sm text-night-300 hover:text-gold-300 transition-colors"
            >
              ← Giriş sayfasına dön
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-night-300">Yükleniyor...</p></div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
