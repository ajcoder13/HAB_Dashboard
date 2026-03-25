"use client";

import { useLogs } from "@/features/logs/hooks/useLogs";

export default function LogsPage() {
  const { data, loading, filters, setFilters, nextPage, prevPage } = useLogs();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilters({ level: "ERROR" })}>Errors</button>

        <button onClick={() => setFilters({ level: undefined })}>All</button>
      </div>

      {/* Logs */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-2">
          {data.map((log) => (
            <div key={log.id} className="card">
              <div className="flex justify-between text-sm">
                <span>
                  {log.method} {log.url}
                </span>
                <span>{log.status_code}</span>
              </div>

              <p className="text-on-surface-variant text-sm">{log.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex gap-2">
        <button onClick={prevPage}>Prev</button>
        <button onClick={nextPage}>Next</button>
      </div>
    </div>
  );
}
