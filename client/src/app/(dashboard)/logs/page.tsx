"use client";

import { useLogs } from "@/features/logs/hooks/useLogs";
import { LogsHeader } from "@/features/logs/components/LogsHeader";
import { LogVolumeChart } from "@/features/logs/components/LogVolumeChart";
import { Filters } from "@/features/logs/components/Filters";
import { LogsTable } from "@/features/logs/components/LogsTable";

const PAGE_SIZE = 50;

export default function LogsPage() {
  const { data, total, loading, filters, isLive, setFilters, nextPage, prevPage } = useLogs({
    limit: PAGE_SIZE,
    order: "desc",
  });

  // Derive pagination state from offset + limit
  const currentPage = Math.floor((filters.offset ?? 0) / PAGE_SIZE) + 1;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleReset = () => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      level: undefined,
      endpoint: undefined,
      method: undefined,
      status_code: undefined,
      response_time_min: undefined,
      response_time_max: undefined,
      offset: 0,
      order: "desc",
    });
  };

  return (
    <div className="surface-base min-h-screen">
      {/* ── Header ────────────────────────────────────── */}
      <LogsHeader
        onCreateOptimizer={() => console.log("Create Optimizer")}
        onCreateAlert={() => console.log("Create Alert")}
        onExport={() => console.log("Export")}
      />

      {/* Hairline divider — ghost border, not a solid line */}
      <div
        style={{
          height: 1,
          background: "rgba(195,198,214,0.15)",
          marginLeft: 24,
          marginRight: 24,
        }}
      />

      {/* ── Chart ─────────────────────────────────────── */}
      <div className="pt-4">
        <LogVolumeChart />
      </div>

      {/* ── Filters ────────────────────────────── */}
      <Filters
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleReset}
      />

      {/* ── Logs table ─────────────────────────── */}
      <LogsTable
        logs={data}
        loading={loading}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        onNextPage={nextPage}
        onPrevPage={prevPage}
        isLive={isLive}
      />

      {/* ── Filter + Table sections come next ─────────── */}
      {/* FilterPanel and LogTable will be added in subsequent steps */}
    </div>
  );
}
