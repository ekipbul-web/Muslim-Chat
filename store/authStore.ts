import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/lib/roles";

export type Profile = {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  role: UserRole;
  is_banned: boolean;
  last_seen: string;
};

type AuthState = {
  profile: Profile | null;
  loading: boolean;
  setProfile: (p: Profile | null) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  loading: true,
  setProfile: (p) => set({ profile: p, loading: false }),
  refresh: async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return set({ profile: null, loading: false });
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    set({ profile: data as Profile, loading: false });
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ profile: null });
  },
}));
