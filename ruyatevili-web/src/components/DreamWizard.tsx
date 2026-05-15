"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { DreamFormData } from "@/lib/types/database";

const STEPS = [
  { num: 1, title: "Profil", desc: "Kimlik ve maneviyat" },
  { num: 2, title: "Günlük Yaşantı", desc: "Bilinçaltı taraması" },
  { num: 3, title: "Teknik Koordinatlar", desc: "Uyku ortamı ve zamanlama" },
  { num: 4, title: "Sahne Analizi", desc: "Rüyanın dokusu" },
  { num: 5, title: "Kalp Pusulası", desc: "Uyanış ve hissiyat" },
];

export function DreamWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state — tüm bölümler tek bir state'te
  const [data, setData] = useState<Partial<DreamFormData>>({
    schema_version: "1.0",
    section1_profile: {
      age: 25,
      gender: "erkek",
      marital_status: "bekar",
      occupation: "",
    },
    section2_daily_life: { health_state: {} },
    section3_timing: { sleep_position: {}, special_intention: { type: "yok" } },
    section4_content: { dream_narrative: "" },
    section5_feelings: { first_emotion: "huzur" },
  });

  function update<K extends keyof DreamFormData>(section: K, patch: Partial<DreamFormData[K]>) {
    setData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...patch },
    }));
  }

  function next() {
    setError(null);
    if (step < 5) setStep(step + 1);
  }

  function prev() {
    setError(null);
    if (step > 1) setStep(step - 1);
  }

  async function submit() {
    // Validasyon
    if (!data.section1_profile?.occupation) {
      setError("Mesleğinizi belirtmelisiniz");
      setStep(1);
      return;
    }
    const narrative = data.section4_content?.dream_narrative?.trim() ?? "";
    if (narrative.length < 50) {
      setError("Rüyanızı en az 50 karakter olarak anlatmalısınız");
      setStep(4);
      return;
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
        status: "submitted",
      });

      if (insertError) {
        // Trigger hatalarını yakala
        if (insertError.message.includes("Yetersiz token")) {
          throw new Error("Token bakiyeniz yetersiz");
        }
        if (insertError.message.includes("Rüya kotanız")) {
          throw new Error("Rüya kotanız dolu");
        }
        throw insertError;
      }

      // Başarılı — dashboard'a yönlendir
      router.push("/dashboard?submitted=1");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Rüya gönderilemedi. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Adım göstergesi */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="font-display text-2xl text-night-50">Yeni Rüya</h1>
          <span className="text-sm text-night-300">Adım {step} / 5</span>
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
        {step === 1 && <Section1 data={data} update={update} />}
        {step === 2 && <Section2 data={data} update={update} />}
        {step === 3 && <Section3 data={data} update={update} />}
        {step === 4 && <Section4 data={data} update={update} />}
        {step === 5 && <Section5 data={data} update={update} />}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <button onClick={prev} className="btn-secondary" disabled={submitting}>
            ← Geri
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button onClick={next} className="btn-primary">
            İleri →
          </button>
        ) : (
          <button onClick={submit} className="btn-primary" disabled={submitting}>
            {submitting ? "Gönderiliyor..." : "🌙 Rüyayı Gönder (1 Token)"}
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================================
// BÖLÜM 1: PROFIL
// ============================================================
function Section1({ data, update }: { data: any; update: any }) {
  const p = data.section1_profile;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-4">Kimlik ve Maneviyat</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Yaşınız *</label>
          <input
            type="number" min={10} max={120} required
            value={p.age}
            onChange={(e) => update("section1_profile", { age: parseInt(e.target.value) || 0 })}
            className="input-field"
          />
        </div>
        <div>
          <label className="label">Cinsiyet *</label>
          <select
            value={p.gender}
            onChange={(e) => update("section1_profile", { gender: e.target.value })}
            className="input-field"
          >
            <option value="erkek">Erkek</option>
            <option value="kadin">Kadın</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Medeni Durum *</label>
        <select
          value={p.marital_status}
          onChange={(e) => update("section1_profile", { marital_status: e.target.value })}
          className="input-field"
        >
          <option value="bekar">Bekar</option>
          <option value="evli">Evli</option>
          <option value="dul">Dul</option>
          <option value="bosanmis">Boşanmış</option>
        </select>
      </div>

      <div>
        <label className="label">Meslek / Meşguliyet *</label>
        <input
          type="text" required
          value={p.occupation}
          onChange={(e) => update("section1_profile", { occupation: e.target.value })}
          placeholder="Mühendis, öğretmen, öğrenci..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Zihninizi en çok ne meşgul ediyor?</label>
        <textarea rows={2}
          value={p.mental_focus || ""}
          onChange={(e) => update("section1_profile", { mental_focus: e.target.value })}
          placeholder="Hayatınızdaki ana mesele veya odak noktanız..."
          className="input-field"
        />
      </div>

      <hr className="border-night-700 my-6" />
      <h3 className="font-display text-lg text-gold-300 mb-3">Manevi Durum</h3>

      <div>
        <label className="label">İbadetleriniz ne durumda?</label>
        <select
          value={p.spiritual_state?.worship_regularity || ""}
          onChange={(e) =>
            update("section1_profile", {
              spiritual_state: { ...p.spiritual_state, worship_regularity: e.target.value },
            })
          }
          className="input-field"
        >
          <option value="">Belirtmek istemiyorum</option>
          <option value="duzenli">Düzenli</option>
          <option value="gevsek">Gevşek</option>
          <option value="arayista">Arayışta</option>
        </select>
      </div>

      <div>
        <label className="label">
          Son günlerde vicdanen rahatsız olduğunuz bir günah veya hata var mı?
          <span className="text-night-400 text-xs ml-2">(Opsiyonel, mahrem kalır)</span>
        </label>
        <textarea rows={2}
          value={p.spiritual_state?.recent_sin_or_regret || ""}
          onChange={(e) =>
            update("section1_profile", {
              spiritual_state: { ...p.spiritual_state, recent_sin_or_regret: e.target.value },
            })
          }
          className="input-field"
        />
      </div>

      <div>
        <label className="label">
          Son günlerde içinizi ferahlatan bir hayır veya dua var mı?
        </label>
        <textarea rows={2}
          value={p.spiritual_state?.recent_good_deed_or_prayer || ""}
          onChange={(e) =>
            update("section1_profile", {
              spiritual_state: { ...p.spiritual_state, recent_good_deed_or_prayer: e.target.value },
            })
          }
          className="input-field"
        />
      </div>
    </div>
  );
}

