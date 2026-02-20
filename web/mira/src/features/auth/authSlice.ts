// Auth state slice - placeholder for future state management (e.g. Redux/Zustand)
export interface AuthState {
  user: null | { email: string; name: string };
  isAuthenticated: boolean;
}

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
};
