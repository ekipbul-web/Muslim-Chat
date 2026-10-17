import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";

const isServer = typeof window === "undefined";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

let customStorage = undefined;
if (!isServer) {
  const AsyncStorage = require("@react-native-async-storage/async-storage").default;
  customStorage = AsyncStorage;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
