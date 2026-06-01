export type UserRole = "admin" | "user";

export interface AuthUser {
  name: string;
  role: UserRole;
  profile: "sales" | "technical" | "csm" | null;
}

export const DEMO_USERS: AuthUser[] = [
  { name: "Admin",          role: "admin", profile: null       },
  { name: "Sales User",     role: "user",  profile: "sales"    },
  { name: "Technical User", role: "user",  profile: "technical"},
  { name: "CSM User",       role: "user",  profile: "csm"      },
];

const KEY = "albus_user";

export function getUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  localStorage.setItem(KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(KEY);
}

export function homeFor(user: AuthUser): string {
  return user.role === "admin" ? "/admin" : "/learn";
}
