export type GetLogsParams = {
  startDate?: number;
  endDate?: number;
  level?: string;
  endpoint?: string;
  method?: string;
  status_code?: number;
  id?: string;

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
