export interface AuthUser {
  id: string;
  email?: string;
  avatarUrl?: string | null;
  username?: string;
  isAdmin?: boolean;
  credits?: number;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<void>;
  adminSignIn: (credentials: { identifier: string; password: string }) => Promise<{ success: boolean }>;
}
