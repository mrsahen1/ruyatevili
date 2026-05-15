import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AuthenticatedHeader } from "@/components/AuthenticatedHeader";

export default async function WalletLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen">
      <AuthenticatedHeader />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
