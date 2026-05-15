import { createClient } from "@/lib/supabase/server";

export async function SiteStats() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_site_stats").single<{
    total_dreams_this_week: number;
    total_dreams_answered: number;
    total_users: number;
  }>();

  // Hiç veri yoksa veya çok az ise gösterme (sahte istatistik olmasın)
  const thisWeek = data?.total_dreams_this_week ?? 0;
  const answered = data?.total_dreams_answered ?? 0;
  const users = data?.total_users ?? 0;

  // Eşik değeri — bu sayılardan azsa hiç gösterme
  if (users < 3 || answered < 2) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <StatCard
        icon="🌙"
        value={thisWeek}
        label="Bu Hafta Gelen Rüya"
      />
      <StatCard
        icon="✨"
        value={answered}
        label="Yorumlanan Rüya"
      />
      <StatCard
        icon="👥"
        value={users}
        label="Topluluk Üyesi"
      />
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="card text-center !p-3">
      <p className="text-2xl mb-1">{icon}</p>
      <p className="font-display text-2xl text-gold-300 leading-none">
        {value.toLocaleString("tr-TR")}
      </p>
      <p className="text-xs text-night-300 mt-1 leading-tight">{label}</p>
    </div>
  );
}
