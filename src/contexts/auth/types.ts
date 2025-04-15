
export interface AuthUser {
  id: string;
  email?: string;
  avatarUrl?: string;
  username?: string;
  isAdmin?: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
