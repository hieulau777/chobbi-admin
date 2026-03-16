import { Plus, Trash2, Loader2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AdminAttribute, AdminAttributeType } from "../types";

type AttributesTableProps = {
  selectedCategoryId: number | null;
  attributes: AdminAttribute[] | undefined;
  loadingAttributes: boolean;

  // create attribute
  newAttributeName: string;
  setNewAttributeName: (value: string) => void;
  newAttrRequired: boolean;
  setNewAttrRequired: (value: boolean) => void;
  newAttrCustom: boolean;
  setNewAttrCustom: (value: boolean) => void;
  newAttrMultiple: boolean;
  setNewAttrMultiple: (value: boolean) => void;
  newAttrType: AdminAttributeType;
  setNewAttrType: (value: AdminAttributeType) => void;
  createAttribute: () => void;
  createAttributePending: boolean;

  // selection
  selectedAttributeId: number | null;
  setSelectedAttributeId: (id: number | null) => void;

  // edit attribute form trigger
  setEditAttrName: (value: string) => void;
  setEditAttrRequired: (value: boolean) => void;
  setEditAttrCustom: (value: boolean) => void;
  setEditAttrMultiple: (value: boolean) => void;
  setShowAttrEdit: (value: boolean) => void;

  // delete
  deleteAttribute: (attributeId: number) => void;
};

export function AttributesTable({
  selectedCategoryId,
  attributes,
  loadingAttributes,
  newAttributeName,
  setNewAttributeName,
  newAttrRequired,
  setNewAttrRequired,
  newAttrCustom,
  setNewAttrCustom,
  newAttrMultiple,
  setNewAttrMultiple,
  newAttrType,
  setNewAttrType,
  createAttribute,
  createAttributePending,
  selectedAttributeId,
  setSelectedAttributeId,
  setEditAttrName,
  setEditAttrRequired,
  setEditAttrCustom,
  setEditAttrMultiple,
  setShowAttrEdit,
  deleteAttribute,
}: AttributesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-100">
          Attributes (Leaf only)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!selectedCategoryId ? (
          <p className="text-xs text-slate-400">
            Chọn một <span className="font-semibold">leaf category</span> bên
            trái để xem và chỉnh sửa attributes.
          </p>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  value={newAttributeName}
                  onChange={(e) => setNewAttributeName(e.target.value)}
                  placeholder="Tên attribute (ví dụ: Thương hiệu)"
                  className="flex-1 rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={createAttribute}
                  disabled={
                    !newAttributeName.trim() || createAttributePending
                  }
                >
                  {createAttributePending ? (
                    <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3 mr-1.5" />
                  )}
                  Thêm attribute
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
                {/** Required / Custom / Multi + Type selector */}
                {(() => {
                  const disableCustomAndMulti =
                    newAttrType === "BOOLEAN" || newAttrType === "DATE";
                  return (
                    <>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAttrRequired}
                    onChange={(e) => setNewAttrRequired(e.target.checked)}
                    className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
                  />
                  <span>Required</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAttrCustom}
                          disabled={disableCustomAndMulti}
                    onChange={(e) => setNewAttrCustom(e.target.checked)}
                    className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
                  />
                  <span>Allow custom</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAttrMultiple}
                          disabled={disableCustomAndMulti}
                    onChange={(e) => setNewAttrMultiple(e.target.checked)}
                    className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
                  />
                  <span>Allow multi-select</span>
                </label>
                      <label className="inline-flex items-center gap-1">
                        <span>Type</span>
                        <select
                          value={newAttrType}
                          onChange={(e) => {
                            const next = e.target
                              .value as AdminAttributeType;
                            setNewAttrType(next);
                            if (next === "BOOLEAN" || next === "DATE") {
                              setNewAttrCustom(false);
                              setNewAttrMultiple(false);
                            }
                          }}
                          className="rounded-md border border-slate-600 bg-slate-950 px-1.5 py-1 text-[11px]"
                        >
                          <option value="TEXT">TEXT</option>
                          <option value="NUMBER">NUMBER</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="DATE">DATE</option>
                        </select>
                      </label>
                    </>
                  );
                })()}
              </div>
            </div>

            {loadingAttributes ? (
              <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                Đang tải attributes...
              </div>
            ) : attributes && attributes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Tên</TableHead>
                    <TableHead className="w-16 text-center">Required</TableHead>
                    <TableHead className="w-16 text-center">Custom</TableHead>
                    <TableHead className="w-16 text-center">Multi</TableHead>
                    <TableHead className="w-16 text-center">Type</TableHead>
                    <TableHead className="w-24 text-center">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attributes.map((attr) => (
                    <TableRow
                      key={attr.id}
                      className={cn(
                        "hover:bg-slate-800/60",
                        selectedAttributeId === attr.id && "bg-slate-800/80"
                      )}
                    >
                      <TableCell className="max-w-[160px] truncate">
                        {attr.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {attr.isRequired ? "✓" : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {attr.isCustomAllow ? "✓" : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {attr.isMultipleAllow ? "✓" : ""}
                      </TableCell>
                      <TableCell className="text-center">
                        {attr.type}
                      </TableCell>
                      <TableCell className="text-center space-x-2">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-slate-600 px-2 py-1 text-[11px] text-slate-100 hover:border-indigo-400 hover:bg-slate-900/70 hover:text-indigo-200"
                          title="Edit attribute"
                          onClick={() => {
                            setSelectedAttributeId(attr.id);
                            setEditAttrName(attr.name);
                            setEditAttrRequired(attr.isRequired);
                            setEditAttrCustom(attr.isCustomAllow);
                            setEditAttrMultiple(attr.isMultipleAllow);
                            setShowAttrEdit(true);
                          }}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center rounded-md border border-slate-600 px-2 py-1 text-[11px] text-slate-100 hover:border-red-400 hover:bg-red-950/60 hover:text-red-200"
                          title="Delete attribute"
                          onClick={() => {
                            deleteAttribute(attr.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Xóa
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-xs text-slate-400 mt-2">
                Chưa có attribute nào cho category này.
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

