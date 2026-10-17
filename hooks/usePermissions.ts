import { ROLE_LEVELS } from "@/lib/roles";
import { useAuthStore } from "@/store/authStore";

export function usePermissions() {
  const profile = useAuthStore((s) => s.profile);
  const role = profile?.role ?? "user";
  const level = ROLE_LEVELS[role];

  return {
    role,
    level,
    isCurator: role === "curator_admin",
    isTechnicalAdmin: level >= 3,
    isModerator: level >= 2,
    isAssistant: level >= 1,
    isAdmin: level >= 2,
  };
}
