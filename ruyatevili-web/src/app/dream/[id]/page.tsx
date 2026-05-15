import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Dream } from "@/lib/types/database";

export default async function DreamDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: dream } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", id)
    .single<Dream>();

  if (!dream) notFound();

  const statusInfo = {
    submitted: { label: "Beklemede", icon: "⏳", color: "yellow" },
    in_review: { label: "İnceleniyor", icon: "🔍", color: "yellow" },
    answered: { label: "Cevaplandı", icon: "✅", color: "green" },
    marinating: { label: "Demlenmeye Bırakıldı", icon: "🍵", color: "gray" },
  }[dream.status];

  const submittedDate = new Date(dream.submitted_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <Link href="/dashboard" className="btn-ghost inline-flex">
        ← Panele Dön
      </Link>

      {/* Durum kartı */}
      <div className="card">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{statusInfo.icon}</span>
              <span className={`badge badge-${statusInfo.color}`}>
                {statusInfo.label}
              </span>
              {dream.token_refunded && (
                <span className="badge badge-gray">Token İade Edildi</span>
              )}
            </div>
            <p className="text-sm text-night-300">Gönderildi: {submittedDate}</p>
          </div>
        </div>
      </div>

      {/* Rüya metni */}
      <div className="card">
        <h2 className="font-display text-xl text-gold-300 mb-3">Rüyanız</h2>
        <p className="text-night-100 whitespace-pre-wrap leading-relaxed">
          {dream.dream_text}
        </p>
      </div>

      {/* Cevap */}
      {dream.status === "answered" && dream.interpretation && (
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📜</span>
            <h2 className="font-display text-2xl text-gold-300">Yorum</h2>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-night-50 whitespace-pre-wrap leading-relaxed text-lg">
              {dream.interpretation}
            </p>
          </div>
          {dream.answered_at && (
            <p className="text-xs text-night-400 mt-6 text-right">
              Cevaplandı: {new Date(dream.answered_at).toLocaleString("tr-TR")}
            </p>
          )}
        </div>
      )}

      {/* Demlenme mesajı */}
      {dream.status === "marinating" && dream.marinating_message && (
        <div className="card border-gold-400/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🍵</span>
            <h2 className="font-display text-xl text-gold-300">Demlenmeye Bırakıldı</h2>
          </div>
          <p className="text-night-100 whitespace-pre-wrap leading-relaxed mb-4">
            {dream.marinating_message}
          </p>
          <div className="p-3 rounded-lg bg-green-900/20 border border-green-700/30 text-green-200 text-sm">
            <strong>Bilgilendirme:</strong> Bu rüya için harcadığınız 1 token cüzdanınıza
            iade edildi.
          </div>
        </div>
      )}

      {/* Beklemede mesajı */}
      {(dream.status === "submitted" || dream.status === "in_review") && (
        <div className="card text-center py-8">
          <p className="text-5xl mb-3">🌙</p>
          <p className="font-display text-xl text-night-50 mb-2">
            {dream.status === "in_review"
              ? "Rüyanız inceleniyor"
              : "Rüyanız yorum bekliyor"}
          </p>
          <p className="text-night-300 max-w-md mx-auto">
            Yorumunuz hazır olduğunda burada görünecek ve size bildirim göndereceğiz.
            Bu süreç klasik kaynakların özenle incelenmesi için zaman alabilir.
          </p>
        </div>
      )}
    </div>
  );
}
