"use client";

import { useEffect, useState } from "react";

// 🎯 KAMPANYA BİTİŞ TARİHİ
const CAMPAIGN_END_DATE = "2026-05-30T23:59:59";

export function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    function updateTime() {
      const end = new Date(CAMPAIGN_END_DATE).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-gradient-to-r from-gold-500/20 via-gold-400/30 to-gold-500/20 border border-gold-400/40 rounded-2xl px-4 py-4 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-center sm:text-left">
          <p className="text-gold-300 font-display text-lg">
            🎉 Açılışa Özel %30 İndirim
          </p>
          <p className="text-night-200 text-sm mt-1">
            Kampanya sona erdiğinde fiyatlar normale dönecek
          </p>
        </div>

        <div className="flex gap-2 text-center">
          <TimeBox value={timeLeft.days} label="Gün" />
          <TimeBox value={timeLeft.hours} label="Saat" />
          <TimeBox value={timeLeft.minutes} label="Dakika" />
          <TimeBox value={timeLeft.seconds} label="Saniye" />
        </div>
      </div>
    </div>
  );
}

function TimeBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-night-900/60 border border-gold-400/20 rounded-lg px-3 py-2 min-w-[60px]">
      <p className="font-display text-2xl text-gold-300 leading-none">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-xs text-night-300 mt-1">{label}</p>
    </div>
  );
}
