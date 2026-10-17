import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { profile, loading, setProfile, refresh } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) refresh();
      else setProfile(null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) refresh();
        else setProfile(null);
      }
    );

    return () => sub.subscription.unsubscribe();
  }, []);

  return { profile, loading };
}
