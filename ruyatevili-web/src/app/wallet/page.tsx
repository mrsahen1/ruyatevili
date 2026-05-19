import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WalletPurchaseFlow } from "@/components/WalletPurchaseFlow";
import { CountdownBanner } from "@/components/CountdownBanner";
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

  const userEmail = user.email || "";
  const tokenBalance = profile?.token_balance ?? 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <CountdownBanner />

      {/* BAŞLIK */}
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-night-50 mb-1">
          Token Cüzdanı
        </h1>
        <p className="text-night-300">Mevcut bakiyenizi yönetin ve yeni token alın</p>
      </div>

      {/* MEVCUT BAKİYE */}
      <div className="card-elevated text-center">
        <p className="text-sm text-night-300 mb-2">Mevcut Bakiye</p>
        <p className="font-display text-6xl text-gold-300 mb-1">{tokenBalance}</p>
        <p className="text-sm text-night-200">Token Kullanılabilir</p>
      </div>

      {/* PAKETLER + SATIN ALMA AKIŞI - Client Component */}
      <WalletPurchaseFlow
        packages={(packages || []) as TokenPackage[]}
        userEmail={userEmail}
      />

      {/* İŞLEM GEÇMİŞİ */}
      <div>
        <h2 className="font-display text-2xl text-night-50 mb-4">
          📋 İşlem Geçmişi
        </h2>

        {!transactions || transactions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-4xl mb-3">📋</p>
            <p className="text-night-200">Henüz işlem bulunmuyor.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx: TokenTransaction) => (
              <TransactionItem key={tx.id} tx={tx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TransactionItem({ tx }: { tx: TokenTransaction }) {
  const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
    purchase: { label: "Satın Alma", icon: "🛒", color: "text-green-300" },
    spend: { label: "Harcama", icon: "✍️", color: "text-night-200" },
    refund: { label: "İade", icon: "↩️", color: "text-blue-300" },
    admin_grant: { label: "Admin Yüklemesi", icon: "🎁", color: "text-gold-300" },
    admin_revoke: { label: "Admin İptali", icon: "🚫", color: "text-red-300" },
  };

  const config = typeConfig[tx.type] || typeConfig.spend;
  const date = new Date(tx.created_at).toLocaleString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="card flex items-start gap-4">
      <span className="text-2xl">{config.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <p className={`text-sm font-medium ${config.color}`}>{config.label}</p>
          <p className={`font-display text-lg ${tx.amount > 0 ? "text-green-300" : "text-night-300"}`}>
            {tx.amount > 0 ? "+" : ""}
            {tx.amount}
          </p>
        </div>
        {tx.description && (
          <p className="text-xs text-night-300 mt-1">{tx.description}</p>
        )}
        <p className="text-xs text-night-400 mt-1">{date}</p>
      </div>
    </div>
  );
}
