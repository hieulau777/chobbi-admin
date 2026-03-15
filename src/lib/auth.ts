const ADMIN_EMAIL_KEY = "chobbi_admin_email";
const ADMIN_PWD_KEY = "chobbi_admin_pwd";

export function getAdminEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ADMIN_EMAIL_KEY);
  } catch {
    return null;
  }
}

export function getAdminPassword(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ADMIN_PWD_KEY);
  } catch {
    return null;
  }
}

export function setAdminCredentials(email: string, pwd: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ADMIN_EMAIL_KEY, email);
    window.localStorage.setItem(ADMIN_PWD_KEY, pwd);
  } catch {
    // ignore
  }
}

export function clearAdminCredentials() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ADMIN_EMAIL_KEY);
    window.localStorage.removeItem(ADMIN_PWD_KEY);
  } catch {
    // ignore
  }
}

