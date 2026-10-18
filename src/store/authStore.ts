import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  userName: string | null;
  // Two values in, nothing invented. The login page gets them from
  // the API and hands them here.
  setSession: (token: string, userName: string) => void;
  logout: () => void;
}

// This file deliberately does not import ../api/client. client.ts
// reads the token out of this store on every request, so a store that
// called client.ts back would be an import loop. Keeping the fetching
// in the pages and the state here means the arrow only points one way.

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      setSession: (token, userName) => set({ token, userName }),
      logout: () => set({ token: null, userName: null }),
    }),
    {
      name: "itelect4-auth", // the localStorage key it writes to
      partialize: (state) => ({
        token: state.token,
        userName: state.userName,
      }),
    }
  )
);

export default useAuthStore;
