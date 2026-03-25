function buildConditions(filters: Record<string, any>, inequalities: Record<string, { operator: string; value: any }>) {
    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;
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
                values.push(value.value[0]);
                values.push(value.value[1]);
                index += 2;
            }
            else {
                conditions.push(`${key} ${value.operator} $${index}`);
                values.push(value.value);
                index++;
            }
        }
    }
    return { conditions, values };
}

export function buildPostgresQuery(
    target: string,
    filters: Record<string, any>,
    inequalities: Record<string, { operator: string; value: any }>,
    sort = "timestamp",
    order = "DESC",
    limit: number,
    offset: number
) {
    let query = `SELECT ${target} FROM server_logs WHERE 1=1`;
    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    const { conditions: equalityConditions, values: equalityValues } = buildConditions(filters, {});
    conditions.push(...equalityConditions);
    values.push(...equalityValues);
    index += equalityValues.length;

    const { conditions: inequalityConditions, values: inequalityValues } = buildConditions({}, inequalities);
    conditions.push(...inequalityConditions);
    values.push(...inequalityValues);
    index += inequalityValues.length;

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
    inequalities: Record<string, { operator: string; value: any }>
) {
    let query = `DELETE FROM server_logs WHERE 1=1`;
    const conditions: string[] = [];
    const values: any[] = [];
    let index = 1;

    const { conditions: equalityConditions, values: equalityValues } = buildConditions(filters, {});
    conditions.push(...equalityConditions);
    values.push(...equalityValues);
    index += equalityValues.length;

    const { conditions: inequalityConditions, values: inequalityValues } = buildConditions({}, inequalities);
    conditions.push(...inequalityConditions);
    values.push(...inequalityValues);
    index += inequalityValues.length;

    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }

    return { query, values };
}