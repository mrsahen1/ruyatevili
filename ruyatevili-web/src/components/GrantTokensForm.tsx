"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GrantTokensForm() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const supabase = createClient();
      const tokenAmount = parseInt(amount);

      if (!email || !email.includes("@")) {
        throw new Error("Geçerli bir e-posta adresi girin");
      }
      if (!tokenAmount || tokenAmount < 1) {
        throw new Error("Geçerli bir token miktarı girin (1 veya daha fazla)");
      }

      // 1) Kullanıcı id'sini bul
      const { data: userData, error: userError } = await supabase.rpc(
        "find_user_by_email",
        { user_email: email.trim().toLowerCase() }
      );

      if (userError || !userData) {
        throw new Error(
          "Bu e-posta ile kayıtlı bir kullanıcı bulunamadı. E-postayı kontrol edin."
        );
      }

      const userId = userData;

      // 2) Mevcut bakiyeyi al
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("token_balance")
        .eq("id", userId)
        .single<{ token_balance: number }>();

      if (profileError || !profile) {
        throw new Error("Kullanıcı profili bulunamadı");
      }

      const newBalance = profile.token_balance + tokenAmount;

      // 3) Bakiyeyi güncelle
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ token_balance: newBalance })
        .eq("id", userId);

      if (updateError) throw updateError;

      // 4) Transaction log'u yaz
      const { error: txError } = await supabase
        .from("token_transactions")
        .insert({
          user_id: userId,
          type: "admin_grant",
          amount: tokenAmount,
          balance_after: newBalance,
          description: note || `Manuel token verildi: ${tokenAmount} token`,
        });

      if (txError) {
        console.warn("Transaction log yazılamadı:", txError);
        // Bakiye yine de güncellendi, devam et
      }

      setResult({
        success: true,
        message: `${email} hesabına ${tokenAmount} token başarıyla eklendi. Yeni bakiye: ${newBalance}`,
      });
      setEmail("");
      setAmount("");
      setNote("");
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Bir hata oluştu",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card-elevated">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label" htmlFor="email">
            Kullanıcı E-postası
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ornek@email.com"
            className="input-field"
            disabled={loading}
          />
        </div>

        <div>
          <label className="label" htmlFor="amount">
            Token Miktarı
          </label>
          <input
            id="amount"
            type="number"
            min={1}
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Örn: 5"
            className="input-field"
            disabled={loading}
          />
          <p className="text-xs text-night-400 mt-1">
            Shopier'den hangi paketi aldıysa o kadar token girin
          </p>
        </div>

        <div>
          <label className="label" htmlFor="note">
            Açıklama (opsiyonel)
          </label>
          <input
            id="note"
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Örn: Shopier sipariş #12345"
            className="input-field"
            disabled={loading}
          />
          <p className="text-xs text-night-400 mt-1">
            Bu not kullanıcının işlem geçmişinde görünecek
          </p>
        </div>

        {result && (
          <div
            className={`p-3 rounded-lg text-sm ${
              result.success
                ? "bg-green-900/30 border border-green-700/40 text-green-200"
                : "bg-red-900/30 border border-red-700/40 text-red-200"
            }`}
          >
            {result.message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "İşleniyor..." : "🪙 Token Ver"}
        </button>
      </form>
    </div>
  );
}
