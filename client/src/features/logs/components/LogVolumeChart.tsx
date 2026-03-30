"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLogVolume } from "../hooks/useLogVolume";
import { TimeScale } from "@/types/logs.types";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChartDataPoint {
  timeLabel: string;
  timestamp: number;
  [key: string]: string | number;
}

// ─── Constants ─────────────────────────────────────────────────────────────────

const SCALE_LABELS: Record<TimeScale, string> = {
  "1h": "Last 1 Hour",
  "6h": "Last 6 Hours",
  "24h": "Last 24 Hours",
  "7d": "Last 7 Days",
  "30d": "Last 30 Days",
};

const SCALE_OPTIONS: TimeScale[] = ["1h", "6h", "24h", "7d", "30d"];

// ─── Color mapping for different log levels ──────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  SUCCESS: "#003d9b",
  INFO: "#4f46e5",
  WARN: "#f59e0b",
  WARNING: "#f59e0b",
  ERROR: "#c0392b",
};

// ─── Formatting helpers ───────────────────────────────────────────────────────

function formatTimeLabel(timestamp: number, scale: TimeScale): string {
  const date = new Date(timestamp);

  switch (scale) {
    case "1h":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    case "6h":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    case "24h":
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        hour12: false,
      });
    case "7d":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    case "30d":
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    default:
      return date.toLocaleString();
  }
}

// ─── Legend ───────────────────────────────────────────────────────────────────

interface ChartLegendProps {
  levels: string[];
}

function ChartLegend({ levels }: ChartLegendProps) {
  return (
    <div className="flex items-center gap-5 flex-wrap">
      {levels.map((level) => (
        <div key={level} className="flex items-center gap-1.5">
          <span
            className="inline-block rounded-full"
            style={{
              width: 8,
              height: 8,
              backgroundColor: LEVEL_COLORS[level] || "#999",
            }}
          />
          <span
            style={{
              fontSize: "0.6875rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-on-surface-variant)",
            }}>
            {level}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;

  const levels = payload.filter(
    (p: any) => p.dataKey !== "timeLabel" && p.dataKey !== "timestamp",
  );
  const total = levels.reduce((sum: number, p: any) => sum + (p.value ?? 0), 0);

  return (
    <div className="glass px-3 py-2.5" style={{ minWidth: 148 }}>
      {levels.map(({ dataKey, value, color }: any) => (
        <div
          key={dataKey}
          className="flex items-center justify-between gap-6 py-0.5">
          <div className="flex items-center gap-1.5">
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 9999,
                background: color,
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontSize: "0.75rem",
                color: "var(--color-on-surface-variant)",
              }}>
              {dataKey}
            </span>
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 500,
              color: "var(--color-on-surface)",
            }}>
            {value.toLocaleString()}
          </span>
        </div>
      ))}
      <div
        style={{
          height: 1,
          background: "rgba(195,198,214,0.2)",
          margin: "6px 0",
        }}
      />
      <div className="flex items-center justify-between">
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--color-on-surface-variant)",
          }}>
          Total
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--color-on-surface)",
          }}>
          {total.toLocaleString()}
        </span>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = ["65%", "36%", "57%", "47%", "56%"];

function ChartSkeleton() {
  return (
    <div className="flex items-end gap-2 px-2" style={{ height: 200 }}>
      {SKELETON_HEIGHTS.map((height, i) => (
        <div
          key={i}
          className="flex-1 rounded-sm animate-pulse"
          style={{
            height,
            backgroundColor: "var(--color-surface-container-high)",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function LogVolumeChart() {
  const { scale, setScale, data, loading, error } = useLogVolume("24h");

  // Transform API data to chart data
  const chartData: ChartDataPoint[] = data
    ? data.map((point) => ({
        timeLabel: formatTimeLabel(point.timestamp, scale),
        timestamp: point.timestamp,
        ...point.counts,
      }))
    : [];

  // Collect all unique log levels from the data
  const levels: string[] = data
    ? Array.from(
        new Set(data.flatMap((point) => Object.keys(point.counts))),
      ).sort()
    : [];

  return (
    <div className="card mx-6 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            style={{ color: "var(--color-primary)" }}>
            <rect
              x="1"
              y="8"
              width="3"
              height="7"
              rx="0.5"
              fill="currentColor"
              opacity="0.5"
            />
            <rect
              x="6"
              y="4"
              width="3"
              height="11"
              rx="0.5"
              fill="currentColor"
              opacity="0.75"
            />
            <rect
              x="11"
              y="1"
              width="3"
              height="14"
              rx="0.5"
              fill="currentColor"
            />
          </svg>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--color-on-surface-variant)",
            }}>
            Log Volume
          </span>

          {/* Scale Selector */}
          <select
            value={scale}
            onChange={(e) => setScale(e.target.value as TimeScale)}
            style={{
              marginLeft: "12px",
              padding: "4px 8px",
              fontSize: "0.75rem",
              fontWeight: 500,
              backgroundColor: "var(--color-surface-container-high)",
              color: "var(--color-on-surface)",
              border: "1px solid var(--color-outline)",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}>
            {SCALE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {SCALE_LABELS[opt]}
              </option>
            ))}
          </select>
        </div>
        {levels.length > 0 && <ChartLegend levels={levels} />}
      </div>

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: "16px",
            backgroundColor: "rgba(192, 57, 43, 0.1)",
            color: "#c0392b",
            borderRadius: "4px",
            fontSize: "0.875rem",
          }}>
          {error}
        </div>
      )}

      {/* Chart */}
      {loading ? (
        <ChartSkeleton />
      ) : chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 4, right: 0, left: -28, bottom: 0 }}>
            <XAxis
              dataKey="timeLabel"
              tick={{
                fontSize: 10,
                fill: "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
              }}
              tickLine={false}
              axisLine={false}
              interval={Math.max(0, Math.floor(chartData.length / 8))}
            />
            <YAxis
              tick={{
                fontSize: 10,
                fill: "var(--color-on-surface-variant)",
                fontFamily: "var(--font-sans)",
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                fill: "var(--color-surface-container-high)",
                opacity: 0.5,
              }}
            />

            {/* Render a bar for each log level */}
            {levels.map((level: string, idx: number) => (
              <Bar
                key={level}
                dataKey={level}
                stackId="stack"
                fill={LEVEL_COLORS[level] || "#999"}
                radius={idx === levels.length - 1 ? [3, 3, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div
          style={{
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--color-on-surface-variant)",
          }}>
          No data available for the selected timeframe
        </div>
      )}
    </div>
  );
}
