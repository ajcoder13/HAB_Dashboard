"use client";

import { useState } from "react";
import { GetLogsParams } from "@/types/logs.types";
import { Search, SlidersHorizontal, RotateCcw, Settings2 } from "lucide-react";

interface FilterPanelProps {
  filters: GetLogsParams;
  onFiltersChange: (filters: Partial<GetLogsParams>) => void;
  onReset: () => void;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"];
const LOG_LEVELS = ["INFO", "WARN", "ERROR", "DEBUG"];
const SORT_OPTIONS = [
  { label: "Newest First", value: "desc" },
  { label: "Oldest First", value: "asc" },
];

export function Filters({
  filters,
  onFiltersChange,
  onReset,
}: FilterPanelProps) {
  const [primarySearch, setPrimarySearch] = useState("");
  const [plainTextSearch, setPlainTextSearch] = useState("");

  const [startDateInput, setStartDateInput] = useState(
    filters.startDate
      ? new Date(filters.startDate).toISOString().split("T")[0]
      : "",
  );
  const [endDateInput, setEndDateInput] = useState(
    filters.endDate
      ? new Date(filters.endDate).toISOString().split("T")[0]
      : "",
  );

  const hasActiveFilters =
    filters.method ||
    filters.level ||
    filters.status_code ||
    filters.endpoint ||
    filters.response_time_min ||
    filters.response_time_max ||
    filters.startDate ||
    filters.endDate;

  const toggleMethod = (m: string) => {
    onFiltersChange({ method: filters.method === m ? undefined : m });
  };

  const handleDateChange = (field: "startDate" | "endDate", raw: string) => {
    if (field === "startDate") setStartDateInput(raw);
    else setEndDateInput(raw);
    const ts = raw ? new Date(raw).getTime() : undefined;
    onFiltersChange({ [field]: ts });
  };

  const handleReset = () => {
    setPrimarySearch("");
    setPlainTextSearch("");
    setStartDateInput("");
    setEndDateInput("");
    onReset();
  };

  return (
    <div className="card mx-3 sm:mx-6 mt-4 p-0 overflow-hidden">
      {/* ── Search Row ──────────────────────────────────── */}
      <div
        className="flex flex-col sm:flex-row gap-3 p-4"
        style={{ borderBottom: "1px solid rgba(195,198,214,0.15)" }}>
        {/* Search By ID */}
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <input
            type="text"
            className="input-search w-full"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="Search by ID..."
            value={primarySearch}
            onChange={(e) => {
              setPrimarySearch(e.target.value);
              onFiltersChange({ id: e.target.value || undefined });
            }}
          />
        </div>

        {/* Plain text search */}
        <div className="relative flex-1">
          <SlidersHorizontal
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "var(--color-on-surface-variant)" }}
          />
          <input
            type="text"
            className="input-search w-full"
            style={{ paddingLeft: "2.75rem" }}
            placeholder="Plain Text Search: Error message, logs..."
            value={plainTextSearch}
            onChange={(e) => {
              setPlainTextSearch(e.target.value);
              onFiltersChange({ message: e.target.value || undefined });
            }}
          />
        </div>
      </div>

      {/* ── Filters Row ─────────────────────────────────── */}
      <div className="p-4">
        {/* Label row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings2
              size={13}
              style={{ color: "var(--color-on-surface-variant)" }}
            />
            <span className="label-sm">Active Filters</span>
          </div>
          {hasActiveFilters && (
            <button
              className="btn-tertiary py-0 px-0 text-xs gap-1"
              style={{ color: "var(--color-primary)", fontSize: "0.75rem" }}
              onClick={handleReset}>
              <RotateCcw size={11} />
              Reset All
            </button>
          )}
        </div>

        {/* Filter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4">
          {/* Date Range */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Date Range</span>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                className="input-search text-xs py-1.5 px-2 flex-1 min-w-0"
                style={{ fontSize: "0.75rem" }}
                value={startDateInput}
                onChange={(e) => handleDateChange("startDate", e.target.value)}
              />
              <span
                style={{
                  color: "var(--color-on-surface-variant)",
                  fontSize: "0.75rem",
                }}>
                →
              </span>
              <input
                type="date"
                className="input-search text-xs py-1.5 px-2 flex-1 min-w-0"
                style={{ fontSize: "0.75rem" }}
                value={endDateInput}
                onChange={(e) => handleDateChange("endDate", e.target.value)}
              />
            </div>
          </div>

          {/* HTTP Method */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">HTTP Method</span>
            <div className="flex flex-wrap gap-1.5">
              {HTTP_METHODS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMethod(m)}
                  className="chip"
                  style={{
                    fontSize: "0.6875rem",
                    padding: "0.2rem 0.6rem",
                    background:
                      filters.method === m
                        ? "var(--color-primary)"
                        : "var(--color-surface-container)",
                    color:
                      filters.method === m
                        ? "#fff"
                        : "var(--color-on-surface-variant)",
                    fontWeight: 600,
                    transition: "background 0.15s, color 0.15s",
                  }}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Status Code */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Status Code</span>
            <input
              type="text"
              className="input-search py-1.5"
              style={{ fontSize: "0.8125rem" }}
              placeholder="e.g. 200, 404, 5xx"
              value={filters.status_code ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                onFiltersChange({
                  status_code: v ? parseInt(v) : undefined,
                });
              }}
            />
          </div>

          {/* Service / Endpoint */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Service / Endpoint</span>
            <input
              type="text"
              className="input-search py-1.5"
              style={{ fontSize: "0.8125rem" }}
              placeholder="Filter by endpoint..."
              value={filters.endpoint ?? ""}
              onChange={(e) =>
                onFiltersChange({ endpoint: e.target.value || undefined })
              }
            />
          </div>

          {/* Log Level */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Log Level</span>
            <div className="relative">
              <select
                className="input-search py-1.5 appearance-none w-full cursor-pointer"
                style={{ fontSize: "0.8125rem" }}
                value={filters.level ?? ""}
                onChange={(e) =>
                  onFiltersChange({ level: e.target.value || undefined })
                }>
                <option value="">All Levels</option>
                {LOG_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-on-surface-variant)" }}>
                ▾
              </div>
            </div>
          </div>

          {/* Latency */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Latency (ms)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                className="input-search py-1.5 flex-1 min-w-0"
                style={{ fontSize: "0.8125rem" }}
                placeholder="Min"
                value={filters.response_time_min ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    response_time_min: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
              <span
                style={{
                  color: "var(--color-on-surface-variant)",
                  fontSize: "0.75rem",
                }}>
                –
              </span>
              <input
                type="number"
                className="input-search py-1.5 flex-1 min-w-0"
                style={{ fontSize: "0.8125rem" }}
                placeholder="Max"
                value={filters.response_time_max ?? ""}
                onChange={(e) =>
                  onFiltersChange({
                    response_time_max: e.target.value
                      ? Number(e.target.value)
                      : undefined,
                  })
                }
              />
            </div>
          </div>

          {/* Empty spacer col */}
          <div />

          {/* Sorting */}
          <div className="flex flex-col gap-1.5">
            <span className="label-sm">Sorting</span>
            <div className="relative">
              <select
                className="input-search py-1.5 appearance-none w-full cursor-pointer"
                style={{ fontSize: "0.8125rem" }}
                value={filters.order ?? "desc"}
                onChange={(e) =>
                  onFiltersChange({ order: e.target.value as "asc" | "desc" })
                }>
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <div
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "var(--color-on-surface-variant)" }}>
                ▾
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
