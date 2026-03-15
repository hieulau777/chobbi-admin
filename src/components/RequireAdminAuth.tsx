"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getAdminEmail, getAdminPassword } from "@/lib/auth";

/**
 * Bắt buộc phải có JWT backend để truy cập các trang /admin (trừ trang login).
 * JWT này chính là token hiện tại backend trả về, được lưu trong localStorage.
 */
export function RequireAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname?.startsWith("/admin")) return;

    const email = getAdminEmail();
    const pwd = getAdminPassword();
    if (!email || !pwd) {
      const params = new URLSearchParams();
      if (pathname && pathname !== "/admin") {
        params.set("redirect", pathname);
      }
      const query = params.toString();
      router.replace(query ? `/login?${query}` : "/login");
    }
  }, [router, pathname]);

  return null;
}

