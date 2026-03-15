"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backendFetch } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

type SellerUsageGuide = {
  id?: string | null;
  title: string | null;
  content: string | null;
  youtubeUrl: string | null;
  seedButtonEnabled: boolean;
  seedConfigJson?: string | null;
};

export default function SellerUsageGuidePage() {
  const [form, setForm] = useState<SellerUsageGuide>({
    id: null,
    title: "",
    content: "",
    youtubeUrl: "",
    seedButtonEnabled: false,
    seedConfigJson: "",
  });

  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery<SellerUsageGuide>({
    queryKey: ["admin-seller-usage-guide"],
    queryFn: async () => {
      const res = await backendFetch("/admin/usage-guide/seller");
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Không tải được hướng dẫn seller");
      }
      return res.json();
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        id: data.id ?? null,
        title: data.title ?? "",
        content: data.content ?? "",
        youtubeUrl: data.youtubeUrl ?? "",
        seedButtonEnabled: data.seedButtonEnabled ?? false,
        seedConfigJson: data.seedConfigJson ?? "",
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: SellerUsageGuide) => {
      const res = await backendFetch("/admin/usage-guide/seller", {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Lưu hướng dẫn thất bại");
      }
      return res.json() as Promise<SellerUsageGuide>;
    },
    onSuccess: (saved) => {
      setForm({
        id: saved.id ?? null,
        title: saved.title ?? "",
        content: saved.content ?? "",
        youtubeUrl: saved.youtubeUrl ?? "",
        seedButtonEnabled: saved.seedButtonEnabled ?? false,
        seedConfigJson: saved.seedConfigJson ?? "",
      });
      setSaveError(null);
      setSaveMessage("Đã lưu hướng dẫn sử dụng cho seller.");
      setTimeout(() => setSaveMessage(null), 3000);
    },
    onError: (error: unknown) => {
      const err = error as Error;
      setSaveMessage(null);
      setSaveError(err.message || "Lưu hướng dẫn thất bại");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    saveMutation.mutate(form);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Hướng dẫn sử dụng cho Seller
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Quản lý nội dung phần hướng dẫn ở sidebar seller: tiêu đề, đoạn mô tả,
          video YouTube và trạng thái hiển thị nút seed data.
        </p>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100">
            Cấu hình hướng dẫn seller
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải thông tin hướng dẫn...
            </div>
          ) : isError ? (
            <div className="flex items-start gap-2 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>
                Không tải được dữ liệu hướng dẫn. Kiểm tra lại backend hoặc cấu
                hình MongoDB.
              </span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 max-w-2xl text-sm text-slate-100"
            >
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-xs font-medium text-slate-300"
                >
                  Tiêu đề hiển thị
                </label>
                <input
                  id="title"
                  type="text"
                  value={form.title ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="block w-full rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ví dụ: Hướng dẫn sử dụng kênh bán hàng"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="content"
                  className="block text-xs font-medium text-slate-300"
                >
                  Nội dung hướng dẫn (paragraph)
                </label>
                <Textarea
                  id="content"
                  value={form.content ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="min-h-[140px] bg-slate-950/70 border-slate-800 text-slate-100"
                  placeholder="Nhập nội dung hướng dẫn ngắn gọn cho seller..."
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="youtubeUrl"
                  className="block text-xs font-medium text-slate-300"
                >
                  Link video YouTube
                </label>
                <input
                  id="youtubeUrl"
                  type="text"
                  value={form.youtubeUrl ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, youtubeUrl: e.target.value }))
                  }
                  className="block w-full rounded-md border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=xxxx"
                />
                <p className="text-xs text-slate-500">
                  Seller frontend sẽ nhúng video này vào iframe. Có thể dùng
                  link dạng watch hoặc embed, frontend sẽ xử lý nhẹ.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="seedConfigJson"
                  className="block text-xs font-medium text-slate-300"
                >
                  JSON seed sản phẩm demo (AdminProductSeedRequest)
                </label>
                <Textarea
                  id="seedConfigJson"
                  value={form.seedConfigJson ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      seedConfigJson: e.target.value,
                    }))
                  }
                  className="min-h-[180px] font-mono text-[11px] bg-slate-950/70 border-slate-800 text-slate-100"
                  placeholder='Ví dụ: { "email": "", "products": [ { "categoryPath": { "rootName": "Thời trang nam", "leafName": "Áo thun" }, "name": "...", "variations": [ ... ] } ] }'
                />
                <p className="text-xs text-slate-500">
                  Dán JSON theo format <code>AdminProductSeedRequest</code> (giống file{" "}
                  <code>product_seed_thoitrangnam_aothun.json</code>). Khi seller bấm nút
                  seed trên trang hướng dẫn, hệ thống sẽ dùng JSON này và tự gắn email
                  của seller hiện tại.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-950/60 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    Bật nút seed data cho seller
                  </p>
                  <p className="text-xs text-slate-400">
                    Khi bật, sidebar seller sẽ hiển thị nút seed data demo trên
                    sidebar seller.
                  </p>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={form.seedButtonEnabled}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seedButtonEnabled: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-indigo-500"
                  />
                  <span>Bật</span>
                </label>
              </div>

              {saveError && (
                <div className="flex items-start gap-2 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}

              {saveMessage && (
                <div className="flex items-start gap-2 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  <span>{saveMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                size="sm"
                disabled={saveMutation.isPending}
                className="bg-indigo-600 hover:bg-indigo-500 text-white"
              >
                {saveMutation.isPending && (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                )}
                Lưu cấu hình
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

