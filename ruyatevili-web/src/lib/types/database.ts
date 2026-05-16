// Supabase veritabanı tipleri
// Bu dosya manuel — schema değişirse buradan da güncelle

export type DreamStatus = "journal" | "submitted" | "in_review" | "answered" | "marinating";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type TransactionType = "purchase" | "spend" | "refund" | "admin_grant" | "admin_revoke";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  token_balance: number;
  active_dream_count: number;
  dream_quota: number;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface TokenPackage {
  id: string;
  name: string;
  description: string | null;
  token_count: number;
  price_try: number;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  shopier_link: string | null;
}

export interface Order {
  id: string;
  user_id: string;
  package_id: string;
  amount_try: number;
  token_count: number;
  status: OrderStatus;
  payment_provider: string;
  provider_order_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export interface Dream {
  id: string;
  user_id: string;
  form_data: DreamFormData;
  dream_text: string;
  status: DreamStatus;
  interpretation: string | null;
  interpreted_by: string | null;
  marinating_message: string | null;
  token_refunded: boolean;
  submitted_at: string;
  reviewed_at: string | null;
  answered_at: string | null;
  admin_notes: string | null;
}

export interface TokenTransaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  related_order_id: string | null;
  related_dream_id: string | null;
  description: string | null;
  created_at: string;
}

// Rüya formu — Yeni 3 adımlı yapı
export interface DreamFormData {
  schema_version: "2.0";

  // ADIM 1: ZEMİN VE KOORDİNATLAR
  step1_ground: {
    // Zihinsel odak (gündüz kalıntısı)
    mental_focus?: "yogun" | "siradan";
    mental_focus_detail?: string; // "yogun" seçilirse açılan kutu

    // Fiziksel durum (çoklu seçim)
    physical_state?: {
      cok_yorgun?: boolean;
      agir_yemek?: boolean;
      ilac_aldim?: boolean;
      stresliydim?: boolean;
      normal?: boolean;
    };

    // Uyku vakti (tek seçim)
    dream_time?: "gece_ilk_yarisi" | "teheccud" | "sabaha_karsi" | "kaylule";

    // Yatış şekli (çoklu seçim)
    sleep_preparation?: {
      abdestliydim?: boolean;
      duali_yattim?: boolean;
      istihare_hacet?: boolean;
    };
  };

  // ADIM 2: SAHNE VE KALP PUSULASI
  step2_scene: {
    // Gerçeklik (tek seçim)
    reality_feel?: "gercek_gibi" | "lucid";

    // Mekan (tek seçim)
    location?: "bilinen" | "mechul";

    // Renkler ve ışık (tek seçim)
    dominant_color?: "siyah_karanlik" | "beyaz_aydinlik" | "yesil" | "kirmizi" | "yok";

    // Kalp pusulası — En kritik (tek seçim)
    first_emotion: "korku" | "huzur" | "sevinc" | "tiksinme" | "agirlik" | "ferahlik";

    // Fiziksel tepki (tek seçim)
    physical_reaction?: "sakin" | "terleyerek" | "nefes_nefese" | "aglayarak" | "gulerek";
  };

  // ADIM 3: RÜYA METNİ
  step3_text: {
    dream_narrative: string; // En az 50 karakter
  };
}
