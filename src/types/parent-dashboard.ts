export interface Account {
  id: number;
  auth_user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface ChildProfile {
  id: number;
  name: string;
  account_id: number;
  gender: string;
  age_group: number;
  weight?: number;
  height?: number;
  dominant_foot?: boolean; // true = right foot, false = left foot
  playing_position?: string;
  experience_total: number;
  subscription_type: number;
  upro_gold: number;
  profile_picture?: string;
  equipped_avatar_id?: number;
  equipped_profile_banner_id?: number;
  created_at: string;
}

export interface CreateChildProfileData {
  name: string;
  gender: string;
  age_group: number;
  weight?: number;
  height?: number;
  dominant_foot?: boolean;
  playing_position?: string;
  experience_total?: number;
  profile_picture?: string;
}

export interface UpdateChildProfileData
  extends Partial<CreateChildProfileData> {
  id: number;
}

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;
export const PLAYING_POSITIONS = [
  "Forward",
  "Midfielder",
  "Defender",
  "Goalkeeper",
] as const;

export const AGE_GROUPS = [
  { value: 1, label: "Under 6" },
  { value: 2, label: "6-8 years" },
  { value: 3, label: "9-11 years" },
  { value: 4, label: "12-14 years" },
  { value: 5, label: "15-17 years" },
  { value: 6, label: "18+ years" },
] as const;
