import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, Dream } from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: dreams } = await supabase
    .from("dreams")
    .select("*")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false })
    .limit(20);

  const tokenBalance = profile?.token_balance ?? 0;
  const activeCount = profile?.active_dream_count ?? 0;
  const quota = profile?.dream_quota ?? 5;
  const quotaPercent = (activeCount / quota) * 100;
  const quotaFull = activeCount >= quota;
  const noTokens = tokenBalance < 1;
  const canSubmit = !quotaFull && !noTokens;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Karşılama */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-night-50 mb-1">
          Hoş geldiniz{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-night-300">Rüya kontrol paneliniz</p>
      </div>

      {/* Üst kartlar — Cüzdan + Kota */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card-elevated">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-night-300">Cüzdanım</p>
              <p className="font-display text-4xl text-gold-300 mt-1">
                {tokenBalance}
              </p>
              <p className="text-sm text-night-200 mt-1">
                {tokenBalance === 1 ? "Token" : "Token"} kullanılabilir
              </p>
            </div>
            <span className="text-3xl">🪙</span>
          </div>
          <Link href="/wallet" className="btn-secondary text-sm mt-4 w-full">
            Token Satın Al
          </Link>
        </div>

        <div className="card">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-sm text-night-300">Rüya Kotası</p>
              <p className="font-display text-4xl text-night-50 mt-1">
                {activeCount}<span className="text-night-400 text-2xl">/{quota}</span>
              </p>
              <p className="text-sm text-night-200 mt-1">
                {quotaFull
                  ? "Kotanız dolu"
                  : `${quota - activeCount} rüya gönderebilirsiniz`}
              </p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
          {/* Çubuk */}
          <div className="mt-4 h-2 bg-night-900 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${quotaFull ? "bg-red-500" : "bg-gold-400"}`}
              style={{ width: `${quotaPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Yeni Rüya Butonu */}
      <div className="card text-center py-8">
        {canSubmit ? (
          <>
            <p className="font-display text-xl text-gold-300 mb-2 italic">
              "Detaylar silikleşmeden rüyanızı yazın!"
            </p>
            <p className="text-night-200 mb-4">
              Uyandığınız o ilk saniye kalbinizde ne hissettiniz? Duygularınızı hemen aktarın.
            </p>
            <Link href="/dream/new" className="btn-primary text-lg px-8 py-4">
              ✍️ Yeni Rüya Gönder
            </Link>
            <p className="text-xs text-night-400 mt-3">
              Rüya gönderdiğinizde 1 token harcanır
            </p>
          </>
        ) : noTokens ? (
          <>
            <p className="text-night-200 mb-4">
              Rüya gönderebilmek için önce token satın almalısınız
            </p>
            <Link href="/wallet" className="btn-primary text-lg px-8 py-4">
              🪙 Token Satın Al
            </Link>
          </>
        ) : (
          <>
            <p className="text-night-200 mb-4">
              Rüya kotanız dolu. Mevcut rüyalarınız yanıtlanana kadar yeni rüya gönderemezsiniz.
            </p>
            <button disabled className="btn-primary text-lg px-8 py-4 opacity-50 cursor-not-allowed">
              Kota Dolu
            </button>
          </>
        )}
      </div>

      {/* Rüya Kayıtları */}
      <div>
        <h2 className="font-display text-2xl text-night-50 mb-4">Rüya Kayıtlarım</h2>

        {!dreams || dreams.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">🌙</p>
            <p className="text-night-200">Henüz rüya göndermediniz.</p>
            <p className="text-night-400 text-sm mt-2">
              İlk rüyanızı gönderdiğinizde burada listelenir.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {dreams.map((dream: Dream) => (
              <DreamListItem key={dream.id} dream={dream} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DreamListItem({ dream }: { dream: Dream }) {
  const statusConfig: Record<string, { label: string; badge: string; icon: string }> = {
    submitted: { label: "Beklemede", badge: "badge-yellow", icon: "⏳" },
    in_review: { label: "İnceleniyor", badge: "badge-yellow", icon: "🔍" },
    answered: { label: "Cevaplandı", badge: "badge-green", icon: "✅" },
    marinating: { label: "Demlenmeye Bırakıldı", badge: "badge-gray", icon: "🍵" },
  };

  const config = statusConfig[dream.status];
  const date = new Date(dream.submitted_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Link
      href={`/dream/${dream.id}`}
      className="card hover:border-gold-400/40 transition-all group block"
    >
      <div className="flex items-start gap-4">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={config.badge}>{config.label}</span>
            <span className="text-xs text-night-400">{date}</span>
            {dream.token_refunded && (
              <span className="badge badge-gray">Token İade Edildi</span>
            )}
          </div>
          <p className="text-night-100 line-clamp-2 leading-relaxed">
            {dream.dream_text.substring(0, 200)}
            {dream.dream_text.length > 200 ? "..." : ""}
          </p>
        </div>
        <span className="text-night-400 group-hover:text-gold-300 transition-colors">→</span>
      </div>
    </Link>
  );
}
