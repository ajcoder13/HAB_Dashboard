function buildConditions(
  filters: Record<string, any>,
  inequalities: Record<string, { operator: string; value: any }>,
  startIndex: number = 1,
) {
  const conditions: string[] = [];
  const values: any[] = [];
  let index = startIndex;
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      conditions.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
  }

  for (const [key, value] of Object.entries(inequalities)) {
    if (value && value.value !== undefined) {
      if (value.operator === "BETWEEN" && Array.isArray(value.value)) {
        conditions.push(`${key} BETWEEN $${index} AND $${index + 1}`);
        values.push(value.value[0], value.value[1]);
        index += 2;
      } else {
        conditions.push(`${key} ${value.operator} $${index}`);
        values.push(value.value);
        index++;
      }
    }
  }
  return { conditions, values, nextIndex: index };
}

export function buildPostgresQuery(
  target: string,
  filters: Record<string, any>,
  inequalities: Record<string, { operator: string; value: any }>,
  sort = "timestamp",
  order = "DESC",
  limit: number,
  offset: number,
  withCount = false,
) {
  const countExpr = withCount ? ", COUNT(*) OVER() as total_count" : "";
  let query = `SELECT ${target}${countExpr} FROM server_logs WHERE 1=1`;
  const conditions: string[] = [];
  const values: any[] = [];
  let index = 1;

  const { conditions: equalityConditions, values: equalityValues, nextIndex: eqEndIndex } =
    buildConditions(filters, {}, 1);
  conditions.push(...equalityConditions);
  values.push(...equalityValues);
  index = eqEndIndex;

  const { conditions: inequalityConditions, values: inequalityValues, nextIndex: ineqEndIndex } =
    buildConditions({}, inequalities, index);
  conditions.push(...inequalityConditions);
  values.push(...inequalityValues);
  index = ineqEndIndex;

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  query += ` ORDER BY ${sort} ${order} LIMIT $${index} OFFSET $${index + 1}`;
  values.push(limit);
  values.push(offset);

  return { query, values };
}

export function buildDeletePostgresQuery(
  filters: Record<string, any>,
  inequalities: Record<string, { operator: string; value: any }>,
) {
  let query = `DELETE FROM server_logs WHERE 1=1`;
  const conditions: string[] = [];
  const values: any[] = [];
  let index = 1;

  const { conditions: equalityConditions, values: equalityValues } =
    buildConditions(filters, {});
  conditions.push(...equalityConditions);
  values.push(...equalityValues);
  index += equalityValues.length;

  const { conditions: inequalityConditions, values: inequalityValues } =
    buildConditions({}, inequalities);
  conditions.push(...inequalityConditions);
  values.push(...inequalityValues);
  index += inequalityValues.length;

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  return { query, values };
}

export type ScaleType = "1h" | "6h" | "24h" | "7d" | "30d";

interface ScaleConfig {
  lookbackInterval: string;
  dateTruncUnit: string;
  customBucket?: string; // For non-standard intervals like 10 minutes
  pointCount: number;
}

const SCALE_CONFIG: Record<ScaleType, ScaleConfig> = {
  "1h": {
    lookbackInterval: "1 hour",
    dateTruncUnit: "minute",
    pointCount: 60,
  },
  "6h": {
    lookbackInterval: "6 hours",
    dateTruncUnit: "minute",
    customBucket: "10", // Special handling for 10-minute intervals
    pointCount: 36,
  },
  "24h": {
    lookbackInterval: "24 hours",
    dateTruncUnit: "hour",
    pointCount: 24,
  },
  "7d": {
    lookbackInterval: "7 days",
    dateTruncUnit: "day",
    pointCount: 7,
  },
  "30d": {
    lookbackInterval: "30 days",
    dateTruncUnit: "day",
    pointCount: 30,
  },
};

export function getScaleConfig(scale: string): ScaleConfig | null {
  if (scale in SCALE_CONFIG) {
    return SCALE_CONFIG[scale as ScaleType];
  }
  return null;
}
