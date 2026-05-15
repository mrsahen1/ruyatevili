"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth/register?error=${encodeURIComponent(getErrorMessage(error.message))}`);
  }

  redirect(
    "/auth/login?message=" +
      encodeURIComponent(
        "Kayıt başarılı! E-posta adresinize doğrulama linki gönderdik."
      )
  );
}

function getErrorMessage(msg: string): string {
  if (msg.includes("already registered") || msg.includes("already been registered"))
    return "Bu e-posta adresi zaten kayıtlı";
  if (msg.includes("Password should be"))
    return "Şifre en az 6 karakter olmalı";
  if (msg.includes("invalid email") || msg.includes("Invalid email"))
    return "Geçersiz e-posta adresi";
  return "Kayıt başarısız: " + msg;
}
