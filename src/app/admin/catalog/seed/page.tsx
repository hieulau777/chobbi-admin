"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { backendFetch } from "@/lib/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { AdminCategory } from "../types";

export default function CatalogSeedPage() {
  // ===== State cho JSON =====
  const [categoryJson, setCategoryJson] = useState<string>("[]");
  const [attributeJson, setAttributeJson] = useState<string>(
    JSON.stringify(
      {
        categoryPath: {
          rootName: "",
          leafName: "",
        },
        attributes: [],
      },
      null,
      2
    )
  );

  const [selectedLeafIds, setSelectedLeafIds] = useState<number[]>([]);
  const [productJson, setProductJson] = useState<string>(
    JSON.stringify(
      {
        email: "",
        products: [],
      },
      null,
      2
    )
  );

  // ===== Fetch leaf categories =====
  const {
    data: leafCategories,
    isLoading: loadingLeafs,
    isError: leafError,
  } = useQuery<AdminCategory[]>({
    queryKey: ["admin-leaf-categories"],
    queryFn: async () => {
      const res = await backendFetch("/admin/catalog/categories/leaf");
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Failed to load leaf categories");
      }
      return res.json();
    },
  });

  const leafById = useMemo(() => {
    const map = new Map<number, AdminCategory>();
    (leafCategories ?? []).forEach((c) => map.set(c.id, c));
    return map;
  }, [leafCategories]);

  // Khi chọn leaf categories, tự sinh template JSON cho phần attribute seed
  const handleToggleLeaf = (id: number) => {
    setSelectedLeafIds((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((x) => x !== id) : [...prev, id];

      if (next.length === 0) {
        // Không chọn gì thì giữ nguyên JSON user đang viết
        return next;
      }

      const payload = next.map((leafId) => {
        const cat = leafById.get(leafId);
        return {
          categoryPath: {
            rootName: cat?.parentId == null ? cat?.name ?? "" : "",
            leafName: cat?.name ?? "",
          },
          attributes: [],
        };
      });

      setAttributeJson(JSON.stringify(payload, null, 2));

      return next;
    });
  };

  // ===== Mutations =====

  const seedCategoryMutation = useMutation({
    mutationFn: async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(categoryJson);
      } catch (e) {
        // eslint-disable-next-line no-alert
        window.alert("JSON category không hợp lệ");
        throw e;
      }

      const res = await backendFetch("/admin/catalog/categories/seed-tree", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Seed category tree thất bại");
      }
      return res.json();
    },
    onSuccess: () => {
      // eslint-disable-next-line no-alert
      window.alert("Seed category tree thành công");
    },
    onError: (e: unknown) => {
      const err = e as Error;
      // eslint-disable-next-line no-alert
      window.alert(err.message);
    },
  });

  const seedAttributeMutation = useMutation({
    mutationFn: async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(attributeJson);
      } catch (e) {
        // eslint-disable-next-line no-alert
        window.alert("JSON attribute không hợp lệ");
        throw e;
      }

      const res = await backendFetch("/admin/catalog/categories/seed-attributes", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Seed attributes thất bại");
      }
      return res.json();
    },
    onSuccess: () => {
      // eslint-disable-next-line no-alert
      window.alert("Seed attributes thành công");
    },
    onError: (e: unknown) => {
      const err = e as Error;
      // eslint-disable-next-line no-alert
      window.alert(err.message);
    },
  });

  const seedProductMutation = useMutation({
    mutationFn: async () => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(productJson);
      } catch (e) {
        // eslint-disable-next-line no-alert
        window.alert("JSON product không hợp lệ");
        throw e;
      }

      const res = await backendFetch("/admin/catalog/products/seed", {
        method: "POST",
        body: JSON.stringify(parsed),
      });
      if (!res.ok) {
        const t = await res.text().catch(() => "");
        throw new Error(t || "Seed products thất bại");
      }
      return res.text();
    },
    onSuccess: () => {
      // eslint-disable-next-line no-alert
      window.alert("Seed products thành công");
    },
    onError: (e: unknown) => {
      const err = e as Error;
      // eslint-disable-next-line no-alert
      window.alert(err.message);
    },
  });

  // ===== Render =====

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Seed dữ liệu Catalog
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Công cụ nội bộ để seed nhanh category tree, attributes/attribute values và products.
          Chỉ dùng trong môi trường dev / staging.
        </p>
      </div>

      <div className="space-y-6">
        {/* Seed category tree */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-100">
              1. Seed Category Tree (JSON)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-400">
              Dán JSON dạng cây category vào bên dưới. Backend sẽ kiểm tra:
              <br />
              - Không trùng tên với category đã tồn tại
              <br />
              - Không trùng tên trong chính payload JSON
            </p>
            <Textarea
              value={categoryJson}
              onChange={(e) => setCategoryJson(e.target.value)}
              className="min-h-[220px] font-mono text-[11px]"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => seedCategoryMutation.mutate()}
              disabled={seedCategoryMutation.isPending}
            >
              {seedCategoryMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : null}
              Seed category tree
            </Button>
          </CardContent>
        </Card>

        {/* Seed attributes + values */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-100">
              2. Seed Attributes + Attribute Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="space-y-2">
              <p className="text-slate-400">
                Chọn một hoặc nhiều <span className="font-semibold">leaf category</span> hiện có
                để sinh ra template JSON chứa{" "}
                <span className="font-mono">categoryPath.rootName</span> và{" "}
                <span className="font-mono">categoryPath.leafName</span>.
                Phần JSON này chủ yếu để bạn copy đưa vào AI chuẩn bị payload.
              </p>
              <div className="border border-slate-800 rounded-md p-2 max-h-[200px] overflow-auto space-y-1 bg-slate-950/40">
                {loadingLeafs ? (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Đang tải leaf categories...
                  </div>
                ) : leafError ? (
                  <p className="text-red-400">
                    Lỗi khi tải leaf categories. Kiểm tra lại backend.
                  </p>
                ) : !leafCategories || leafCategories.length === 0 ? (
                  <p className="text-slate-400">
                    Chưa có leaf category nào. Hãy seed category tree trước.
                  </p>
                ) : (
                  leafCategories.map((cat) => (
                    <label
                      key={cat.id}
                      className="flex items-center gap-2 text-[11px] text-slate-200 cursor-pointer hover:bg-slate-900/60 px-1 py-0.5 rounded"
                    >
                      <input
                        type="checkbox"
                        className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
                        checked={selectedLeafIds.includes(cat.id)}
                        onChange={() => handleToggleLeaf(cat.id)}
                      />
                      <span>
                        #{cat.id} - {cat.name}
                      </span>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-slate-400">
                JSON gửi lên API{" "}
                <span className="font-mono">
                  POST /admin/catalog/categories/seed-attributes
                </span>
              </p>
              <Textarea
                value={attributeJson}
                onChange={(e) => setAttributeJson(e.target.value)}
                className="min-h-[260px] font-mono text-[11px]"
              />
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => seedAttributeMutation.mutate()}
              disabled={seedAttributeMutation.isPending}
            >
              {seedAttributeMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : null}
              Seed attributes cho category
            </Button>
          </CardContent>
        </Card>

        {/* Seed products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-slate-100">
              3. Seed Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-400">
              Dán JSON seed product vào bên dưới. API nhận payload dạng{" "}
              <span className="font-mono">AdminProductSeedRequest</span>:
              <br />
              - <span className="font-mono">email</span>: email seller (tạm, sau này thay bằng
              auth)
              <br />- <span className="font-mono">products[]</span>: danh sách sản phẩm, mỗi item
              gồm <span className="font-mono">categoryPath</span> (rootName + leafName) và
              payload product.
            </p>
            <Textarea
              value={productJson}
              onChange={(e) => setProductJson(e.target.value)}
              className="min-h-[260px] font-mono text-[11px]"
            />
            <Button
              type="button"
              size="sm"
              onClick={() => seedProductMutation.mutate()}
              disabled={seedProductMutation.isPending}
            >
              {seedProductMutation.isPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : null}
              Seed products
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

