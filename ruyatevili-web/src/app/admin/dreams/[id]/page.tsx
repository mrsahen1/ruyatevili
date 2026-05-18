import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminDreamForm } from "@/components/AdminDreamForm";
import type { Dream, Profile } from "@/lib/types/database";

export default async function AdminDreamDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single<Pick<Profile, "is_admin">>();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: dream } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", params.id)
    .single<Dream>();
  if (!dream) notFound();

  const { data: dreamUser } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", dream.user_id)
    .single<Pick<Profile, "full_name" | "phone">>();

  const formData = (dream.form_data || {}) as any;
  const schemaVersion = formData.schema_version || "1.0";
  const isV2 = schemaVersion === "2.0";

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <Link href="/admin/dreams" className="btn-ghost text-sm">
          ← Listeye Dön
        </Link>
        <div className="flex items-center gap-2 text-sm text-night-300">
          <span>Şema: v{schemaVersion}</span>
        </div>
      </div>

      {/* YENİ 3 ADIMLI FORM (v2.0) */}
      {isV2 && (
        <>
          {/* ADIM 1: ZEMİN VE KOORDİNATLAR */}
          <Section title="📍 Zemin ve Koordinatlar (Uyku Öncesi)">
            <DataRow
              label="Zihinsel Odak (Gündüz Kalıntısı)"
              value={
                formData.step1_ground?.mental_focus === "yogun"
                  ? `Çok yoğundu${formData.step1_ground?.mental_focus_detail ? ` — ${formData.step1_ground.mental_focus_detail}` : ""}`
                  : formData.step1_ground?.mental_focus === "siradan"
                    ? "Sıradan bir gündü"
                    : null
              }
            />
            <DataRow
              label="Fiziksel Durum"
              value={formatPhysicalState(formData.step1_ground?.physical_state)}
            />
            <DataRow
              label="Uyku Vakti"
              value={formatDreamTime(formData.step1_ground?.dream_time)}
            />
            <DataRow
              label="Yatış Şekli ve Niyet"
              value={formatSleepPrep(formData.step1_ground?.sleep_preparation)}
            />
          </Section>

          {/* ADIM 2: SAHNE VE KALP PUSULASI */}
          <Section title="🎭 Sahne ve Kalp Pusulası">
            <DataRow
              label="Gerçeklik Hissi"
              value={
                formData.step2_scene?.reality_feel === "gercek_gibi"
                  ? "Tamamen gerçek gibiydi"
                  : formData.step2_scene?.reality_feel === "lucid"
                    ? "Rüyada olduğunu biliyordu (Lucid)"
                    : null
              }
            />
            <DataRow
              label="Mekan"
              value={
                formData.step2_scene?.location === "bilinen"
                  ? "Bildiği bir yer"
                  : formData.step2_scene?.location === "mechul"
                    ? "Tanımadığı / Meçhul"
                    : null
              }
            />
            <DataRow
              label="Baskın Renk / Işık"
              value={formatColor(formData.step2_scene?.dominant_color)}
            />
            <DataRow
              label="🧭 İlk Hissedilen Duygu (KRİTİK)"
              value={formatEmotion(formData.step2_scene?.first_emotion)}
              highlight
            />
            <DataRow
              label="Fiziksel Tepki (Uyanış Anı)"
              value={formatReaction(formData.step2_scene?.physical_reaction)}
            />
          </Section>
        </>
      )}

      {/* ESKİ 5 ADIMLI FORM (v1.0) — geriye dönük uyumluluk */}
      {!isV2 && (
        <>
          <Section title="👤 Kullanıcı Profili">
            <DataRow label="Ad Soyad" value={dreamUser?.full_name} />
            <DataRow label="Yaş" value={formData.user_profile?.age?.toString()} />
            <DataRow label="Cinsiyet" value={formData.user_profile?.gender} />
            <DataRow label="Medeni Hal" value={formData.user_profile?.marital_status} />
            <DataRow label="Meslek" value={formData.user_profile?.occupation} />
          </Section>

          <Section title="📅 Günlük Yaşantı">
            <DataRow label="Genel Hava" value={formData.daily_life?.recent_mood} />
            <DataRow label="Önemli Olaylar" value={formData.daily_life?.recent_events} />
            <DataRow
              label="Beklenti / Endişe"
              value={formData.daily_life?.current_concerns}
            />
          </Section>

          <Section title="🌙 Teknik Koordinatlar (Eski Form)">
            <DataRow
              label="Abdest"
              value={formData.technical?.had_ablution ? "Vardı" : "Yoktu"}
            />
            <DataRow
              label="Uyumadan Önce Okunan"
              value={formData.technical?.pre_sleep_reading}
            />
            <DataRow label="Uyku Saati" value={formData.technical?.sleep_time} />
          </Section>
        </>
      )}

      {/* RÜYA METNİ */}
      <Section title="🌙 Rüya">
        <div className="bg-night-900/60 border border-gold-400/20 rounded-lg p-4">
          <p className="text-xs text-night-400 mb-2">Rüya Anlatımı</p>
          <p className="text-night-100 leading-relaxed whitespace-pre-wrap font-medium">
            {dream.dream_text}
          </p>
        </div>
      </Section>

      {/* META */}
      <div className="card flex items-center justify-between flex-wrap gap-3 text-sm">
        <div>
          <p className="text-night-400 text-xs">Gönderim</p>
          <p className="text-night-100 font-medium">
            {new Date(dream.submitted_at).toLocaleString("tr-TR")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-night-400 text-xs">Durum</p>
          <p className="text-gold-300 font-medium">{dream.status}</p>
        </div>
      </div>

      {/* YORUM FORMU - sadece henüz cevaplanmamışsa */}
      {(dream.status === "submitted" || dream.status === "in_review") && (
        <AdminDreamForm dream={dream} />
      )}

      {/* MEVCUT CEVAP - cevaplanmışsa göster */}
      {dream.status === "answered" && dream.interpretation && (
        <Section title="📜 Mevcut Yorum">
          <p className="text-night-100 leading-relaxed whitespace-pre-wrap">
            {dream.interpretation}
          </p>
        </Section>
      )}

      {dream.status === "marinating" && dream.marinating_message && (
        <Section title="🍵 Demlenmeye Bırakma Notu">
          <p className="text-night-100 leading-relaxed whitespace-pre-wrap">
            {dream.marinating_message}
          </p>
        </Section>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTS
// ============================================================

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <h2 className="font-display text-xl text-night-50 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function DataRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string | null | undefined;
  highlight?: boolean;
}) {
  if (!value || value === "—" || value.trim() === "") {
    return (
      <div className="flex items-start gap-3 flex-wrap">
        <span className="text-sm text-night-400 min-w-[180px]">{label}</span>
        <span className="text-sm text-night-500 italic">— belirtilmemiş</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 flex-wrap ${
        highlight ? "bg-gold-400/10 border border-gold-400/30 rounded-lg p-3" : ""
      }`}
    >
      <span className="text-sm text-night-300 min-w-[180px]">{label}</span>
      <span
        className={`text-sm font-medium flex-1 ${
          highlight ? "text-gold-200" : "text-night-50"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// FORMAT YARDIMCILARI (Yeni 3 adımlı form)
// ============================================================

function formatPhysicalState(state: any): string | null {
  if (!state) return null;
  const labels: Record<string, string> = {
    cok_yorgun: "Çok Yorgun",
    agir_yemek: "Ağır Yemek Yedim",
    ilac_aldim: "İlaç Aldım",
    stresliydim: "Stresliydim",
    normal: "Normal",
  };
  const selected = Object.keys(labels)
    .filter((k) => state[k] === true)
    .map((k) => labels[k]);
  return selected.length > 0 ? selected.join(", ") : null;
}

function formatDreamTime(time: string | undefined): string | null {
  if (!time) return null;
  const map: Record<string, string> = {
    gece_ilk_yarisi: "Gecenin İlk Yarısı",
    teheccud: "Teheccüd Vakti",
    sabaha_karsi: "Sabaha Karşı",
    kaylule: "Gündüz (Kaylule)",
  };
  return map[time] || time;
}

function formatSleepPrep(prep: any): string | null {
  if (!prep) return null;
  const labels: Record<string, string> = {
    abdestliydim: "Abdestliydi",
    duali_yattim: "Dualı Yattı",
    istihare_hacet: "İstihare/Hacet Niyetiyle",
  };
  const selected = Object.keys(labels)
    .filter((k) => prep[k] === true)
    .map((k) => labels[k]);
  return selected.length > 0 ? selected.join(", ") : null;
}

function formatColor(color: string | undefined): string | null {
  if (!color) return null;
  const map: Record<string, string> = {
    siyah_karanlik: "🌑 Siyah / Karanlık",
    beyaz_aydinlik: "⚪ Beyaz / Aydınlık",
    yesil: "🟢 Yeşil",
    kirmizi: "🔴 Kırmızı",
    yok: "Dikkat çekici bir renk yoktu",
  };
  return map[color] || color;
}

function formatEmotion(emotion: string | undefined): string | null {
  if (!emotion) return null;
  const map: Record<string, string> = {
    korku: "😨 Korku",
    huzur: "😌 Huzur",
    sevinc: "😊 Sevinç",
    tiksinme: "🤢 Tiksinme",
    agirlik: "😔 Ağırlık / Sıkıntı",
    ferahlik: "✨ Ferahlık",
  };
  return map[emotion] || emotion;
}

function formatReaction(reaction: string | undefined): string | null {
  if (!reaction) return null;
  const map: Record<string, string> = {
    sakin: "Sakin",
    terleyerek: "Terleyerek",
    nefes_nefese: "Nefes Nefese",
    aglayarak: "Ağlayarak",
    gulerek: "Gülerek",
  };
  return map[reaction] || reaction;
}
