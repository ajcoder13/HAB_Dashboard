export type GetLogsParams = {
  startDate?: number;
  endDate?: number;
  level?: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  id?: string;
  message?: string;

  response_time_min?: number;
  response_time_max?: number;

  limit?: number;
  offset?: number;

  sort?: string;
  order?: "asc" | "desc";
};

export type Log = {
  id: number;
  timestamp: string;
  level: string;
  message: string;
  method: string;
  url: string;
  status_code: number;
  response_time: number;
};

export type GetLogsResponse = {
  message: string;
  data: Log[];
  total: number;
};

export type TimeScale = "1h" | "6h" | "24h" | "7d" | "30d";

export interface LogVolumeDataPoint {
  timestamp: number;
  counts: Record<string, number>;
}

export interface LogVolumeResponse {
  scale: TimeScale;
  data: LogVolumeDataPoint[];
  fetchedAt: number;
}
