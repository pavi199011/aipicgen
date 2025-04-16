
export interface User {
  id: string;
  email?: string | null;
  username?: string;
  full_name?: string;
  created_at: string;
  is_suspended?: boolean;
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

export interface UserDetailData extends User, UserStats {
  // Combined interface for user details
  // Make email explicitly optional with null possibility
  email?: string | null;
  is_suspended?: boolean;
}

export interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}
