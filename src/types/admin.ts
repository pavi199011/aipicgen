export interface User {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  created_at: string;
  is_suspended?: boolean;
}

export interface UserStats {
  id: string;
  email?: string;
  username?: string;
  full_name?: string;
  imageCount: number;
}

export type SortDirection = "asc" | "desc";
export type SortField = "username" | "created_at" | "imageCount" | "full_name" | "email";

export interface UserSortState {
  field: SortField;
  direction: SortDirection;
}

export interface UserFilterState {
  username: string;
}

export interface UserDetailData extends User, UserStats {
  // Combined interface for user details
}

export interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}
