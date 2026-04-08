"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { MetricsService } from "../services/metrics.service";
import { SystemMetricsResponse, TimeRange } from "@/types/metrics.types";
import { transformServerData } from "../Util/metricsTransformer";

export function useMetrics(initialRange: TimeRange = "1h", refreshInterval = 30000) {
    const [range, setRange] = useState<TimeRange>(initialRange);
    const [data, setData] = useState<SystemMetricsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const isMounted = useRef(true);

    const fetchMetrics = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const res = await MetricsService.getMetrics(range);
            const processed = transformServerData(res as any);
            if (isMounted.current) {
                setData(processed);
                setError(null);
            }
            } catch (err) {
            if (isMounted.current) {
                setError("Failed to fetch system metrics");
            }
            } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    }, [range]);

    useEffect(() => {
        console.log("Effect running, range:", range);
        isMounted.current = true;
        fetchMetrics(true);

        const timer = setInterval(() => {
            fetchMetrics(false);
        }, refreshInterval);

        return () => {
            isMounted.current = false;
            clearInterval(timer);
        };
    }, [fetchMetrics, refreshInterval]);

    const handleRestart = async (name: string) => {
        try {
            console.log(`restart ${name}`);
            await MetricsService.restartProcess(name);
            fetchMetrics(false);
        } catch (err) {
            console.error(`Error restarting ${name}:`, err);
        }
    };

    const handleStop = async (name: string) => {
        try {
            console.log(`stop ${name}`);
            await MetricsService.stopProcess(name);
            fetchMetrics(false);
        } catch (err) {
            console.error(`Error stopping ${name}:`, err);
        }
    };

    const handleRestartAll = async () => {
        try {
            console.log("restart all");
            await MetricsService.restartAll();
            fetchMetrics(false);
        } catch (err) {
            console.error(`Error restarting all:`, err);
        }
    };

    return {
        data,
        loading,
        error,
        range,
        setRange,
        refresh: fetchMetrics,
        handleRestart,
        handleRestartAll,
        handleStop
    };
}