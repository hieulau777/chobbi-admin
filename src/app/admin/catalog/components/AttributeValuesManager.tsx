import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { AdminAttributeValue } from "../types";

type AttributeValuesManagerProps = {
  selectedAttributeId: number | null;
  attributeValues: AdminAttributeValue[] | undefined;
  loadingValues: boolean;

  newAttributeValuesInput: string;
  setNewAttributeValuesInput: (value: string) => void;
  createAttributeValues: () => void;
  createAttributeValuesPending: boolean;

  editingValueId: number | null;
  setEditingValueId: (id: number | null) => void;
  editingValueText: string;
  setEditingValueText: (value: string) => void;
  editingValueCustom: boolean;
  setEditingValueCustom: (value: boolean) => void;

  updateAttributeValue: () => void;
  updateAttributeValuePending: boolean;
  deleteAttributeValue: (id: number) => void;
};

export function AttributeValuesManager({
  selectedAttributeId,
  attributeValues,
  loadingValues,
  newAttributeValuesInput,
  setNewAttributeValuesInput,
  createAttributeValues,
  createAttributeValuesPending,
  editingValueId,
  setEditingValueId,
  editingValueText,
  setEditingValueText,
  editingValueCustom,
  setEditingValueCustom,
  updateAttributeValue,
  updateAttributeValuePending,
  deleteAttributeValue,
}: AttributeValuesManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-100">
          Attribute values
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!selectedAttributeId ? (
          <p className="text-xs text-slate-400">
            Chọn một attribute rồi thêm / quản lý values.
          </p>
        ) : (
          <>
            <Textarea
              value={newAttributeValuesInput}
              onChange={(e) => setNewAttributeValuesInput(e.target.value)}
              placeholder="Nhập nhanh nhiều giá trị, phân tách bằng dấu phẩy. Ví dụ: Nike, Adidas, Puma"
              className="min-h-[80px] text-xs"
            />
            <Button
              type="button"
              size="sm"
              onClick={createAttributeValues}
              disabled={
                !newAttributeValuesInput.trim() || createAttributeValuesPending
              }
            >
              {createAttributeValuesPending ? (
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
              ) : (
                <Plus className="h-3 w-3 mr-1.5" />
              )}
              Thêm values
            </Button>

            {loadingValues ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang tải attribute values...
              </div>
            ) : attributeValues && attributeValues.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Value</TableHead>
                    <TableHead className="w-16 text-center">Custom</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributeValues.map((val) => (
                    <TableRow
                      key={val.id}
                      className={cn(
                        "cursor-pointer hover:bg-slate-800/60",
                        editingValueId === val.id && "bg-slate-800/80"
                      )}
                      onClick={() => {
                        setEditingValueId(val.id);
                        setEditingValueText(
                          val.valueText ??
                            val.valueNumber?.toString() ??
                            (val.valueBoolean != null
                              ? String(val.valueBoolean)
                              : val.valueDate ?? "")
                        );
                        setEditingValueCustom(val.isCustom);
                      }}
                    >
                      <TableCell>
                        {val.valueText ??
                          val.valueNumber ??
                          (val.valueBoolean != null
                            ? String(val.valueBoolean)
                            : val.valueDate ?? "")}
                      </TableCell>
                      <TableCell className="text-center">
                        {val.isCustom ? "✓" : ""}
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          type="button"
                          className="text-slate-400 hover:text-red-400"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAttributeValue(val.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Chưa có attribute value nào cho attribute này.
              </p>
            )}

            {editingValueId && (
              <div className="space-y-2 pt-3 border-t border-slate-800 mt-2">
                <div>
                  <label className="block text-slate-300 mb-1 text-xs">
                    Edit value
                  </label>
                  <input
                    value={editingValueText}
                    onChange={(e) => setEditingValueText(e.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  />
                </div>
                <label className="inline-flex items-center gap-1 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={editingValueCustom}
                    onChange={(e) => setEditingValueCustom(e.target.checked)}
                    className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
                  />
                  <span>Custom value</span>
                </label>
                <Button
                  type="button"
                  size="sm"
                  onClick={updateAttributeValue}
                  disabled={updateAttributeValuePending}
                >
                  {updateAttributeValuePending ? (
                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  ) : null}
                  Lưu value
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

