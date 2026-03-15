"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAdminEmail, getAdminPassword } from "@/lib/auth";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const email = getAdminEmail();
    const pwd = getAdminPassword();
    if (email && pwd) {
      router.replace("/admin");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return null;
}
