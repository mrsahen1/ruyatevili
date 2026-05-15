import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthenticatedHeader } from "@/components/AuthenticatedHeader";
import type { Profile } from "@/lib/types/database";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<{ is_admin: boolean }>();

  if (!profile?.is_admin) redirect("/dashboard");

  return (
    <div className="min-h-screen">
      <AuthenticatedHeader />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
