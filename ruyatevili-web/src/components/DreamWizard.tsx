"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DreamFormData } from "@/lib/types/database";

const STEPS = [
  { num: 1, title: "Zemin ve Koordinatlar", desc: "Uyku öncesi ve vakit" },
  { num: 2, title: "Sahne ve Kalp Pusulası", desc: "Atmosfer ve uyanış" },
  { num: 3, title: "Rüyanın Metni", desc: "Hikayeyi sansürsüzce aktarın" },
];

interface Props {
  hasTokens: boolean; // Token bakiyesi var mı (Analize Gönder butonu için)
  quotaFull: boolean; // Kotası dolu mu (Analize Gönder kilitli olur)
}

export function DreamWizard({ hasTokens, quotaFull }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [data, setData] = useState<DreamFormData>({
    schema_version: "2.0",
    step1_ground: {},
    step2_scene: {
      first_emotion: "huzur",
    },
    step3_text: {
      dream_narrative: "",
    },
  });

  function updateStep1(patch: Partial<DreamFormData["step1_ground"]>) {
    setData((prev) => ({
      ...prev,
      step1_ground: { ...prev.step1_ground, ...patch },
    }));
  }

  function updateStep2(patch: Partial<DreamFormData["step2_scene"]>) {
    setData((prev) => ({
      ...prev,
      step2_scene: { ...prev.step2_scene, ...patch },
    }));
  }

  function updateStep3(patch: Partial<DreamFormData["step3_text"]>) {
    setData((prev) => ({
      ...prev,
      step3_text: { ...prev.step3_text, ...patch },
    }));
  }

  function next() {
    setError(null);
    if (step < 3) setStep(step + 1);
  }

  function prev() {
    setError(null);
    if (step > 1) setStep(step - 1);
  }

  // İki farklı submit:
  // 1. saveToJournal: status='journal' - token harcamaz
  // 2. submitForAnalysis: status='submitted' - 1 token harcar
  async function handleSubmit(asAnalysis: boolean) {
    const narrative = data.step3_text.dream_narrative.trim();
    if (narrative.length < 50) {
      setError("Rüyanızı en az 50 karakter olarak anlatmalısınız");
      setStep(3);
      return;
    }

    if (asAnalysis) {
      if (!hasTokens) {
        setError("Yetersiz token bakiyesi. Önce token satın alın veya günlüğe kaydedin.");
        return;
      }
      if (quotaFull) {
        setError("Rüya kotanız dolu. Günlüğe kaydedebilir veya mevcut analizlerinizi bekleyebilirsiniz.");
        return;
      }
    }

    setSubmitting(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Oturum bulunamadı");

      const { error: insertError } = await supabase.from("dreams").insert({
        user_id: user.id,
        form_data: data,
        dream_text: narrative,
        status: asAnalysis ? "submitted" : "journal",
      });

      if (insertError) {
        if (insertError.message.includes("Yetersiz token")) {
          throw new Error("Token bakiyeniz yetersiz");
        }
        if (insertError.message.includes("Rüya kotanız")) {
          throw new Error("Rüya kotanız dolu");
        }
        throw insertError;
      }

      // Başarılı - günlüğe veya dashboard'a yönlendir
      if (asAnalysis) {
        router.push("/dashboard?submitted=1");
      } else {
        router.push("/dream/journal?saved=1");
      }
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Rüya kaydedilemedi. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Adım göstergesi */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl text-night-50">Yeni Rüya</h1>
          <span className="text-sm text-night-300">Adım {step} / 3</span>
        </div>
        <div className="flex gap-2">
          {STEPS.map((s) => (
            <div
              key={s.num}
              className={`flex-1 h-1 rounded-full transition-all ${
                s.num <= step ? "bg-gold-400" : "bg-night-700"
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-night-300 mt-3">
          <span className="text-gold-300 font-medium">{STEPS[step - 1].title}</span> ·{" "}
          {STEPS[step - 1].desc}
        </p>
      </div>

      <div className="card animate-fade-in">
        {step === 1 && <Step1 data={data} update={updateStep1} />}
        {step === 2 && <Step2 data={data} update={updateStep2} />}
        {step === 3 && <Step3 data={data} update={updateStep3} />}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Navigasyon */}
      <div className="flex justify-between mt-6 gap-3 flex-wrap">
        {step > 1 ? (
          <button onClick={prev} className="btn-secondary" disabled={submitting}>
            ← Geri
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button onClick={next} className="btn-primary">
            İleri →
          </button>
        ) : (
          // Son adımda iki buton: Günlüğe Kaydet + Analize Gönder
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => handleSubmit(false)}
              className="btn-secondary"
              disabled={submitting}
              title="Token harcanmaz, askıya alınır"
            >
              {submitting ? "Kaydediliyor..." : "📓 Günlüğe Kaydet"}
            </button>
            <button
              onClick={() => handleSubmit(true)}
              className="btn-primary"
              disabled={submitting || !hasTokens || quotaFull}
              title={
                !hasTokens
                  ? "Token bakiyeniz yok"
                  : quotaFull
                    ? "Rüya kotanız dolu"
                    : "1 token harcanır"
              }
            >
              {submitting ? "Gönderiliyor..." : "🕊️ Analize Gönder (1 Token)"}
            </button>
          </div>
        )}
      </div>

      {/* Bilgi notu son adımda */}
      {step === 3 && (
        <div className="mt-4 p-4 rounded-lg bg-night-800/40 border border-night-700">
          <p className="text-xs text-night-300 leading-relaxed">
            <strong className="text-gold-300">📓 Günlüğe Kaydet:</strong> Rüyanız askıda
            bekletilir, dilediğiniz zaman analize gönderebilirsiniz. Token harcanmaz.
            <br />
            <strong className="text-gold-300">🕊️ Analize Gönder:</strong> Rüyanız anında
            uzman yorumcuya iletilir. 1 token harcanır.
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// ADIM 1: ZEMİN VE KOORDİNATLAR
// ============================================================
function Step1({ data, update }: { data: DreamFormData; update: any }) {
  const s = data.step1_ground;
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-night-50 mb-4">Zemin ve Koordinatlar</h2>

      {/* Zihinsel odak */}
      <div>
        <label className="label">
          Dün veya yatmadan önce zihninizi çok meşgul eden, dert ettiğiniz veya izlediğiniz belirgin bir şey oldu mu?
        </label>
        <div className="flex gap-2 flex-wrap">
          <ChipSelect
            selected={s.mental_focus === "yogun"}
            onClick={() => update({ mental_focus: "yogun" })}
            label="Evet, çok yoğundu"
          />
          <ChipSelect
            selected={s.mental_focus === "siradan"}
            onClick={() => update({ mental_focus: "siradan" })}
            label="Hayır, sıradan bir gündü"
          />
        </div>
        {s.mental_focus === "yogun" && (
          <input
            type="text"
            value={s.mental_focus_detail || ""}
            onChange={(e) => update({ mental_focus_detail: e.target.value })}
            placeholder="Kısaca yazabilirsiniz..."
            className="input-field mt-3"
          />
        )}
      </div>

      <hr className="border-night-700" />

      {/* Fiziksel durum */}
      <div>
        <label className="label">Yatmadan önceki fiziksel durumunuz nasıldı?</label>
        <p className="text-xs text-night-400 mb-2">Birden fazla seçilebilir</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "cok_yorgun", label: "Çok Yorgun" },
            { key: "agir_yemek", label: "Ağır Yemek Yedim" },
            { key: "ilac_aldim", label: "İlaç Aldım" },
            { key: "stresliydim", label: "Stresliydim" },
            { key: "normal", label: "Normal" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={!!s.physical_state?.[opt.key as keyof typeof s.physical_state]}
              onClick={() =>
                update({
                  physical_state: {
                    ...s.physical_state,
                    [opt.key]: !s.physical_state?.[opt.key as keyof typeof s.physical_state],
                  },
                })
              }
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* Uyku vakti */}
      <div>
        <label className="label">Rüyayı ne zaman gördünüz?</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "gece_ilk_yarisi", label: "Gecenin İlk Yarısı" },
            { key: "teheccud", label: "Teheccüd Vakti" },
            { key: "sabaha_karsi", label: "Sabaha Karşı" },
            { key: "kaylule", label: "Gündüz (Kaylule)" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.dream_time === opt.key}
              onClick={() => update({ dream_time: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* Yatış şekli */}
      <div>
        <label className="label">Uykuya geçiş haliniz nasıldı?</label>
        <p className="text-xs text-night-400 mb-2">Birden fazla seçilebilir</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "abdestliydim", label: "Abdestliydim" },
            { key: "duali_yattim", label: "Dualı Yattım" },
            { key: "istihare_hacet", label: "İstihare/Hacet Niyetiyle" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={!!s.sleep_preparation?.[opt.key as keyof typeof s.sleep_preparation]}
              onClick={() =>
                update({
                  sleep_preparation: {
                    ...s.sleep_preparation,
                    [opt.key]: !s.sleep_preparation?.[opt.key as keyof typeof s.sleep_preparation],
                  },
                })
              }
              label={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADIM 2: SAHNE VE KALP PUSULASI
// ============================================================
function Step2({ data, update }: { data: DreamFormData; update: any }) {
  const s = data.step2_scene;
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl text-night-50 mb-4">Sahne ve Kalp Pusulası</h2>

      {/* Gerçeklik */}
      <div>
        <label className="label">Rüyanın atmosferi nasıldı?</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "gercek_gibi", label: "Tamamen Gerçek Gibiydi" },
            { key: "lucid", label: "Rüyada Olduğumu Biliyordum (Lucid)" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.reality_feel === opt.key}
              onClick={() => update({ reality_feel: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* Mekan */}
      <div>
        <label className="label">Mekan neresiydi?</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "bilinen", label: "Bildiğim Bir Yer" },
            { key: "mechul", label: "Tanımadığım/Meçhul Bir Yer" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.location === opt.key}
              onClick={() => update({ location: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* Renkler */}
      <div>
        <label className="label">Rüyada baskın olan bir renk veya ışık var mıydı?</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "siyah_karanlik", label: "🌑 Siyah/Karanlık" },
            { key: "beyaz_aydinlik", label: "⚪ Beyaz/Aydınlık" },
            { key: "yesil", label: "🟢 Yeşil" },
            { key: "kirmizi", label: "🔴 Kırmızı" },
            { key: "yok", label: "Dikkat Çekici Bir Renk Yoktu" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.dominant_color === opt.key}
              onClick={() => update({ dominant_color: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* KALP PUSULASI - EN KRİTİK */}
      <div className="p-4 rounded-lg bg-gold-400/5 border border-gold-400/20">
        <label className="label !text-gold-300">
          🧭 Uyandığınız ilk saniye kalbinizde ne hissettiniz? *
        </label>
        <p className="text-xs text-night-400 mb-3">Bu en kritik veridir, dikkatle seçin</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "korku", label: "Korku" },
            { key: "huzur", label: "Huzur" },
            { key: "sevinc", label: "Sevinç" },
            { key: "tiksinme", label: "Tiksinme" },
            { key: "agirlik", label: "Ağırlık/Sıkıntı" },
            { key: "ferahlik", label: "Ferahlık" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.first_emotion === opt.key}
              onClick={() => update({ first_emotion: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>

      <hr className="border-night-700" />

      {/* Fiziksel tepki */}
      <div>
        <label className="label">Nasıl uyandınız?</label>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "sakin", label: "Sakin" },
            { key: "terleyerek", label: "Terleyerek" },
            { key: "nefes_nefese", label: "Nefes Nefese" },
            { key: "aglayarak", label: "Ağlayarak" },
            { key: "gulerek", label: "Gülerek" },
          ].map((opt) => (
            <ChipSelect
              key={opt.key}
              selected={s.physical_reaction === opt.key}
              onClick={() => update({ physical_reaction: opt.key })}
              label={opt.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADIM 3: RÜYANIN METNİ
// ============================================================
function Step3({ data, update }: { data: DreamFormData; update: any }) {
  const charCount = (data.step3_text.dream_narrative || "").length;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-2">Rüyanın Metni</h2>
      <p className="text-night-300 text-sm mb-6">
        Şimdi rüyanızı, aklınızda kalan nesneleri, kişileri ve olay örgüsünü detaylıca yazın.
        Hikayeyi sansürsüzce aktarın.
      </p>

      <div>
        <label className="label">Rüya Detayı *</label>
        <p className="text-xs text-night-400 mb-2">En az 50 karakter</p>
        <textarea
          required
          rows={12}
          value={data.step3_text.dream_narrative || ""}
          onChange={(e) => update({ dream_narrative: e.target.value })}
          placeholder="Rüyamda kendimi... bulduğumu gördüm. Sonra..."
          className="input-field"
        />
        <p
          className={`text-xs mt-1 text-right ${
            charCount < 50 ? "text-night-400" : "text-green-400"
          }`}
        >
          {charCount} karakter {charCount < 50 && `(en az 50)`}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// CHIP COMPONENT
// ============================================================
function ChipSelect({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
        selected
          ? "bg-gold-400/20 text-gold-200 border-gold-400/50"
          : "bg-night-900/40 text-night-200 border-night-700 hover:border-night-500"
      }`}
    >
      {label}
    </button>
  );
}
