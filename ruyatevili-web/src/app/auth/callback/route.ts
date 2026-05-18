import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Supabase auth callback route
// Bu route şu durumlarda çağrılır:
// 1. E-posta doğrulama (yeni kayıt onayı) → dashboard'a yönlendir
// 2. Şifre sıfırlama linki → şifre değiştirme sayfasına yönlendir
// 3. Magic link → dashboard'a yönlendir

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const type = requestUrl.searchParams.get("type"); // "recovery" = şifre sıfırlama
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Şifre sıfırlama akışı: şifre değiştirme sayfasına yönlendir
  if (type === "recovery") {
    return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password`);
  }

  // Diğer akışlar (e-posta doğrulama, magic link vs.)
  return NextResponse.redirect(`${requestUrl.origin}${next}`);
}
