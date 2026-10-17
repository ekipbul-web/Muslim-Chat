export type UserRole =
  | "user"
  | "assistant"
  | "moderator"
  | "technical_admin"
  | "curator_admin";

export const ROLE_LEVELS: Record<UserRole, number> = {
  user: 0,
  assistant: 1,
  moderator: 2,
  technical_admin: 3,
  curator_admin: 4,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  user: "Kullanıcı",
  assistant: "Asistan",
  moderator: "Moderatör",
  technical_admin: "Teknik Admin",
  curator_admin: "Küratör",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  user: "#6B7280",
  assistant: "#10B981",
  moderator: "#3B82F6",
  technical_admin: "#F59E0B",
  curator_admin: "#DC2626",
};

export function hasRole(userRole: UserRole, minRole: UserRole): boolean {
  return ROLE_LEVELS[userRole] >= ROLE_LEVELS[minRole];
}
