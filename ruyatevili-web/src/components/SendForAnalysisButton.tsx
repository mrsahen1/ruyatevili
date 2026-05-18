"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Props {
  dreamId: string;
  hasTokens: boolean;
  quotaFull: boolean;
}

export function SendForAnalysisButton({ dreamId, hasTokens, quotaFull }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!hasTokens) {
      setError("Yetersiz token bakiyesi");
      return;
    }
    if (quotaFull) {
      setError("Rüya kotanız dolu");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("dreams")
        .update({ status: "submitted" })
        .eq("id", dreamId);

      if (updateError) {
        if (updateError.message.includes("Yetersiz token")) {
          throw new Error("Token bakiyeniz yetersiz");
        }
        if (updateError.message.includes("kotanız")) {
          throw new Error("Rüya kotanız dolu");
        }
        throw updateError;
      }

      router.push("/dashboard?submitted=1");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "İşlem başarısız oldu");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleSubmit}
        disabled={loading || !hasTokens || quotaFull}
        className="btn-primary text-lg px-8 py-4"
      >
        {loading ? "Gönderiliyor..." : "🕊️ Analize Gönder (1 Token)"}
      </button>
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
          {error}
        </div>
      )}
    </>
  );
}
