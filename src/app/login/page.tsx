"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { setAdminCredentials, clearAdminCredentials } from "@/lib/auth";
import { backendFetch } from "@/lib/api";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const redirect = searchParams.get("redirect") || "/admin";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    const trimmedPwd = pwd.trim();
    if (!trimmedEmail || !trimmedPwd) {
      setError("Vui lòng nhập email và mật khẩu.");
      return;
    }

    setLoading(true);
    try {
      // Lưu tạm thông tin để backendFetch gửi kèm header
      setAdminCredentials(trimmedEmail, trimmedPwd);

      const res = await backendFetch("/admin/blacklist/list", {
        method: "POST",
      });

      if (!res.ok) {
        clearAdminCredentials();
        setError("Sai email hoặc mật khẩu admin.");
        return;
      }

      router.replace(redirect);
    } catch {
      clearAdminCredentials();
      setError("Không thể kết nối tới server. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminCredentials();
    setEmail("");
    setPwd("");
    setError(null);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
      <div className="w-full max-w-md border border-slate-800 rounded-xl bg-slate-900/80 p-6 shadow-lg space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            autoComplete="off"
            className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            autoComplete="off"
            className="w-full rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Mật khẩu"
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
          />

          {error && (
            <p className="text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-indigo-600 text-xs font-medium text-slate-50 hover:bg-indigo-500 disabled:opacity-50 transition-colors"
            >
              Đăng nhập
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4"
            >
              Xoá thông tin đã lưu
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">Đang tải...</div>}>
      <LoginForm />
    </Suspense>
  );
}