// ============================================================
// BÖLÜM 2: GÜNLÜK YAŞANTI
// ============================================================
function Section2({ data, update }: { data: any; update: any }) {
  const d = data.section2_daily_life;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-4">Günlük Yaşantı ve Bilinçaltı</h2>

      <div>
        <label className="label">Gündüz Kalıntısı</label>
        <p className="text-xs text-night-400 mb-2">
          Rüyayı gördüğünüz gün/öncesi bu konularda konuşma yaptınız mı, izlediniz mi?
        </p>
        <textarea rows={2}
          value={d.day_residue || ""}
          onChange={(e) => update("section2_daily_life", { day_residue: e.target.value })}
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Cevabını aradığınız büyük bir soru veya dileğiniz var mı?</label>
        <textarea rows={2}
          value={d.current_question_or_wish || ""}
          onChange={(e) => update("section2_daily_life", { current_question_or_wish: e.target.value })}
          className="input-field"
        />
      </div>

      <hr className="border-night-700 my-6" />
      <h3 className="font-display text-lg text-gold-300 mb-3">Sağlık ve Beslenme</h3>
      <p className="text-xs text-night-400 mb-4">
        Rüyayı gördüğünüz gece durumunuz nasıldı?
      </p>

      <div className="grid grid-cols-2 gap-3">
        {[
          { key: "was_tired", label: "Çok yorgundum" },
          { key: "was_sick", label: "Hastaydım" },
          { key: "was_stressed", label: "Stresliydim" },
          { key: "heavy_meal_before_sleep", label: "Ağır yemek yedim" },
        ].map((item) => (
          <label
            key={item.key}
            className="flex items-center gap-2 p-3 rounded-lg bg-night-900/40 border border-night-700 cursor-pointer hover:border-gold-400/40"
          >
            <input
              type="checkbox"
              checked={d.health_state?.[item.key] || false}
              onChange={(e) =>
                update("section2_daily_life", {
                  health_state: { ...d.health_state, [item.key]: e.target.checked },
                })
              }
              className="w-4 h-4 accent-gold-400"
            />
            <span className="text-night-100 text-sm">{item.label}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="label">Düzenli kullandığınız ilaç var mı?</label>
        <input type="text"
          value={d.health_state?.current_medication || ""}
          onChange={(e) =>
            update("section2_daily_life", {
              health_state: { ...d.health_state, current_medication: e.target.value },
            })
          }
          placeholder="Yok / ilaç adı"
          className="input-field"
        />
      </div>
    </div>
  );
}

// ============================================================
// BÖLÜM 3: TEKNİK KOORDİNATLAR
// ============================================================
function Section3({ data, update }: { data: any; update: any }) {
  const t = data.section3_timing;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-4">Uyku Ortamı ve Zamanlama</h2>

      <div>
        <label className="label">Rüyayı ne zaman gördünüz?</label>
        <select
          value={t.dream_time || ""}
          onChange={(e) => update("section3_timing", { dream_time: e.target.value })}
          className="input-field"
        >
          <option value="">Seçiniz</option>
          <option value="gece_ilk_yarisi">Gecenin ilk yarısı</option>
          <option value="teheccud">Teheccüd vakti (gecenin son üçte biri)</option>
          <option value="sabah_ezanina_yakin">Sabah ezanına yakın</option>
          <option value="kaylule">Gündüz uykusu (Kaylule)</option>
          <option value="bilmiyorum">Bilmiyorum</option>
        </select>
      </div>

      <hr className="border-night-700 my-6" />
      <h3 className="font-display text-lg text-gold-300 mb-3">Yatış Şekli</h3>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex items-center gap-2 p-3 rounded-lg bg-night-900/40 border border-night-700 cursor-pointer">
          <input
            type="checkbox"
            checked={t.sleep_position?.had_ablution || false}
            onChange={(e) =>
              update("section3_timing", {
                sleep_position: { ...t.sleep_position, had_ablution: e.target.checked },
              })
            }
            className="w-4 h-4 accent-gold-400"
          />
          <span className="text-night-100 text-sm">Abdestliydim</span>
        </label>
        <label className="flex items-center gap-2 p-3 rounded-lg bg-night-900/40 border border-night-700 cursor-pointer">
          <input
            type="checkbox"
            checked={t.sleep_position?.prayed_before_sleep || false}
            onChange={(e) =>
              update("section3_timing", {
                sleep_position: { ...t.sleep_position, prayed_before_sleep: e.target.checked },
              })
            }
            className="w-4 h-4 accent-gold-400"
          />
          <span className="text-night-100 text-sm">Dua ederek yattım</span>
        </label>
      </div>

      <div>
        <label className="label">Hangi tarafa yattınız?</label>
        <select
          value={t.sleep_position?.body_position || ""}
          onChange={(e) =>
            update("section3_timing", {
              sleep_position: { ...t.sleep_position, body_position: e.target.value },
            })
          }
          className="input-field"
        >
          <option value="">Seçiniz</option>
          <option value="sag">Sağ tarafıma</option>
          <option value="sol">Sol tarafıma</option>
          <option value="sirtustu">Sırtüstü</option>
          <option value="yuzustu">Yüzüstü</option>
          <option value="hatirlamiyorum">Hatırlamıyorum</option>
        </select>
      </div>

      <hr className="border-night-700 my-6" />
      <h3 className="font-display text-lg text-gold-300 mb-3">Özel Niyet</h3>

      <div>
        <label className="label">Bu rüya özel bir niyetle mi görüldü?</label>
        <select
          value={t.special_intention?.type || "yok"}
          onChange={(e) =>
            update("section3_timing", {
              special_intention: { ...t.special_intention, type: e.target.value },
            })
          }
          className="input-field"
        >
          <option value="yok">Normal bir uyku idi</option>
          <option value="istihare">İstihare yaptım</option>
          <option value="hacet">Hacet niyetiyle yattım</option>
          <option value="yakaza">Yakaza halinde gördüm</option>
        </select>
      </div>

      {t.special_intention?.type !== "yok" && (
        <div>
          <label className="label">Niyetinizi açıklayınız</label>
          <textarea rows={2}
            value={t.special_intention?.intention_text || ""}
            onChange={(e) =>
              update("section3_timing", {
                special_intention: { ...t.special_intention, intention_text: e.target.value },
              })
            }
            className="input-field"
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// BÖLÜM 4: SAHNE ANALİZİ
// ============================================================
function Section4({ data, update }: { data: any; update: any }) {
  const c = data.section4_content;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-4">Rüyanın Dokusu ve İçeriği</h2>

      <div>
        <label className="label">Rüyanın gerçeklik hissi nasıldı?</label>
        <select
          value={c.reality_feel || ""}
          onChange={(e) => update("section4_content", { reality_feel: e.target.value })}
          className="input-field"
        >
          <option value="">Seçiniz</option>
          <option value="lucid">Rüyada olduğumu biliyordum (lucid)</option>
          <option value="gercek_gibi">Tamamen gerçek gibiydi</option>
          <option value="silik">Silik / parça parçaydı</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Rüya mekanı</label>
          <select
            value={c.location?.known_or_unknown || ""}
            onChange={(e) =>
              update("section4_content", {
                location: { ...c.location, known_or_unknown: e.target.value },
              })
            }
            className="input-field"
          >
            <option value="">Seçiniz</option>
            <option value="bilinen">Tanıdığım bir yer</option>
            <option value="mechul">Meçhul / bilmediğim yer</option>
            <option value="karisik">Karışık</option>
          </select>
        </div>
        <div>
          <label className="label">Mevsim</label>
          <select
            value={c.time_in_dream?.season || ""}
            onChange={(e) =>
              update("section4_content", {
                time_in_dream: { ...c.time_in_dream, season: e.target.value },
              })
            }
            className="input-field"
          >
            <option value="">Belirsiz</option>
            <option value="ilkbahar">İlkbahar</option>
            <option value="yaz">Yaz</option>
            <option value="sonbahar">Sonbahar</option>
            <option value="kis">Kış</option>
          </select>
        </div>
      </div>

      <div>
        <label className="label">Mekan tasviri</label>
        <input type="text"
          value={c.location?.description || ""}
          onChange={(e) =>
            update("section4_content", {
              location: { ...c.location, description: e.target.value },
            })
          }
          placeholder="Çocukluk evim, bilinmeyen bir cami..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label">Baskın renkler ve ışık durumu</label>
        <input type="text"
          value={c.colors_and_light || ""}
          onChange={(e) => update("section4_content", { colors_and_light: e.target.value })}
          placeholder="Parlak güneş ışığı, baskın yeşil, karanlık..."
          className="input-field"
        />
      </div>

      <div>
        <label className="label">En dikkat çeken nesne / hayvan / sembol</label>
        <input type="text"
          value={c.key_symbols?.join(", ") || ""}
          onChange={(e) =>
            update("section4_content", {
              key_symbols: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
          placeholder="Yeşil kuş, akan su, açık kapı (virgülle ayırınız)"
          className="input-field"
        />
      </div>

      <hr className="border-night-700 my-6" />

      <div>
        <label className="label">Rüyanızı detaylı anlatın *</label>
        <p className="text-xs text-night-400 mb-2">
          En az 50 karakter. Ne olduğunu, kimleri gördüğünüzü, neler yaşadığınızı yazın.
        </p>
        <textarea
          required rows={10}
          value={c.dream_narrative || ""}
          onChange={(e) => update("section4_content", { dream_narrative: e.target.value })}
          placeholder="Rüyamda kendimi... bulduğumu gördüm. Sonra..."
          className="input-field"
        />
        <p className="text-xs text-night-400 mt-1 text-right">
          {(c.dream_narrative || "").length} karakter
        </p>
      </div>
    </div>
  );
}

// ============================================================
// BÖLÜM 5: KALP PUSULASI
// ============================================================
function Section5({ data, update }: { data: any; update: any }) {
  const f = data.section5_feelings;
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-night-50 mb-4">Uyanış ve Hissiyat</h2>
      <p className="text-night-300 text-sm mb-6">
        Bu bölüm en kritik bölümdür — rüyanın manevi tadını ölçer.
      </p>

      <div>
        <label className="label">Uyandığınız ilk saniyede kalbinizde ne hissettiniz? *</label>
        <select
          required
          value={f.first_emotion}
          onChange={(e) => update("section5_feelings", { first_emotion: e.target.value })}
          className="input-field"
        >
          <option value="huzur">Huzur</option>
          <option value="sevinc">Sevinç</option>
          <option value="ferahlik">Ferahlık</option>
          <option value="korku">Korku</option>
          <option value="agirlik">Ağırlık / sıkıntı</option>
          <option value="tiksinme">Tiksinme</option>
          <option value="karmasik">Karmaşık / çelişkili</option>
        </select>
      </div>

      <div>
        <label className="label">Fiziksel tepkiniz nasıldı?</label>
        <select
          value={f.physical_reaction || ""}
          onChange={(e) => update("section5_feelings", { physical_reaction: e.target.value })}
          className="input-field"
        >
          <option value="">Seçiniz</option>
          <option value="sakin">Sakin uyandım</option>
          <option value="terleyerek">Terleyerek</option>
          <option value="aglayarak">Ağlayarak</option>
          <option value="titreyerek">Titreyerek</option>
          <option value="gulerek">Gülerek</option>
          <option value="nefes_nefese">Nefes nefese</option>
        </select>
      </div>

      <div>
        <label className="label">Rüya aklınızdan çıkıyor mu?</label>
        <select
          value={f.memorability || ""}
          onChange={(e) => update("section5_feelings", { memorability: e.target.value })}
          className="input-field"
        >
          <option value="">Seçiniz</option>
          <option value="cikmaz">Aklımdan çıkmıyor</option>
          <option value="arasi">Arası — bazı kısımları net</option>
          <option value="silikleşiyor">Detaylar silikleşiyor</option>
        </select>
      </div>

      <div className="mt-8 p-4 rounded-lg bg-gold-400/5 border border-gold-400/20">
        <p className="text-sm text-night-200 leading-relaxed">
          <strong className="text-gold-300">Son adım:</strong> "Rüyayı Gönder" butonuna
          bastığınızda 1 token harcanır. Rüyanız demlenmeye bırakılırsa tokeniniz iade edilir.
          Yorumunuz hazır olduğunda panelden görebileceksiniz.
        </p>
      </div>
    </div>
  );
}
