import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DreamWizard } from "@/components/DreamWizard";
import type { Profile } from "@/lib/types/database";

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

  // Artık hep erişilebilir (token=0 bile olsa günlüğe kaydedebilir)
  return (
    <DreamWizard
      hasTokens={tokenBalance >= 1}
      quotaFull={activeCount >= quota}
    />
  );
}
