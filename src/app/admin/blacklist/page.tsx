"use client";

import { useEffect, useState } from "react";
import { backendFetch } from "@/lib/api";

export default function AdminBlacklistPage() {
  const [emails, setEmails] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await backendFetch("/admin/blacklist/list", {
        method: "POST",
      });
      const data = (await res.json()) as { emails: string[] };
      setEmails(data.emails ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleAdd = async () => {
    const email = input.trim();
    if (!email) return;
    setLoading(true);
    try {
      await backendFetch("/admin/blacklist/add", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setInput("");
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    setLoading(true);
    try {
      await backendFetch("/admin/blacklist/remove", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      await load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
        Email Blacklist
      </h1>

      <div className="flex gap-3">
        <input
          type="email"
          className="flex-1 rounded-md bg-slate-950 border border-slate-800 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Nhập email cần chặn"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-indigo-600 text-xs font-medium text-slate-50 hover:bg-indigo-500 disabled:opacity-50"
        >
          Thêm
        </button>
      </div>

      <div className="border border-slate-800 rounded-md divide-y divide-slate-800">
        {emails.length === 0 && (
          <div className="px-4 py-3 text-sm text-slate-500">
            Chưa có email nào trong blacklist.
          </div>
        )}
        {emails.map((email) => (
          <div
            key={email}
            className="px-4 py-2 flex items-center justify-between text-sm"
          >
            <span className="text-slate-100">{email}</span>
            <button
              type="button"
              onClick={() => handleRemove(email)}
              disabled={loading}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Gỡ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

