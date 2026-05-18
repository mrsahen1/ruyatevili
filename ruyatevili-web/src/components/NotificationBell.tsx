"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/types/database";

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Kullanıcının admin olup olmadığını öğren
  async function loadAdminStatus() {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single<{ is_admin: boolean }>();

      setIsAdmin(profile?.is_admin === true);
    } catch (e) {
      console.warn("Admin status fetch error:", e);
    }
  }

  // Bildirimleri çek
  async function loadNotifications() {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        console.warn("Notification yüklenemedi:", error);
        return;
      }

      const list = (data ?? []) as Notification[];
      setNotifications(list);
      setUnreadCount(list.filter((n) => !n.is_read).length);
    } catch (e) {
      console.warn("Notification fetch error:", e);
    }
  }

  // İlk yükleme + her 30 saniyede bir yenile
  useEffect(() => {
    loadAdminStatus();
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Dışına tıklayınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Tek bildirimi okundu işaretle
  async function markAsRead(id: string) {
    const supabase = createClient();
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }

  // Tümünü okundu işaretle
  async function markAllAsRead() {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("is_read", false);

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  }

  function handleNotificationClick(n: Notification) {
    if (!n.is_read) markAsRead(n.id);
    setOpen(false);

    if (n.related_dream_id) {
      // Admin için admin paneline, kullanıcı için kendi sayfasına
      if (isAdmin) {
        router.push(`/admin/dreams/${n.related_dream_id}`);
      } else {
        router.push(`/dream/${n.related_dream_id}`);
      }
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative px-2 sm:px-3 py-2 rounded-lg bg-night-800/60 hover:bg-night-700/60 border border-night-600 text-night-50 transition-all"
        aria-label="Bildirimler"
      >
        <span className="text-lg">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-night-950 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-night-900 border border-night-700 rounded-xl shadow-2xl shadow-night-950/50 overflow-hidden z-[60]">
          {/* Başlık */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-night-700">
            <h3 className="font-display text-lg text-night-50">Bildirimler</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-gold-300 hover:text-gold-200 transition-colors"
              >
                Hepsini okundu işaretle
              </button>
            )}
          </div>

          {/* Liste */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <p className="text-4xl mb-3">📬</p>
                <p className="text-night-300 text-sm">Henüz bildirim yok</p>
              </div>
            ) : (
              <div className="divide-y divide-night-800">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`w-full text-left px-4 py-3 hover:bg-night-800/50 transition-colors ${
                      !n.is_read ? "bg-gold-400/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!n.is_read && (
                        <span className="w-2 h-2 mt-2 bg-gold-400 rounded-full flex-shrink-0"></span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium leading-snug ${
                            !n.is_read ? "text-night-50" : "text-night-200"
                          }`}
                        >
                          {n.title}
                        </p>
                        {n.message && (
                          <p className="text-xs text-night-400 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                        )}
                        <p className="text-[10px] text-night-500 mt-1">
                          {timeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-night-700 bg-night-900/80">
              <Link
                href={isAdmin ? "/admin/dreams" : "/dashboard"}
                onClick={() => setOpen(false)}
                className="text-xs text-night-300 hover:text-gold-300 transition-colors"
              >
                {isAdmin ? "Yönetim paneli →" : "Panele dön →"}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Tarih formatlama
function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffMin < 1) return "Az önce";
  if (diffMin < 60) return `${diffMin} dakika önce`;
  if (diffHour < 24) return `${diffHour} saat önce`;
  if (diffDay < 7) return `${diffDay} gün önce`;

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
