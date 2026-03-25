// src/features/logs/hooks/useLogs.ts
"use client";

import { useEffect, useState } from "react";
import { LogsService } from "../services/logs.service";
import { GetLogsParams } from "@/types/logs.types";

export function useLogs(initialFilters: GetLogsParams = {}) {
  const [filters, setFilters] = useState<GetLogsParams>({
    limit: 50,
    offset: 0,
    sort: "timestamp",
    order: "desc",
    ...initialFilters,
  });

  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await LogsService.getLogs(filters);
      setData(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // refetch on filters change
  useEffect(() => {
    fetchLogs();
  }, [filters]);

  // 🧹 delete all logs
  const deleteAll = async () => {
    await LogsService.deleteAll();
    fetchLogs();
  };

  // delete with current filters
  const deleteFiltered = async () => {
    await LogsService.deleteByFilter(filters);
    fetchLogs();
  };

  // pagination helpers
  const nextPage = () => {
    setFilters((f) => ({
      ...f,
      offset: (f.offset || 0) + (f.limit || 50),
    }));
  };

  const prevPage = () => {
    setFilters((f) => ({
      ...f,
      offset: Math.max((f.offset || 0) - (f.limit || 50), 0),
    }));
  };

  // update filters safely
  const updateFilters = (newFilters: Partial<GetLogsParams>) => {
    setFilters((f) => ({
      ...f,
      ...newFilters,
      offset: 0, // reset pagination on filter change
    }));
  };

  return {
    data,
    loading,
    error,

    filters,
    setFilters: updateFilters,

    refetch: fetchLogs,

    nextPage,
    prevPage,

    deleteAll,
    deleteFiltered,
  };
}
