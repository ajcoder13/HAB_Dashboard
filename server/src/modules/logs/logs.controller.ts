import { type Request, type Response } from "express";
import { buildDeletePostgresQuery, buildPostgresQuery } from "./logs.utils.js";
import pool from "../../lib/db.js";

export async function getLogs(req: Request, res: Response) {
    const queries = req.query;
    const filters = {
        startDate: queries.startDate || Date.now() - 30 * 24 * 60 * 60 * 1000,
        endDate: queries.endDate || Date.now(),
        level: queries.level || null,
        endpoint: queries.endpoint || null,
        limit : queries.limit || 100,
        offset : queries.offset || 0,
        sort : queries.sort as string || "timestamp",
        order : queries.order as string || "desc",
        id : queries.id || null,
        method : queries.method || null,
        status_code : queries.status_code || null,
        response_time_min : queries.response_time_min || 0,
        response_time_max : queries.response_time_max || 1e9,
    }

    const equalityFilters = {
        id : filters.id,
        level : filters.level,
        url : filters.endpoint,
        method : filters.method,
        status_code : filters.status_code,
    }

    const inequalities = {
        timestamp: {
            operator: "BETWEEN",
            value: [new Date(Number(filters.startDate)), new Date(Number(filters.endDate))],
        },
        response_time: {
            operator: "BETWEEN",
            value: [filters.response_time_min, filters.response_time_max],
        },
    }

    const { query, values } = buildPostgresQuery(
        "*",
        equalityFilters,
        inequalities,
        filters.sort,
        filters.order,
        Number(filters.limit),
        Number(filters.offset)
    );

    try {
        const results = await pool.query(query, values);
        res.json({message: "Logs fetched successfully", data: results.rows});
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function getLogsById(req: Request, res: Response) {
    const id = req.params.id;
    try {
        const result = await pool.query("SELECT * FROM server_logs WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Log not found" });
        }
        res.json({message: "Log fetched successfully", data: result.rows[0]});
    }
    catch (error) {
        console.error("Error fetching log by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteLogsDefault(req: Request, res: Response) {
    try {
        //delete logs which are more than 30 days old
        await pool.query("DELETE FROM server_logs WHERE timestamp < NOW() - INTERVAL '30 days'");
        res.json({message: "Old logs deleted successfully"});
    }
    catch (error) {
        console.error("Error deleting logs:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export async function deleteLogsByFilter(req: Request, res: Response) {
    const queries = req.query;
    const filters = {
        startDate: queries.startDate || null,
        endDate: queries.endDate || null,
        level: queries.level || null,
        endpoint: queries.endpoint || null,
        method : queries.method || null,
        status_code : queries.status_code || null,
    }

    const equalityFilters = {
        level : filters.level,
        url : filters.endpoint,
        method : filters.method,
        status_code : filters.status_code,
    }

    const inequalities = {
        timestamp: {
            operator: "BETWEEN",
            value: filters.startDate && filters.endDate ? [new Date(Number(filters.startDate)), new Date(Number(filters.endDate))] : null,
        },
    }

    const { query, values } = buildDeletePostgresQuery(
        equalityFilters,
        inequalities
    );

    try {
        const result = await pool.query(query, values);
        const idsToDelete = result.rows.map((row) => row.id);
        if (idsToDelete.length === 0) {
            return res.json({message: "No logs matched the filter criteria"});
        }
        await pool.query(`DELETE FROM server_logs WHERE id = ANY($1)`, [idsToDelete]);
        res.json({message: `${idsToDelete.length} logs deleted successfully`});
    }
    catch (error) {
        console.error("Error deleting logs by filter:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
