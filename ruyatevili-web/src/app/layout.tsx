import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ruyatevili — Doğru teşhis, doğru bilgiyle rüyalarınızın dilini çözün",
  description:
    "Uykudaki ilham kırıntılarını, ilimle gerçeğe dönüştürüyoruz. Geleneksel tevil ilmine dayalı, sertifikalı yorumcuların özenle hazırladığı kişiselleştirilmiş rüya tabirleri.",
  keywords: "rüya tabiri, rüya yorumu, tevil ilmi, rüya analizi, islami rüya tabiri, ruyatevili",
  authors: [{ name: "ruyatevili" }],
  openGraph: {
    title: "ruyatevili",
    description: "Uykudaki ilham kırıntılarını, ilimle gerçeğe dönüştürüyoruz.",
    type: "website",
    locale: "tr_TR",
    siteName: "ruyatevili",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
