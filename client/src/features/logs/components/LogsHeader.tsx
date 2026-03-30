"use client";

import { Zap, Bell, Download } from "lucide-react";

interface LogsHeaderProps {
  onCreateOptimizer?: () => void;
  onCreateAlert?: () => void;
  onExport?: () => void;
}

export function LogsHeader({
  onCreateOptimizer,
  onCreateAlert,
  onExport,
}: LogsHeaderProps) {
  return (
    <div className="flex items-start justify-between py-5 px-6">
      {/* Left — page title */}
      <div>
        <h1 className="page-title font-bold">Log Analytics</h1>
        <p className="body-text text-muted mt-0.5 text-sm">
          Monitoring real-time production traffic and system events
        </p>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 mt-1">
        <button
          className="btn-primary flex items-center gap-2"
          onClick={onCreateOptimizer}>
          <Zap size={14} strokeWidth={2.5} />
          Create Optimizer
        </button>

        <button
          className="btn-secondary flex items-center gap-2 ghost-border"
          onClick={onCreateAlert}>
          <Bell size={14} strokeWidth={2} />
          Create Alert
        </button>

        <button
          className="btn-secondary flex items-center gap-2 ghost-border"
          onClick={onExport}>
          <Download size={14} strokeWidth={2} />
          Export
        </button>
      </div>
    </div>
  );
}
