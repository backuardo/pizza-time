import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@supabase/supabase-js';

import { createClient } from '@/utils/supabase/client';

type AuthStore = {
  user: User | null;
  errorMessage: string | null;
  signUp: (args: { email: string; password: string }) => Promise<void>;
  signIn: (args: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create(
  // Persist the store to localStorage.
  // NOTE: rehydration hack needed to prevent hydration mismatch error.
  persist<AuthStore>(
    (set) => ({
      user: null,
      errorMessage: null,
      signIn: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        const { data, error } = await createClient().auth.signInWithPassword({
          email,
          password,
        });
        if (data.user) {
          set({ user: data.user });
        }
        if (error) {
          set({ errorMessage: error.message });
        }
      },
      signUp: async ({
        email,
        password,
      }: {
        email: string;
        password: string;
      }) => {
        const { data, error } = await createClient().auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_ORIGIN}/api/auth/callback`,
          },
        });
        if (data.user) {
          set({ user: data.user });
        }
        if (error) {
          set({ errorMessage: error.message });
        }
      },
      signOut: async () => {
        const { error } = await createClient().auth.signOut();
        if (error) {
          set({ errorMessage: error.message });
        } else {
          set({ user: null });
        }
      },
    }),
    {
      name: 'pizza-time-auth-storage',
      skipHydration: true,
    }
  )
);
