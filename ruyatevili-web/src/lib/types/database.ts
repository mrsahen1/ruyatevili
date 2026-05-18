// Supabase veritabanı tipleri

export type DreamStatus = "journal" | "submitted" | "in_review" | "answered" | "marinating";
export type OrderStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled";
export type TransactionType = "purchase" | "spend" | "refund" | "admin_grant" | "admin_revoke";
export type NotificationType = "dream_answered" | "dream_marinating" | "token_granted" | "welcome" | "system";

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
  form_data: DreamFormData | any;
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

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  related_dream_id: string | null;
  is_read: boolean;
  created_at: string;
}

// Rüya formu — Yeni 3 adımlı yapı (v2.0)
export interface DreamFormData {
  schema_version: "2.0";

  step1_ground: {
    mental_focus?: "yogun" | "siradan";
    mental_focus_detail?: string;

    physical_state?: {
      cok_yorgun?: boolean;
      agir_yemek?: boolean;
      ilac_aldim?: boolean;
      stresliydim?: boolean;
      normal?: boolean;
    };

    dream_time?: "gece_ilk_yarisi" | "teheccud" | "sabaha_karsi" | "kaylule";

    sleep_preparation?: {
      abdestliydim?: boolean;
      duali_yattim?: boolean;
      istihare_hacet?: boolean;
    };
  };

  step2_scene: {
    reality_feel?: "gercek_gibi" | "lucid";
    location?: "bilinen" | "mechul";
    dominant_color?: "siyah_karanlik" | "beyaz_aydinlik" | "yesil" | "kirmizi" | "yok";
    first_emotion: "korku" | "huzur" | "sevinc" | "tiksinme" | "agirlik" | "ferahlik";
    physical_reaction?: "sakin" | "terleyerek" | "nefes_nefese" | "aglayarak" | "gulerek";
  };

  step3_text: {
    dream_narrative: string;
  };
}
