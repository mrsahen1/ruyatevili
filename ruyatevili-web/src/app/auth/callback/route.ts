import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

// Supabase auth callback route
// Bu route şu durumlarda çağrılır:
// 1. E-posta doğrulama (signup) → dashboard'a yönlendir
// 2. Şifre sıfırlama (recovery) → şifre değiştirme sayfasına yönlendir
// 3. Magic link → dashboard'a yönlendir

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  // Eski stil: code parametresi (OAuth)
  const code = requestUrl.searchParams.get("code");

  // Yeni stil: token_hash parametresi (PKCE flow - e-posta linkleri)
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type") as EmailOtpType | null;

  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  const supabase = await createClient();

  // OAuth code akışı
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("Auth callback (code) error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Email link (token_hash) akışı
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      console.error("Auth callback (token_hash) error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Şifre sıfırlama akışı: şifre değiştirme sayfasına yönlendir
  if (type === "recovery") {
    return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`);
  }

  // Diğer akışlar (e-posta doğrulama, magic link, signup)
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
