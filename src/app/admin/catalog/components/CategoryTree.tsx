import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminCategory } from "../types";

type CategoryTreeProps = {
  categories: AdminCategory[] | undefined;
  loadingCategories: boolean;
  selectedCategoryId: number | null;
  setSelectedCategoryId: (id: number | null) => void;
  setSelectedAttributeId: (id: number | null) => void;
  newRootCategoryName: string;
  setNewRootCategoryName: (value: string) => void;
  newChildCategoryName: string;
  setNewChildCategoryName: (value: string) => void;
  editCategoryName: string;
  setEditCategoryName: (value: string) => void;
  createRootCategory: () => void;
  createChildCategory: () => void;
  updateCategory: () => void;
  deleteCategory: () => void;
  createRootCategoryPending: boolean;
  createChildCategoryPending: boolean;
  updateCategoryPending: boolean;
  deleteCategoryPending: boolean;
};

export function CategoryTree({
  categories,
  loadingCategories,
  selectedCategoryId,
  setSelectedCategoryId,
  setSelectedAttributeId,
  newRootCategoryName,
  setNewRootCategoryName,
  newChildCategoryName,
  setNewChildCategoryName,
  editCategoryName,
  setEditCategoryName,
  createRootCategory,
  createChildCategory,
  updateCategory,
  deleteCategory,
  createRootCategoryPending,
  createChildCategoryPending,
  updateCategoryPending,
  deleteCategoryPending,
}: CategoryTreeProps) {
  const byParent: Record<string, AdminCategory[]> = {};

  if (categories && categories.length > 0) {
    for (const c of categories) {
      const key = String(c.parentId ?? "root");
      if (!byParent[key]) byParent[key] = [];
      byParent[key].push(c);
    }
  }

  const renderNodes = (parentId: number | null, level = 0): React.ReactElement[] => {
    const list = byParent[String(parentId ?? "root")] || [];
    return list.map((c) => {
      const isSelected = c.id === selectedCategoryId;
      const children = byParent[String(c.id)] || [];
      const isLeaf = children.length === 0;

      return (
        <div key={c.id} className="space-y-1">
          <button
            type="button"
            onClick={() => {
              setSelectedCategoryId(c.id);
              setSelectedAttributeId(null);
              setEditCategoryName(c.name);
            }}
            className={cn(
              "w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between",
              isSelected
                ? "bg-indigo-600 text-slate-50"
                : "hover:bg-slate-800 text-slate-200"
            )}
            style={{ paddingLeft: 8 + level * 12 }}
          >
            <span>
              {children.length > 0 ? "📂" : "📄"} {c.name}
            </span>
            {isLeaf && (
              <span className="text-[9px] uppercase tracking-wide text-emerald-300/80">
                Leaf
              </span>
            )}
          </button>
          {children.length > 0 && (
            <div className="pl-2 border-l border-slate-800 ml-1 space-y-1">
              {renderNodes(c.id, level + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-100">Category Tree</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={newRootCategoryName}
              onChange={(e) => setNewRootCategoryName(e.target.value)}
              placeholder="Tên root category mới"
              className="flex-1 rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            <Button
              type="button"
              size="sm"
              onClick={createRootCategory}
              disabled={!newRootCategoryName.trim() || createRootCategoryPending}
            >
              {createRootCategoryPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <Plus className="h-3 w-3 mr-1.5" />
              )}
              Root
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newChildCategoryName}
              onChange={(e) => setNewChildCategoryName(e.target.value)}
              placeholder="Tên child category (thuộc category đang chọn)"
              className="flex-1 rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
            />
            <Button
              type="button"
              size="sm"
              onClick={createChildCategory}
              disabled={
                !selectedCategoryId ||
                !newChildCategoryName.trim() ||
                createChildCategoryPending
              }
            >
              {createChildCategoryPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <Plus className="h-3 w-3 mr-1.5" />
              )}
              Child
            </Button>
          </div>
          {selectedCategoryId && (
            <div className="flex items-center gap-2 pt-1">
              <input
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
                placeholder="Đổi tên category đang chọn"
                className="flex-1 rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-[11px] text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={updateCategory}
                disabled={updateCategoryPending}
              >
                {updateCategoryPending ? (
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                ) : null}
                Lưu
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="border-red-500 text-red-300 hover:bg-red-950/60"
                onClick={deleteCategory}
                disabled={deleteCategoryPending}
              >
                {deleteCategoryPending ? (
                  <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                ) : null}
                Xóa
              </Button>
            </div>
          )}
        </div>

        <div className="max-h-[420px] overflow-auto pt-2 border-t border-slate-800">
          {loadingCategories ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <Loader2 className="h-3 w-3 animate-spin" />
              Đang tải categories...
            </div>
          ) : !categories || categories.length === 0 ? (
            <p className="text-xs text-slate-400">
              Chưa có category nào. Hãy seed từ backend hoặc thêm bằng API admin.
            </p>
          ) : (
            <div className="space-y-1">{renderNodes(null)}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

