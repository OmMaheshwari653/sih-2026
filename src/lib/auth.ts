/**
 * Frontend-only session helpers. There is no backend or real authentication —
 * "logging in" writes the selected role and a display name to localStorage so
 * the portal headers can personalise the user menu.
 */

export type StoredUser = {
  name: string;
  role: "business" | "admin" | "lmo";
};

const STORAGE_KEY = "ovs.session.user";

export const storeSessionUser = (user: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const readSessionUser = (): StoredUser | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredUser;
    if (
      typeof parsed.name !== "string" ||
      !["business", "admin", "lmo"].includes(parsed.role)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearSessionUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const loginHrefForRole = (role: StoredUser["role"]): string =>
  role === "business"
    ? "/auth/business/login"
    : role === "admin"
      ? "/auth/admin/login"
      : "/auth/lmo/login";
