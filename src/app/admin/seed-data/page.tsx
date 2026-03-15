"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Play, Eye, AlertCircle, CheckCircle2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { backendFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

type PreviewData = unknown;

export default function SeedDataPage() {
  const [rawJson, setRawJson] = useState("");
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);

  const executeSyncMutation = useMutation({
    mutationFn: async (payload: unknown) => {
      const res = await backendFetch("/api/v1/admin/seed-attributes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          text || `Seed failed with status ${res.status.toString()}`
        );
      }

      return res.json().catch(() => null);
    },
  });

  const handlePreview = () => {
    setParseError(null);
    setPreviewData(null);

    if (!rawJson.trim()) {
      setParseError("Vui lòng dán JSON vào trước khi preview.");
      return;
    }

    try {
      const parsed = JSON.parse(rawJson);
      setPreviewData(parsed);
    } catch {
      setParseError("JSON không hợp lệ. Hãy kiểm tra lại cú pháp.");
    }
  };

  const handleExecute = () => {
    setParseError(null);

    if (!rawJson.trim()) {
      setParseError("Vui lòng dán JSON vào trước khi Execute Sync.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawJson);
    } catch {
      setParseError("JSON không hợp lệ. Hãy kiểm tra lại cú pháp.");
      return;
    }

    executeSyncMutation.mutate(parsed);
  };

  const renderPreview = () => {
    if (!previewData) return null;

    if (Array.isArray(previewData) && previewData.length > 0) {
      const first = previewData[0] as Record<string, unknown>;
      if (typeof first === "object" && first !== null) {
        const columns = Object.keys(first).slice(0, 8);

        return (
          <Card className="mt-4 bg-slate-900/60 border-slate-800">
            <CardHeader>
              <CardTitle className="text-sm text-slate-100">
                Preview (Table)
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col} className="text-xs text-slate-300">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewData.slice(0, 20).map((row, idx) => {
                    const r = row as Record<string, unknown>;
                    return (
                      <TableRow key={idx}>
                        {columns.map((col) => (
                          <TableCell
                            key={col}
                            className="text-xs text-slate-200 max-w-[200px] truncate"
                          >
                            {formatCellValue(r[col])}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              {previewData.length > 20 && (
                <p className="mt-2 text-xs text-slate-400">
                  Hiển thị 20 dòng đầu. Tổng: {previewData.length} bản ghi.
                </p>
              )}
            </CardContent>
          </Card>
        );
      }
    }

    return (
      <Card className="mt-4 bg-slate-900/60 border-slate-800">
        <CardHeader>
          <CardTitle className="text-sm text-slate-100">
            Preview (Raw JSON)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs text-slate-100 bg-slate-950/70 border border-slate-800 rounded-md p-3 overflow-auto max-h-[360px]">
            {JSON.stringify(previewData, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Data Seeder
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Dán JSON mẫu để sync attributes & attribute values qua API{" "}
          <code className="px-1 py-0.5 rounded bg-slate-900 text-xs border border-slate-800">
            POST /api/v1/admin/seed-attributes
          </code>
          .
        </p>
      </div>

      <Card className="bg-slate-900/60 border-slate-800">
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-sm text-slate-100">JSON Input</CardTitle>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Dán JSON array hoặc object.</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder='Ví dụ: [{ "categoryId": 1, "attributes": [...] }]'
            className="min-h-[260px] font-mono text-xs bg-slate-950/70 border-slate-800 text-slate-100"
          />

          {parseError && (
            <div className="flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>{parseError}</span>
            </div>
          )}

          {executeSyncMutation.isError && (
            <div className="flex items-start gap-2 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span>
                Seed thất bại:{" "}
                {(executeSyncMutation.error as Error).message || "Unknown error"}
              </span>
            </div>
          )}

          {executeSyncMutation.isSuccess && !executeSyncMutation.isPending && (
            <div className="flex items-start gap-2 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 mt-0.5" />
              <span>Seed thành công.</span>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-1.5" />
              Preview
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleExecute}
              disabled={executeSyncMutation.isPending}
              className={cn(
                "bg-indigo-600 hover:bg-indigo-500 text-white",
                executeSyncMutation.isPending && "opacity-80 cursor-wait"
              )}
            >
              <Play className="h-4 w-4 mr-1.5" />
              {executeSyncMutation.isPending ? "Executing..." : "Execute Sync"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {renderPreview()}
    </div>
  );
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

