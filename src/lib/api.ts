import { getAdminEmail, getAdminPassword } from "./auth";

export async function backendFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const url = `/api/backend${path.startsWith("/") ? path : `/${path}`}`;

  const isBrowser = typeof window !== "undefined";
  const email = isBrowser ? getAdminEmail() : null;
  const pwd = isBrowser ? getAdminPassword() : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options?.headers || {}),
    ...(email && pwd
      ? {
          "X-Admin-Email": email,
          "X-Admin-Pwd": pwd,
        }
      : {}),
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

