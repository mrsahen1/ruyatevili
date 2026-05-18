import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SendForAnalysisButton } from "@/components/SendForAnalysisButton";
import type { Dream, Profile } from "@/lib/types/database";

export default async function DreamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: dream } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", user.id)
    .single<Dream>();

  if (!dream) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const statusInfo = {
    journal:    { label: "Günlükte", icon: "⏳", color: "gray" },
    submitted:  { label: "Beklemede", icon: "🕊️", color: "yellow" },
    in_review:  { label: "İnceleniyor", icon: "🔍", color: "yellow" },
    answered:   { label: "Cevaplandı", icon: "✅", color: "green" },
    marinating: { label: "Demlenmeye Bırakıldı", icon: "🍵", color: "gray" },
  };

  const info = statusInfo[dream.status];
  const submittedDate = new Date(dream.submitted_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const tokenBalance = profile?.token_balance ?? 0;
  const quotaFull = (profile?.active_dream_count ?? 0) >= (profile?.dream_quota ?? 5);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Üst */}
      <div className="flex items-start justify-between flex-wrap gap-2">
        <Link href="/dashboard" className="btn-ghost text-sm">
          ← Panele Dön
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{info.icon}</span>
          <span className={`badge badge-${info.color}`}>{info.label}</span>
        </div>
      </div>

      {/* Rüya Metni */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h1 className="font-display text-2xl text-night-50">Rüyam</h1>
          <span className="text-sm text-night-400">{submittedDate}</span>
        </div>
        <p className="text-night-100 leading-relaxed whitespace-pre-wrap">
          {dream.dream_text}
        </p>
      </div>

      {/* JOURNAL durumu — Analize Gönder butonu */}
      {dream.status === "journal" && (
        <div className="card-elevated border-gold-400/40 text-center">
          <p className="text-5xl mb-3">🕊️</p>
          <h2 className="font-display text-xl text-night-50 mb-2">
            Bu rüya günlüğünüzde askıda
          </h2>
          <p className="text-night-200 leading-relaxed mb-6">
            Detaylar tazeyken analize göndermek isterseniz, aşağıdan 1 token harcayarak
            uzman yorumcuya iletebilirsiniz.
          </p>
          <SendForAnalysisButton
            dreamId={dream.id}
            hasTokens={tokenBalance >= 1}
            quotaFull={quotaFull}
          />
          {tokenBalance < 1 && (
            <p className="text-xs text-night-400 mt-3">
              Yetersiz token bakiyesi. <Link href="/wallet" className="text-gold-300 underline">Token al</Link>.
            </p>
          )}
          {quotaFull && (
            <p className="text-xs text-night-400 mt-3">
              Rüya kotanız dolu. Mevcut analizlerinizi bekleyin.
            </p>
          )}
        </div>
      )}

      {/* Yorumlama */}
      {dream.status === "answered" && dream.interpretation && (
        <div className="card-elevated border-gold-400/30">
          <h2 className="font-display text-2xl text-gold-300 mb-4 flex items-center gap-2">
            📜 Yorum
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-night-100 leading-relaxed whitespace-pre-wrap">
              {dream.interpretation}
            </p>
          </div>
        </div>
      )}

      {/* Demlenmeye bırakıldı */}
      {dream.status === "marinating" && (
        <div className="card border-yellow-700/40 bg-yellow-900/10">
          <h2 className="font-display text-xl text-yellow-200 mb-3 flex items-center gap-2">
            🍵 Rüyanız Demlenmeye Bırakıldı
          </h2>
          {dream.marinating_message && (
            <p className="text-night-200 leading-relaxed mb-4 whitespace-pre-wrap">
              {dream.marinating_message}
            </p>
          )}
          <p className="text-sm text-night-300">
            Bu rüya için tokeniniz iade edildi. Yeni rüyalarınızı bekliyoruz.
          </p>
        </div>
      )}

      {/* Beklemede / İnceleniyor */}
      {(dream.status === "submitted" || dream.status === "in_review") && (
        <div className="card text-center py-8">
          <p className="text-4xl mb-3">{info.icon}</p>
          <h2 className="font-display text-xl text-night-50 mb-2">
            {dream.status === "submitted"
              ? "Rüyanız sırada"
              : "Rüyanız inceleniyor"}
          </h2>
          <p className="text-night-300">
            {dream.status === "submitted"
              ? "Yorumcumuz en kısa sürede inceleyecek. Yorumunuz hazır olduğunda burada görünecek."
              : "Yorumcumuz rüyanızı inceliyor. Yakında cevap hazır olacak."}
          </p>
        </div>
      )}
    </div>
  );
}
