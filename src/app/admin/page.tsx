"use client";

import Link from "next/link";
import { Database, Boxes, ShieldAlert, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Quản lý toàn bộ sàn Chobbi: Catalog, blacklist, seed dữ liệu.
          </p>
        </div>

        <Badge variant="outline" className="border-indigo-500 text-indigo-300">
          v1 • Internal
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Catalog */}
        <Link href="/admin/catalog">
          <Card className="h-full hover:border-indigo-500 hover:bg-slate-900/80 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-100">
                Catalog Management
              </CardTitle>
              <Boxes className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-3">
                Quản lý cây danh mục, attributes và attribute values cho toàn
                bộ sản phẩm.
              </p>
              <span className="inline-flex items-center text-xs text-indigo-300">
                Đi tới Catalog
                <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Blacklist */}
        <Link href="/admin/blacklist">
          <Card className="h-full hover:border-indigo-500 hover:bg-slate-900/80 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-100">
                Email Blacklist
              </CardTitle>
              <ShieldAlert className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-3">
                Thêm / xoá email khỏi blacklist toàn hệ thống.
              </p>
              <span className="inline-flex items-center text-xs text-indigo-300">
                Quản lý blacklist
                <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </CardContent>
          </Card>
        </Link>

        {/* Data Seeder */}
        <Link href="/admin/catalog/seed">
          <Card className="h-full hover:border-indigo-500 hover:bg-slate-900/80 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-100">
                Data Seeder
              </CardTitle>
              <Database className="h-4 w-4 text-indigo-400" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 mb-3">
                Seed nhanh attributes & attribute values từ JSON mẫu.
              </p>
              <span className="inline-flex items-center text-xs text-indigo-300">
                Mở Data Seeder
                <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

