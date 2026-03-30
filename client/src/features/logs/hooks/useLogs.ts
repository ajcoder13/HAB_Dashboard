"use client";

import { useEffect, useState, useCallback } from "react";
import { LogsService } from "../services/logs.service";
import { GetLogsParams, Log } from "@/types/logs.types";
import { getSocket } from "@/lib/socket";

const DEFAULT_LIMIT = 50;

export function useLogs(initialFilters: GetLogsParams = {}) {
  const [filters, setFiltersState] = useState<GetLogsParams>({
    limit: DEFAULT_LIMIT,
    offset: 0,
    sort: "timestamp",
    order: "desc",
    ...initialFilters,
  });

  const [data, setData] = useState<Log[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);

  const fetchLogs = useCallback(async (f: GetLogsParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await LogsService.getLogs(f);
      setData(res.data);
      setTotal(res.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs(filters);
  }, [filters, fetchLogs]);

  useEffect(() => {
    const socket = getSocket();

    const handleNewLog = (payload: {
      table: string;
      action: string;
      record: Log;
    }) => {
      if (
        payload.table === "server_logs" &&
        payload.action === "INSERT" &&
        payload.record
      ) {
        const newLog = payload.record;

        setData((prevData) => {
          const exists = prevData.some((log) => log.id === newLog.id);
          if (exists) return prevData;
          return [newLog, ...prevData].slice(0, DEFAULT_LIMIT);
        });
        setTotal((prevTotal) => prevTotal + 1);
      }
    };

    socket.on("db_updated", handleNewLog);
    socket.on("connect", () => setIsLive(true));
    socket.on("disconnect", () => setIsLive(false));

    return () => {
      socket.off("db_updated", handleNewLog);
    };
  }, []);

  const updateFilters = (newFilters: Partial<GetLogsParams>) => {
    setFiltersState((f) => ({
      ...f,
      ...newFilters,
      offset: 0, // reset to first page on any filter change
    }));
  };

  const nextPage = () => {
    setFiltersState((f) => ({
      ...f,
      offset: (f.offset ?? 0) + (f.limit ?? DEFAULT_LIMIT),
    }));
  };

  const prevPage = () => {
    setFiltersState((f) => ({
      ...f,
      offset: Math.max((f.offset ?? 0) - (f.limit ?? DEFAULT_LIMIT), 0),
    }));
  };

  const resetFilters = () => {
    setFiltersState({
      limit: DEFAULT_LIMIT,
      offset: 0,
      sort: "timestamp",
      order: "desc",
    });
  };

  const deleteAll = async () => {
    await LogsService.deleteAll();
    fetchLogs(filters);
  };

  const deleteFiltered = async () => {
    await LogsService.deleteByFilter(filters);
    fetchLogs(filters);
  };

  // If the API returned exactly `limit` rows, there's likely a next page.
  // If it returned fewer, we're on the last page.
  const hasMore = data.length === (filters.limit ?? DEFAULT_LIMIT);

  return {
    data,
    total,
    loading,
    error,
    isLive,

    filters,
    setFilters: updateFilters,
    resetFilters,

    hasMore,

    refetch: () => fetchLogs(filters),
    nextPage,
    prevPage,

    deleteAll,
    deleteFiltered,
  };
}
