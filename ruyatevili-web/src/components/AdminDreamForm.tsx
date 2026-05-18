"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Dream } from "@/lib/types/database";

export function AdminDreamForm({ dream }: { dream: Dream }) {
  const router = useRouter();
  const [mode, setMode] = useState<"answer" | "marinate">("answer");
  const [interpretation, setInterpretation] = useState(dream.interpretation || "");
  const [marinatingMessage, setMarinatingMessage] = useState(
    dream.marinating_message || ""
  );
  const [adminNotes, setAdminNotes] = useState(dream.admin_notes || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const isFinal = dream.status === "answered" || dream.status === "marinating";

  // --------------------------------------------------------
  // YENİ EKLENEN BÖLÜM: E-posta Gönderme Fonksiyonu
  // --------------------------------------------------------
  async function notifyUser(type: "answer" | "marinate") {
    try {
      const supabase = createClient();
      
      // 1. Kullanıcının e-posta adresini profiller tablosundan çek
      const { data: profile } = await supabase
        .from("profiles")
        .select("email")
        .eq("id", dream.user_id)
        .single();

      const userEmail = profile?.email;

      // Eğer mail adresi bulunamazsa işlemi iptal et (hata fırlatma ki uygulama çökmesin)
      if (!userEmail) {
        console.warn("Kullanıcının e-posta adresi bulunamadı, mail gönderilmedi.");
        return;
      }

      // 2. Mail içeriğini (Konu ve Gövde) hazırla
      const subject = type === "answer" ? "Rüyanız Yorumlandı! 🌙" : "Rüyanız Demlenmeye Bırakıldı 🍵";
      
      const html = type === "answer"
        ? `<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
             <h2 style="color: #d4af37;">Rüyanız Yorumlandı! 🌙</h2>
             <p>Merhaba,</p>
             <p>Gönderdiğiniz rüya özenle incelendi ve yorumlandı. İşte rüyanızın tabiri:</p>
             <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #d4af37; margin: 20px 0;">
               <p style="white-space: pre-wrap; margin: 0;">${interpretation}</p>
             </div>
             <p>Daha fazla detay için Rüya Tevili uygulamasına giriş yapabilirsiniz.</p>
           </div>`
        : `<div style="font-family: sans-serif; color: #333; max-width: 600px; margin: 0 auto; line-height: 1.6;">
             <h2 style="color: #6b7280;">Rüyanız Demlenmeye Bırakıldı 🍵</h2>
             <p>Merhaba,</p>
             <p>Gönderdiğiniz rüya, klasik kaynaklara göre henüz tabir edilebilmesi için zamanın olgunlaşmasını bekliyor.</p>
             <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; border-left: 4px solid #6b7280; margin: 20px 0;">
               <p style="white-space: pre-wrap; margin: 0;">${marinatingMessage}</p>
             </div>
             <p>Kullanılan token hesabınıza iade edilmiştir.</p>
           </div>`;

      // 3. Bizim yeni kurduğumuz Vercel API'sine (postaneye) isteği gönder
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: userEmail, subject, html }),
      });
      
    } catch (err) {
      console.error("Mail gönderim motorunda hata oluştu:", err);
    }
  }
  // --------------------------------------------------------

  async function startReview() {
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("dreams")
      .update({ status: "in_review" })
      .eq("id", dream.id);
    setSubmitting(false);
    if (error) {
      setError(error.message);
    } else {
      router.refresh();
    }
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();

    if (mode === "answer") {
      if (!interpretation.trim()) {
        setError("Yorum boş olamaz");
        setSubmitting(false);
        return;
      }
      const { error } = await supabase
        .from("dreams")
        .update({
          status: "answered",
          interpretation: interpretation.trim(),
          admin_notes: adminNotes || null,
        })
        .eq("id", dream.id);
        
      if (error) setError(error.message);
      else {
        // YENİ EKLENTİ: Veritabanına başarıyla kaydedildikten sonra maili tetikle
        await notifyUser("answer");
        
        setSuccess(true);
        router.refresh();
      }
    } else {
      if (!marinatingMessage.trim()) {
        setError("Demlenme mesajı boş olamaz");
        setSubmitting(false);
        return;
      }
      const { error } = await supabase
        .from("dreams")
        .update({
          status: "marinating",
          marinating_message: marinatingMessage.trim(),
          admin_notes: adminNotes || null,
        })
        .eq("id", dream.id);
        
      if (error) setError(error.message);
      else {
        // YENİ EKLENTİ: Veritabanına başarıyla kaydedildikten sonra maili tetikle
        await notifyUser("marinate");
        
        setSuccess(true);
        router.refresh();
      }
    }
    setSubmitting(false);
  }

  if (isFinal) {
    return (
      <div className="card-elevated">
        <h2 className="font-display text-2xl text-gold-300 mb-4">Sonuç Verildi</h2>
        <p className="text-night-200 mb-4">
          Bu rüya {dream.status === "answered" ? "cevaplandı" : "demlenmeye bırakıldı"}.
        </p>
        {dream.interpretation && (
          <div className="p-4 rounded-lg bg-night-900/40 border border-night-700 mb-4">
            <p className="text-xs text-night-400 mb-2">Verilen Yorum</p>
            <p className="text-night-50 whitespace-pre-wrap leading-relaxed">
              {dream.interpretation}
            </p>
          </div>
        )}
        {dream.marinating_message && (
          <div className="p-4 rounded-lg bg-night-900/40 border border-night-700">
            <p className="text-xs text-night-400 mb-2">Demlenme Mesajı</p>
            <p className="text-night-50 whitespace-pre-wrap leading-relaxed">
              {dream.marinating_message}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="card-elevated">
      <h2 className="font-display text-2xl text-gold-300 mb-4">Cevap Yaz</h2>

      {dream.status === "submitted" && (
        <div className="mb-4 p-3 rounded-lg bg-yellow-900/20 border border-yellow-700/30">
          <p className="text-yellow-200 text-sm mb-2">
            Bu rüya henüz incelemeye alınmadı.
          </p>
          <button onClick={startReview} disabled={submitting} className="btn-secondary text-sm">
            İncelemeye Al
          </button>
        </div>
      )}

      {/* Sekme seçici */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("answer")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm transition ${
            mode === "answer"
              ? "bg-gold-400 text-night-950 font-medium"
              : "bg-night-800/60 text-night-200 border border-night-700"
          }`}
        >
          ✅ Yorum Yaz
        </button>
        <button
          onClick={() => setMode("marinate")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm transition ${
            mode === "marinate"
              ? "bg-gold-400 text-night-950 font-medium"
              : "bg-night-800/60 text-night-200 border border-night-700"
          }`}
        >
          🍵 Demlenmeye Bırak
        </button>
      </div>

      {mode === "answer" ? (
        <div>
          <label className="label">Yorumunuz</label>
          <textarea
            rows={12}
            value={interpretation}
            onChange={(e) => setInterpretation(e.target.value)}
            placeholder="Rüyanın klasik kaynaklara dayalı yorumunu, kullanıcının hayatına özel bağlantılarıyla birlikte yazınız..."
            className="input-field"
          />
        </div>
      ) : (
        <div>
          <label className="label">Kullanıcıya Gösterilecek Mesaj</label>
          <p className="text-xs text-night-400 mb-2">
            Bu rüya neden demlenmeye bırakılıyor? Kullanıcıya anlamlı bir mesaj yazın.
            Token otomatik iade edilecek.
          </p>
          <textarea
            rows={8}
            value={marinatingMessage}
            onChange={(e) => setMarinatingMessage(e.target.value)}
            placeholder="Bu rüya, klasik kaynaklara göre henüz tabir yapılabilmesi için zamanın olgunlaşmasını bekliyor..."
            className="input-field"
          />
        </div>
      )}

      <div className="mt-4">
        <label className="label">Admin Notları (kullanıcı görmez)</label>
        <textarea
          rows={3}
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          placeholder="Kendi notlarınız, referanslarınız..."
          className="input-field"
        />
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-3 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
          Başarıyla kaydedildi ve e-posta gönderildi.
        </div>
      )}

      <button
        onClick={submit}
        disabled={submitting}
        className="btn-primary w-full mt-6"
      >
        {submitting
          ? "İşleniyor..."
          : mode === "answer"
            ? "Yorumu Gönder"
            : "Demlenmeye Bırak (Token İade)"}
      </button>
    </div>
  );
}
