import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamWizard } from "@/components/DreamWizard";
import type { Profile } from "@/lib/types/database";
import Link from "next/link";

export default async function NewDreamPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const tokenBalance = profile?.token_balance ?? 0;
  const activeCount = profile?.active_dream_count ?? 0;
  const quota = profile?.dream_quota ?? 5;

  // Önkoşul kontrolleri
  if (tokenBalance < 1) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">🪙</p>
          <h1 className="font-display text-2xl text-night-50 mb-3">Token bakiyeniz yetersiz</h1>
          <p className="text-night-200 mb-6">
            Rüya gönderebilmek için en az 1 token satın almanız gerekiyor.
          </p>
          <Link href="/wallet" className="btn-primary">Token Satın Al</Link>
        </div>
      </div>
    );
  }

  if (activeCount >= quota) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center py-12">
          <p className="text-5xl mb-4">📊</p>
          <h1 className="font-display text-2xl text-night-50 mb-3">Rüya kotanız dolu</h1>
          <p className="text-night-200 mb-6">
            Mevcut {activeCount} rüyanız yanıtlanmayı bekliyor. Kotanızın açılması için
            beklemeniz gerekiyor.
          </p>
          <Link href="/dashboard" className="btn-secondary">Panele Dön</Link>
        </div>
      </div>
    );
  }

  return <DreamWizard />;
}
