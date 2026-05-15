import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/SignOutButton";
import type { Profile } from "@/lib/types/database";

export async function AuthenticatedHeader() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  return (
    <header className="border-b border-night-700/50 bg-night-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image src="/logo.png" alt="ruyatevili" width={36} height={36} priority />
          <span className="font-display text-lg text-night-50 hidden sm:inline">ruyatevili</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/wallet"
            className="flex items-center gap-2 px-3 py-2 bg-night-800/60 hover:bg-night-700/60 border border-gold-400/20 rounded-lg transition-all"
          >
            <span className="text-lg">🪙</span>
            <span className="text-night-50 font-medium">
              {profile?.token_balance ?? 0}
            </span>
            <span className="text-night-300 text-sm hidden sm:inline">Token</span>
          </Link>

          {profile?.is_admin && (
            <Link
              href="/admin/dreams"
              className="px-3 py-2 bg-gold-400/10 hover:bg-gold-400/20 border border-gold-400/30 rounded-lg text-gold-300 text-sm transition-all"
            >
              Yönetim
            </Link>
          )}

          <SignOutButton />
        </div>
      </div>
    </header>
  );
}
