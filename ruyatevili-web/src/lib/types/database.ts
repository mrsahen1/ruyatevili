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

// Rüya formu — 5 bölümlü anamnez
export interface DreamFormData {
  schema_version: "1.0";

  section1_profile: {
    age: number;
    gender: "erkek" | "kadin";
    marital_status: "bekar" | "evli" | "dul" | "bosanmis";
    has_marriage_intent?: boolean;
    occupation: string;
    mental_focus?: string;
    spiritual_state?: {
      worship_regularity?: "duzenli" | "gevsek" | "arayista" | "paylasmak_istemiyorum";
      recent_sin_or_regret?: string;
      recent_good_deed_or_prayer?: string;
      spiritual_affiliation?: string;
    };
  };

  section2_daily_life?: {
    day_residue?: string;
    current_question_or_wish?: string;
    health_state?: {
      was_tired?: boolean;
      was_sick?: boolean;
      was_stressed?: boolean;
      heavy_meal_before_sleep?: boolean;
      current_medication?: string;
    };
  };

  section3_timing?: {
    dream_time?: "gece_ilk_yarisi" | "teheccud" | "sabah_ezanina_yakin" | "kaylule" | "bilmiyorum";
    sleep_position?: {
      had_ablution?: boolean;
      prayed_before_sleep?: boolean;
      body_position?: "sag" | "sol" | "sirtustu" | "yuzustu" | "hatirlamiyorum";
    };
    special_intention?: {
      type?: "yok" | "istihare" | "hacet" | "yakaza";
      intention_text?: string;
    };
  };

  section4_content: {
    reality_feel?: "lucid" | "gercek_gibi" | "silik";
    location?: {
      known_or_unknown?: "bilinen" | "mechul" | "karisik";
      description?: string;
    };
    time_in_dream?: {
      season?: "ilkbahar" | "yaz" | "sonbahar" | "kis" | "belirsiz";
      time_of_day?: "gunduz" | "gece" | "safak" | "aksam" | "belirsiz";
    };
    colors_and_light?: string;
    people?: Array<{
      known: boolean;
      relation?: string | null;
      name_heard?: string | null;
    }>;
    key_symbols?: string[];
    dream_narrative: string;
  };

  section5_feelings: {
    first_emotion: "korku" | "huzur" | "sevinc" | "tiksinme" | "agirlik" | "ferahlik" | "karmasik";
    physical_reaction?: "sakin" | "terleyerek" | "aglayarak" | "titreyerek" | "gulerek" | "nefes_nefese";
    memorability?: "cikmaz" | "silikleşiyor" | "arasi";
  };
}
