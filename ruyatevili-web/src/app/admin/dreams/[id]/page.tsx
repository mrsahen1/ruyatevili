import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Dream } from "@/lib/types/database";
import { AdminDreamForm } from "@/components/AdminDreamForm";

export default async function AdminDreamDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: dream } = await supabase
    .from("dreams")
    .select("*")
    .eq("id", id)
    .single<Dream>();

  if (!dream) notFound();

  const formData = dream.form_data as any;
  const submittedDate = new Date(dream.submitted_at).toLocaleString("tr-TR");

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link href="/admin/dreams" className="btn-ghost inline-flex">
        ← Listeye Dön
      </Link>

      {/* Kullanıcı bilgileri */}
      <div className="card">
        <h2 className="font-display text-xl text-gold-300 mb-4">Kullanıcı Profili</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <Info label="Yaş" value={formData?.section1_profile?.age} />
          <Info label="Cinsiyet" value={formData?.section1_profile?.gender} />
          <Info label="Medeni Durum" value={formData?.section1_profile?.marital_status} />
          <Info label="Meslek" value={formData?.section1_profile?.occupation} />
          <Info label="Zihinsel Odak" value={formData?.section1_profile?.mental_focus} />
          <Info
            label="İbadet Durumu"
            value={formData?.section1_profile?.spiritual_state?.worship_regularity}
          />
        </div>
        {formData?.section1_profile?.spiritual_state?.recent_sin_or_regret && (
          <div className="mt-4 p-3 rounded-lg bg-night-900/40 border border-night-700">
            <p className="text-xs text-night-400 mb-1">Vicdani Yük</p>
            <p className="text-night-100 text-sm">
              {formData.section1_profile.spiritual_state.recent_sin_or_regret}
            </p>
          </div>
        )}
        {formData?.section1_profile?.spiritual_state?.recent_good_deed_or_prayer && (
          <div className="mt-2 p-3 rounded-lg bg-night-900/40 border border-night-700">
            <p className="text-xs text-night-400 mb-1">Manevi İyilik</p>
            <p className="text-night-100 text-sm">
              {formData.section1_profile.spiritual_state.recent_good_deed_or_prayer}
            </p>
          </div>
        )}
      </div>

      {/* Günlük yaşantı */}
      <div className="card">
        <h2 className="font-display text-xl text-gold-300 mb-4">Günlük Yaşantı</h2>
        <div className="space-y-3 text-sm">
          {formData?.section2_daily_life?.day_residue && (
            <Info label="Gündüz Kalıntısı" value={formData.section2_daily_life.day_residue} block />
          )}
          {formData?.section2_daily_life?.current_question_or_wish && (
            <Info
              label="Cevap Aradığı Soru"
              value={formData.section2_daily_life.current_question_or_wish}
              block
            />
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            {formData?.section2_daily_life?.health_state?.was_tired && (
              <span className="badge badge-gray">Yorgun</span>
            )}
            {formData?.section2_daily_life?.health_state?.was_sick && (
              <span className="badge badge-gray">Hasta</span>
            )}
            {formData?.section2_daily_life?.health_state?.was_stressed && (
              <span className="badge badge-gray">Stresli</span>
            )}
            {formData?.section2_daily_life?.health_state?.heavy_meal_before_sleep && (
              <span className="badge badge-gray">Ağır Yemek</span>
            )}
          </div>
        </div>
      </div>

      {/* Teknik koordinatlar */}
      <div className="card">
        <h2 className="font-display text-xl text-gold-300 mb-4">Teknik Koordinatlar</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Info label="Vakit" value={formData?.section3_timing?.dream_time} />
          <Info label="Yatış" value={formData?.section3_timing?.sleep_position?.body_position} />
          <Info
            label="Abdest"
            value={formData?.section3_timing?.sleep_position?.had_ablution ? "Vardı" : "Yoktu"}
          />
          <Info
            label="Niyet"
            value={formData?.section3_timing?.special_intention?.type}
          />
        </div>
        {formData?.section3_timing?.special_intention?.intention_text && (
          <div className="mt-3 p-3 rounded-lg bg-night-900/40 border border-night-700">
            <p className="text-xs text-night-400 mb-1">Niyet Detayı</p>
            <p className="text-night-100 text-sm">
              {formData.section3_timing.special_intention.intention_text}
            </p>
          </div>
        )}
      </div>

      {/* Rüya metni + Sahne detayları */}
      <div className="card-elevated">
        <h2 className="font-display text-2xl text-gold-300 mb-4">🌙 Rüya</h2>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <Info label="Gerçeklik Hissi" value={formData?.section4_content?.reality_feel} />
          <Info label="Mevsim" value={formData?.section4_content?.time_in_dream?.season} />
          <Info
            label="Mekan"
            value={formData?.section4_content?.location?.description}
          />
          <Info label="Renkler" value={formData?.section4_content?.colors_and_light} />
        </div>

        {formData?.section4_content?.key_symbols?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-night-400 mb-2">Anahtar Semboller</p>
            <div className="flex flex-wrap gap-2">
              {formData.section4_content.key_symbols.map((sym: string, i: number) => (
                <span key={i} className="badge bg-gold-400/10 text-gold-200 border border-gold-400/20">
                  {sym}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 rounded-lg bg-night-900/40 border border-night-700">
          <p className="text-xs text-night-400 mb-2">Rüya Anlatımı</p>
          <p className="text-night-50 whitespace-pre-wrap leading-relaxed">
            {dream.dream_text}
          </p>
        </div>
      </div>

      {/* Kalp pusulası */}
      <div className="card">
        <h2 className="font-display text-xl text-gold-300 mb-4">Kalp Pusulası</h2>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <Info label="İlk Duygu" value={formData?.section5_feelings?.first_emotion} />
          <Info label="Fiziksel Tepki" value={formData?.section5_feelings?.physical_reaction} />
          <Info label="Unutulmazlık" value={formData?.section5_feelings?.memorability} />
        </div>
      </div>

      {/* META */}
      <div className="card">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="text-night-400 text-xs">Gönderim</p>
            <p className="text-night-100">{submittedDate}</p>
          </div>
          <div>
            <p className="text-night-400 text-xs">Durum</p>
            <p className="text-night-100">{dream.status}</p>
          </div>
        </div>
      </div>

      {/* CEVAP FORMU */}
      <AdminDreamForm dream={dream} />
    </div>
  );
}

function Info({ label, value, block }: { label: string; value: any; block?: boolean }) {
  if (!value) return null;
  return (
    <div className={block ? "" : ""}>
      <p className="text-xs text-night-400">{label}</p>
      <p className="text-night-100">{String(value)}</p>
    </div>
  );
}
