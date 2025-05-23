
export interface User {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  created_at: string;
  is_active?: boolean;
  is_admin?: boolean;
  avatarUrl?: string | null;
}

export interface UserStats {
  id: string;
  username?: string;
  full_name?: string;
  image_count: number;
  avatar_url?: string | null;
}

export type SortDirection = "asc" | "desc";
export type SortField = "username" | "created_at" | "image_count" | "full_name" | "email";

export interface UserSortState {
  field: SortField;
  direction: SortDirection;
}

export interface UserFilterState {
  username: string;
}

export interface UserDetailData {
  id: string;
  username?: string;
  email?: string;
  full_name?: string;
  created_at: string;
  image_count: number;
  is_active?: boolean;
  is_admin?: boolean;
  avatar_url?: string | null;
  credits?: number; // Make credits optional
}

export interface UserCreditTransaction {
  id: string;
  amount: number;
  description: string;
  transaction_type: string;
  created_at: string;
}

export interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}
