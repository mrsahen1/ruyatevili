import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Dream, Profile } from "@/lib/types/database";

export default async function JournalPage({
  searchParams,
}: {
  searchParams: { sort?: string; saved?: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  // Filtreleme: en yeni veya en eski
  const sort = searchParams.sort === "oldest" ? "asc" : "desc";

  // SADECE 'journal' statüsündeki rüyaları çek (askıdakileri)
  const { data: journalDreams } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "journal")
    .order("submitted_at", { ascending: sort === "asc" });

  const tokenBalance = profile?.token_balance ?? 0;
  const dreams = (journalDreams ?? []) as Dream[];
  const hasJournal = dreams.length > 0;
  const justSaved = searchParams.saved === "1";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl text-night-50 flex items-center gap-3">
            📓 Rüya Günlüğüm
          </h1>
          <p className="text-night-300 mt-1">
            Askıda bekleyen rüyalarınız — istediğiniz zaman analize gönderebilirsiniz
          </p>
        </div>
        <Link href="/dream/new" className="btn-primary">
          ✍️ Yeni Rüya
        </Link>
      </div>

      {/* Başarı mesajı */}
      {justSaved && (
        <div className="p-4 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
          ✅ Rüyanız günlüğünüze kaydedildi. Detaylar tazeyken eklediniz, şimdi
          istediğiniz zaman analize gönderebilirsiniz.
        </div>
      )}

      {/* Filtreleme */}
      {hasJournal && (
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-night-300">
            {dreams.length} rüya askıda bekliyor
          </p>
          <div className="flex gap-2 text-sm">
            <Link
              href="/dream/journal?sort=newest"
              className={`px-3 py-1 rounded-lg transition ${
                sort === "desc"
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                  : "bg-night-800/40 text-night-300 hover:text-night-100 border border-night-700"
              }`}
            >
              En Yeni Önce
            </Link>
            <Link
              href="/dream/journal?sort=oldest"
              className={`px-3 py-1 rounded-lg transition ${
                sort === "asc"
                  ? "bg-gold-400/20 text-gold-300 border border-gold-400/40"
                  : "bg-night-800/40 text-night-300 hover:text-night-100 border border-night-700"
              }`}
            >
              En Eski Önce
            </Link>
          </div>
        </div>
      )}

      {/* İçerik */}
      {!hasJournal ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📓</p>
          <h2 className="font-display text-xl text-night-50 mb-2">
            Günlüğünüz boş
          </h2>
          <p className="text-night-300 mb-6 max-w-md mx-auto">
            Henüz askıda bekleyen rüyanız yok. Yeni bir rüya kaydederek
            günlüğünüzü oluşturmaya başlayın.
          </p>
          <Link href="/dream/new" className="btn-primary">
            ✍️ İlk Rüyanı Kaydet
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {dreams.map((dream) => (
            <JournalDreamCard
              key={dream.id}
              dream={dream}
              canSubmit={tokenBalance >= 1}
            />
          ))}
        </div>
      )}

      {/* Bilgi kutusu */}
      <div className="card bg-night-800/40 border-night-700">
        <h3 className="font-display text-lg text-gold-300 mb-2">
          💡 Günlük nedir?
        </h3>
        <p className="text-sm text-night-300 leading-relaxed">
          Rüya günlüğünüz — uyanır uyanmaz detayları silikleşmeden rüyalarınızı
          sıcağı sıcağına yazabileceğiniz alandır. Token harcanmadan tüm rüyalarınızı
          kayıt altına alır, hazır olduğunuzda istediğinizi <strong>1 token</strong> ile
          analize gönderirsiniz.
        </p>
      </div>
    </div>
  );
}

function JournalDreamCard({
  dream,
  canSubmit,
}: {
  dream: Dream;
  canSubmit: boolean;
}) {
  const date = new Date(dream.submitted_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      href={`/dream/${dream.id}`}
      className="card hover:border-gold-400/40 transition-all group block"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl">⏳</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="badge badge-gray">Askıda</span>
            <span className="text-xs text-night-400">{date}</span>
          </div>
          <p className="text-night-100 line-clamp-3 leading-relaxed">
            {dream.dream_text.substring(0, 300)}
            {dream.dream_text.length > 300 ? "..." : ""}
          </p>
          {canSubmit && (
            <p className="text-xs text-gold-300/80 mt-3 flex items-center gap-1">
              🕊️ Tıklayın, analize gönderme seçeneği görünür
            </p>
          )}
        </div>
        <span className="text-night-400 group-hover:text-gold-300 transition-colors">
          →
        </span>
      </div>
    </Link>
  );
}
