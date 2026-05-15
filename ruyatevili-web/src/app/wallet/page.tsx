import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, TokenPackage, TokenTransaction } from "@/lib/types/database";

export default async function WalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const { data: packages } = await supabase
    .from("token_packages")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  const { data: transactions } = await supabase
    .from("token_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-3xl text-night-50">Cüzdanım</h1>
        <p className="text-night-300">Token bakiyenizi yönetin ve geçmiş işlemlerinizi görün</p>
      </div>

      {/* Bakiye */}
      <div className="card-elevated text-center py-8">
        <p className="text-sm text-night-300 mb-2">Mevcut Bakiye</p>
        <p className="font-display text-6xl text-gold-300">{profile?.token_balance ?? 0}</p>
        <p className="text-night-200 mt-2">Token</p>
      </div>

      {/* İndirim banner */}
      <div className="bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 border border-gold-400/40 rounded-2xl px-6 py-3 text-center">
        <p className="text-gold-100">
          🎉 <span className="font-display text-lg">Açılışa Özel</span> · Tüm paketlerde
          <span className="text-gold-300 font-bold mx-1">%90 İNDİRİM</span>
        </p>
      </div>

      {/* Paketler */}
      <div>
        <h2 className="font-display text-2xl text-night-50 mb-4">Token Paketleri</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages?.map((pkg: TokenPackage) => {
            const originalPrice = Number(pkg.price_try) * 10;
            return (
              <div
                key={pkg.id}
                className={`relative ${pkg.is_featured ? "card-elevated" : "card"}`}
              >
                {pkg.is_featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-400 text-night-950 text-xs font-medium rounded-full">
                    En Avantajlı
                  </div>
                )}
                <h3 className="font-display text-xl text-night-50 mb-3">{pkg.name}</h3>
                <div className="mb-4">
                  <p className="text-xs text-night-400 line-through">
                    {originalPrice.toLocaleString("tr-TR")} ₺
                  </p>
                  <span className="font-display text-3xl text-gold-300">
                    {Number(pkg.price_try).toLocaleString("tr-TR")}
                  </span>
                  <span className="text-night-300 ml-1">₺</span>
                  <p className="text-xs text-gold-400 mt-1 font-medium">%90 İNDİRİM</p>
                </div>
                <p className="text-sm text-night-200 mb-4">
                  {pkg.token_count} rüya hakkı
                </p>
                <PurchaseButton packageId={pkg.id} featured={pkg.is_featured} />
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-yellow-900/20 border border-yellow-700/30">
          <p className="text-yellow-200 text-sm">
            <strong>⚠️ Bilgilendirme:</strong> Ödeme entegrasyonu henüz tamamlanmadı.
            Token satın almak için lütfen iletişime geçin. Yakında Shopier üzerinden
            otomatik ödeme aktif olacak.
          </p>
        </div>
      </div>

      {/* İşlem geçmişi */}
      <div>
        <h2 className="font-display text-2xl text-night-50 mb-4">İşlem Geçmişi</h2>
        {!transactions || transactions.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-night-300">Henüz işlem geçmişi yok</p>
          </div>
        ) : (
          <div className="card divide-y divide-night-700">
            {transactions.map((tx: TokenTransaction) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PurchaseButton({ packageId, featured }: { packageId: string; featured: boolean }) {
  return (
    <button
      disabled
      className={`${featured ? "btn-primary" : "btn-secondary"} w-full text-sm opacity-50 cursor-not-allowed`}
      title="Ödeme sistemi henüz aktif değil"
    >
      Yakında
    </button>
  );
}

function TransactionRow({ tx }: { tx: TokenTransaction }) {
  const isPositive = tx.amount > 0;
  const date = new Date(tx.created_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const typeLabels: Record<string, string> = {
    purchase: "Satın Alma",
    spend: "Rüya Gönderimi",
    refund: "İade",
    admin_grant: "Hediye Token",
    admin_revoke: "İptal",
  };

  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-night-100 font-medium">{typeLabels[tx.type]}</p>
        <p className="text-xs text-night-400">
          {tx.description} · {date}
        </p>
      </div>
      <div className="text-right">
        <p className={`font-display text-xl ${isPositive ? "text-green-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}{tx.amount}
        </p>
        <p className="text-xs text-night-400">Kalan: {tx.balance_after}</p>
      </div>
    </div>
  );
}
