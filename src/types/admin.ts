
export interface User {
  id: string;
  email?: string;
  username?: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  email?: string;
  username?: string;
  imageCount: number;
}
