import { GrantTokensForm } from "@/components/GrantTokensForm";
import Link from "next/link";

export default function GrantTokensPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-night-50">Manuel Token Ver</h1>
        <Link href="/admin/dreams" className="btn-ghost">
          ← Rüyalara Dön
        </Link>
      </div>

      <div className="card">
        <p className="text-night-200 leading-relaxed mb-2">
          Shopier&apos;den ödeme yapan kullanıcıya token vermek için bu formu kullanın.
        </p>
        <p className="text-sm text-night-400">
          E-posta adresini ve verilecek token miktarını girin. Sistem otomatik olarak
          kullanıcının bakiyesini artıracak ve işlem geçmişine kayıt düşecek.
        </p>
      </div>

      <GrantTokensForm />
    </div>
  );
}
