import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SelectedAttribute } from "../types";

type EditAttributeFormProps = {
  selectedAttribute: SelectedAttribute;
  showAttrEdit: boolean;
  editAttrName: string;
  setEditAttrName: (value: string) => void;
  editAttrRequired: boolean;
  setEditAttrRequired: (value: boolean) => void;
  editAttrCustom: boolean;
  setEditAttrCustom: (value: boolean) => void;
  editAttrMultiple: boolean;
  setEditAttrMultiple: (value: boolean) => void;
  updateAttribute: () => void;
  updateAttributePending: boolean;
};

export function EditAttributeForm({
  selectedAttribute,
  showAttrEdit,
  editAttrName,
  setEditAttrName,
  editAttrRequired,
  setEditAttrRequired,
  editAttrCustom,
  setEditAttrCustom,
  editAttrMultiple,
  setEditAttrMultiple,
  updateAttribute,
  updateAttributePending,
}: EditAttributeFormProps) {
  if (!selectedAttribute || !showAttrEdit) return null;

  const isBooleanOrDate =
    selectedAttribute.type === "BOOLEAN" || selectedAttribute.type === "DATE";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-slate-100">
          Edit attribute
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div className="space-y-2">
          <label className="block text-slate-300 mb-1">Tên attribute</label>
          <input
            value={editAttrName}
            onChange={(e) => setEditAttrName(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-950/70 px-2 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Type: <span className="font-mono">{selectedAttribute.type}</span>
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={editAttrRequired}
              onChange={(e) => setEditAttrRequired(e.target.checked)}
              className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
            />
            <span>Required</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={editAttrCustom}
              disabled={isBooleanOrDate}
              onChange={(e) => setEditAttrCustom(e.target.checked)}
              className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
            />
            <span>Allow custom</span>
          </label>
          <label className="inline-flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={editAttrMultiple}
              disabled={isBooleanOrDate}
              onChange={(e) => setEditAttrMultiple(e.target.checked)}
              className="h-3 w-3 rounded border-slate-600 bg-slate-950 text-indigo-500"
            />
            <span>Allow multi-select</span>
          </label>
        </div>
        <Button
          type="button"
          size="sm"
          onClick={updateAttribute}
          disabled={updateAttributePending}
        >
          {updateAttributePending ? (
            <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
          ) : null}
          Lưu attribute
        </Button>
      </CardContent>
    </Card>
  );
}

