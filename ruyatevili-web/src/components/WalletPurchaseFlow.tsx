"use client";

import { useState } from "react";
import type { TokenPackage } from "@/lib/types/database";

interface Props {
  packages: TokenPackage[];
  userEmail: string;
}

export function WalletPurchaseFlow({ packages, userEmail }: Props) {
  const [selectedPkg, setSelectedPkg] = useState<TokenPackage | null>(null);
  const [emailCopied, setEmailCopied] = useState(false);

  function handleSelectPackage(pkg: TokenPackage) {
    if (!pkg.shopier_link) {
      alert("Bu paket henüz aktif değil. Lütfen daha sonra tekrar deneyin.");
      return;
    }
    setSelectedPkg(pkg);
    setEmailCopied(false);
  }

  function copyEmail() {
    navigator.clipboard.writeText(userEmail);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  }

  function goToShopier() {
    if (selectedPkg?.shopier_link) {
      window.open(selectedPkg.shopier_link, "_blank");
      setSelectedPkg(null);
    }
  }

  return (
    <>
      {/* PAKETLER GRID */}
      <div>
        <h2 className="font-display text-2xl text-night-50 mb-2">
          🪙 Token Paketleri
        </h2>
        <p className="text-night-300 text-sm mb-6">
          Açılışa özel %30 indirim aktif
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {packages.map((pkg) => {
            const originalPrice = Math.round(Number(pkg.price_try) / 0.7);
            const isActive = !!pkg.shopier_link;
            return (
              <div
                key={pkg.id}
                className={`relative ${pkg.is_featured ? "card-elevated lg:scale-105" : "card"} hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold-400/20 transition-all duration-500 group`}
              >
                {pkg.is_featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gold-400 text-night-950 text-xs font-medium rounded-full">
                    En Avantajlı
                  </div>
                )}
                <div className="text-center">
                  <h3 className="font-display text-xl text-night-50 mb-2">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-night-400 line-through">
                    {originalPrice.toLocaleString("tr-TR")} ₺
                  </p>
                  <div className="mb-4">
                    <span className="font-display text-3xl text-gold-300">
                      {Number(pkg.price_try).toLocaleString("tr-TR")}
                    </span>
                    <span className="text-night-300 ml-1">₺</span>
                  </div>
                  <p className="text-xs text-gold-400 font-medium mb-3">
                    %30 İNDİRİM
                  </p>
                  <p className="text-sm text-night-200 mb-4">
                    {pkg.token_count} rüya yorumu hakkı
                  </p>
                  <button
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={!isActive}
                    className={
                      pkg.is_featured
                        ? "btn-primary w-full"
                        : "btn-secondary w-full"
                    }
                  >
                    {isActive ? "🛒 Satın Al" : "Yakında"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SATIN ALMA UYARI MODALI */}
      {selectedPkg && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedPkg(null)}
        >
          <div
            className="bg-night-900 border border-gold-400/40 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-night-700 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl text-gold-300">
                  ⚠️ Önemli! Lütfen Okuyun
                </h2>
                <p className="text-night-300 text-sm mt-1">
                  Token tesliminde sorun yaşamamak için
                </p>
              </div>
              <button
                onClick={() => setSelectedPkg(null)}
                className="text-night-400 hover:text-night-100 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Seçilen paket */}
              <div className="card bg-gold-400/5 border-gold-400/20">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="text-sm text-night-300">Seçilen Paket</p>
                    <p className="font-display text-xl text-night-50">
                      {selectedPkg.name}
                    </p>
                  </div>
                  <p className="font-display text-3xl text-gold-300">
                    {Number(selectedPkg.price_try).toLocaleString("tr-TR")} ₺
                  </p>
                </div>
              </div>

              {/* Email kutusu */}
              <div className="card bg-blue-900/20 border-blue-700/40">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="font-medium text-night-50">
                      Bu mail adresi ile siteye kayıtlısınız
                    </p>
                    <p className="text-xs text-night-300 mt-1">
                      Tokenler bu hesaba yüklenecektir
                    </p>
                  </div>
                </div>
                <div className="bg-night-900 border border-night-700 rounded-lg p-3 flex items-center justify-between gap-2 flex-wrap">
                  <code className="text-gold-300 font-mono text-sm break-all">
                    {userEmail}
                  </code>
                  <button
                    onClick={copyEmail}
                    className="px-3 py-1 bg-gold-400/20 hover:bg-gold-400/30 text-gold-300 text-sm rounded-lg transition-colors flex-shrink-0"
                  >
                    {emailCopied ? "✓ Kopyalandı" : "📋 Kopyala"}
                  </button>
                </div>
              </div>

              {/* Adımlar */}
              <div>
                <h3 className="font-display text-lg text-night-50 mb-3">
                  Yapmanız Gerekenler
                </h3>
                <div className="space-y-3">
                  <Step
                    num="1"
                    title="Shopier ödeme sayfasına yönlendirileceksiniz"
                    desc="Yeni bir sekme açılacak"
                  />
                  <Step
                    num="2"
                    title="Ödeme yaparken mail adresinizi girin"
                    desc={`Yukarıdaki ${userEmail} adresini kullanın`}
                    highlight
                  />
                  <Step
                    num="3"
                    title="Sipariş Notu alanına mail adresinizi MUTLAKA yazın"
                    desc={`Shopier checkout sayfasında "Sipariş Notu" kutusuna ${userEmail} yazın. Bu, tokenlerinizin doğru hesaba yüklenmesini sağlar.`}
                    highlight
                    warning
                  />
                  <Step
                    num="4"
                    title="Ödemeyi tamamlayın"
                    desc="Tokenleriniz 24 saat içinde hesabınıza yüklenecektir"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-night-700 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setSelectedPkg(null)}
                className="btn-secondary flex-1"
              >
                İptal
              </button>
              <button
                onClick={goToShopier}
                className="btn-primary flex-[2]"
              >
                ✓ Anladım, Shopier&apos;a Git
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Step({
  num,
  title,
  desc,
  highlight,
  warning,
}: {
  num: string;
  title: string;
  desc: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={`flex gap-3 p-3 rounded-lg ${
        warning
          ? "bg-yellow-900/20 border border-yellow-700/40"
          : highlight
            ? "bg-gold-400/5 border border-gold-400/20"
            : "bg-night-800/40 border border-night-700"
      }`}
    >
      <div
        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center font-display font-bold text-sm ${
          warning
            ? "bg-yellow-400 text-night-950"
            : highlight
              ? "bg-gold-400 text-night-950"
              : "bg-night-700 text-night-200"
        }`}
      >
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-night-50 text-sm leading-snug">
          {title}
        </p>
        <p className="text-xs text-night-300 mt-1 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
