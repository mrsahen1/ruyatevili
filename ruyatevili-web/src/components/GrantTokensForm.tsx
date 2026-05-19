"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface UserOption {
  id: string;
  email: string;
  full_name: string | null;
  token_balance: number;
}

export function GrantTokensForm() {
  const router = useRouter();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserOption | null>(null);
  const [tokenAmount, setTokenAmount] = useState(1);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Tüm kullanıcıları yükle
  useEffect(() => {
    async function loadUsers() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc("admin_list_users");

        if (error) {
          console.error("Kullanıcı listesi hatası:", error);
          setError("Kullanıcı listesi yüklenemedi: " + error.message);
          return;
        }

        setUsers(data || []);
      } catch (e: any) {
        setError("Kullanıcılar yüklenirken hata: " + e.message);
      } finally {
        setLoadingUsers(false);
      }
    }
    loadUsers();
  }, []);

  // Arama filtresi
  const filteredUsers = users.filter((u) => {
    const search = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(search) ||
      (u.full_name || "").toLowerCase().includes(search)
    );
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedUser) {
      setError("Lütfen bir kullanıcı seçin");
      return;
    }

    if (tokenAmount <= 0) {
      setError("Token miktarı 1 veya daha fazla olmalı");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: rpcError } = await supabase.rpc("admin_grant_tokens", {
        target_user_id: selectedUser.id,
        amount: tokenAmount,
        grant_description: description || `${tokenAmount} token verildi (admin)`,
      });

      if (rpcError) throw rpcError;

      setSuccess(
        `✅ ${selectedUser.full_name || selectedUser.email} kullanıcısına ${tokenAmount} token verildi`
      );

      // Yenile
      const { data } = await supabase.rpc("admin_list_users");
      setUsers(data || []);

      // Formu temizle
      setSelectedUser(null);
      setSearchTerm("");
      setTokenAmount(1);
      setDescription("");

      router.refresh();
    } catch (e: any) {
      setError(e.message || "Token verilemedi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* KULLANICI ARAMA + SEÇME */}
      <div>
        <label className="label">Kullanıcı Seç</label>
        {selectedUser ? (
          <div className="flex items-center justify-between p-3 bg-gold-400/10 border border-gold-400/40 rounded-lg">
            <div>
              <p className="text-night-50 font-medium">
                {selectedUser.full_name || "İsim girilmemiş"}
              </p>
              <p className="text-sm text-night-300">{selectedUser.email}</p>
              <p className="text-xs text-gold-300 mt-1">
                Mevcut bakiye: {selectedUser.token_balance} token
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedUser(null);
                setSearchTerm("");
              }}
              className="text-sm text-night-300 hover:text-red-300 transition-colors"
            >
              ✕ Değiştir
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 Email veya isim ile ara..."
              className="input-field"
              disabled={loadingUsers}
            />
            {loadingUsers ? (
              <p className="text-sm text-night-400 mt-2">Kullanıcılar yükleniyor...</p>
            ) : (
              <div className="mt-2 max-h-64 overflow-y-auto border border-night-700 rounded-lg">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-night-400 p-3">Kullanıcı bulunamadı</p>
                ) : (
                  <div className="divide-y divide-night-800">
                    {filteredUsers.slice(0, 50).map((u) => (
                      <button
                        type="button"
                        key={u.id}
                        onClick={() => {
                          setSelectedUser(u);
                          setSearchTerm("");
                        }}
                        className="w-full text-left p-3 hover:bg-night-800/50 transition-colors"
                      >
                        <p className="text-sm text-night-50 font-medium">
                          {u.full_name || "İsim girilmemiş"}
                        </p>
                        <p className="text-xs text-night-300">{u.email}</p>
                        <p className="text-xs text-gold-300 mt-1">
                          Mevcut: {u.token_balance} token
                        </p>
                      </button>
                    ))}
                    {filteredUsers.length > 50 && (
                      <p className="text-xs text-night-400 p-2 text-center">
                        +{filteredUsers.length - 50} kullanıcı daha (arama yapın)
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* TOKEN MİKTARI */}
      <div>
        <label className="label">Verilecek Token Miktarı</label>
        <input
          type="number"
          min="1"
          max="1000"
          value={tokenAmount}
          onChange={(e) => setTokenAmount(parseInt(e.target.value) || 0)}
          className="input-field"
          required
        />
      </div>

      {/* AÇIKLAMA */}
      <div>
        <label className="label">
          Açıklama (isteğe bağlı)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="örn: Shopier sipariş #12345 - 5 token paketi"
          className="input-field"
          maxLength={200}
        />
        <p className="text-xs text-night-400 mt-1">
          İşlem geçmişinde görünecek not
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-900/30 border border-red-700/40 text-red-200 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 rounded-lg bg-green-900/30 border border-green-700/40 text-green-200 text-sm">
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !selectedUser}
        className="btn-primary w-full text-lg py-3"
      >
        {loading ? "Veriliyor..." : `🪙 ${tokenAmount} Token Ver`}
      </button>
    </form>
  );
}
