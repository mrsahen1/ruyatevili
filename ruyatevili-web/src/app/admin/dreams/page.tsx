import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Dream } from "@/lib/types/database";

export default async function AdminDreamsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const filter = params.status || "submitted";

  const supabase = await createClient();

  let query = supabase
    .from("dreams")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (filter !== "all") {
    query = query.eq("status", filter);
  }

  const { data: dreams } = await query.limit(50);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-night-50">Yönetim Paneli</h1>
        <Link href="/dashboard" className="btn-ghost">← Kullanıcı paneline geç</Link>
      </div>

      {/* Filtreler */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: "submitted", label: "Bekleyenler" },
          { key: "in_review", label: "İncelenenler" },
          { key: "answered", label: "Cevaplananlar" },
          { key: "marinating", label: "Demlenmeye Bırakılanlar" },
          { key: "all", label: "Tümü" },
        ].map((opt) => (
          <Link
            key={opt.key}
            href={`/admin/dreams?status=${opt.key}`}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              filter === opt.key
                ? "bg-gold-400 text-night-950 font-medium"
                : "bg-night-800/60 text-night-200 hover:bg-night-700/60 border border-night-700"
            }`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      {/* Liste */}
      {!dreams || dreams.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-night-300">Bu kategoride rüya yok.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {dreams.map((dream: Dream) => (
            <AdminDreamItem key={dream.id} dream={dream} />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminDreamItem({ dream }: { dream: Dream }) {
  const date = new Date(dream.submitted_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const profile = dream.form_data?.section1_profile as any;

  return (
    <Link
      href={`/admin/dreams/${dream.id}`}
      className="card hover:border-gold-400/40 transition-all group block"
    >
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="badge badge-gray">{date}</span>
            {profile && (
              <span className="text-xs text-night-300">
                {profile.age} yaş · {profile.gender === "erkek" ? "Erkek" : "Kadın"} · {profile.occupation}
              </span>
            )}
          </div>
          <p className="text-night-100 line-clamp-2 leading-relaxed">
            {dream.dream_text.substring(0, 250)}...
          </p>
        </div>
        <span className="text-night-400 group-hover:text-gold-300 transition-colors">→</span>
      </div>
    </Link>
  );
}
