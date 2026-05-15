"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/auth/login?error=${encodeURIComponent(getErrorMessage(error.message))}`);
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

function getErrorMessage(msg: string): string {
  if (msg.includes("Invalid login credentials")) return "E-posta veya şifre hatalı";
  if (msg.includes("Email not confirmed")) return "Lütfen önce e-posta adresinizi doğrulayın";
  return "Giriş yapılamadı: " + msg;
}
