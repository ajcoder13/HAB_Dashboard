import { 
    SystemMetricsResponse, 
    ProcessStatus, 
    TimeRange,
    SystemStatus,
    MemoryPressure
} from '../../../types/metrics.types';

export const transformServerData = (rawArray: any[]): SystemMetricsResponse => {
    if (!rawArray || rawArray.length === 0) {
        throw new Error("No data received from server");
    }

    const latest = rawArray[rawArray.length - 1];

    const formatUptime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return {
        status: (latest.cpu.usage > 85 ? "Critical" : "Optimal") as SystemStatus,
        uptime: formatUptime(latest.uptime),
        lastUpdated: new Date(latest.timestamp).toISOString(),

        cpu: {
            currentUsage: Number(latest.cpu.usage.toFixed(2)),
            loadAverage: latest.cpu.loadavg ? Number(latest.cpu.loadavg[0].toFixed(2)) : 0,
            averageUsage: Number((rawArray.reduce((acc, curr) => acc + curr.cpu.usage, 0) / rawArray.length).toFixed(2)),
            minUsage: Number(Math.min(...rawArray.map(s => s.cpu.usage)).toFixed(2)),
            maxUsage: Number(Math.max(...rawArray.map(s => s.cpu.usage)).toFixed(2)),
            cores: latest.cpu.cores.map((usage: number, id: number) => ({ id, usage: Number(usage.toFixed(2)) })),
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                usage: Number(s.cpu.usage.toFixed(2))
            })),
            topProcesses: latest.cpu.topProcesses.map((p: any) => ({
                pid: p.pid,
                name: p.name,
                cpu: Number(p.cpu.toFixed(2))
            })),
        },

        memory: {
            total: Number(latest.memory.total.toFixed(2)),
            currentUsed: Number(latest.memory.used.toFixed(2)),
            currentFree: Number((latest.memory.total - latest.memory.used).toFixed(2)),
            pressure: (latest.memory.used > latest.memory.total * 0.8 ? "High" : "Low") as MemoryPressure,
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                used: Number(s.memory.used.toFixed(2)),
            }))
        },

        disk: {
            currentRead: Number((latest.disk.readsPerSec || 0).toFixed(2)),
            currentWrite: Number((latest.disk.writesPerSec || 0).toFixed(2)),
            ioWaitPercent: Number(((latest.disk.readWaitTime || 0) + (latest.disk.writeWaitTime || 0)).toFixed(2)),
            readWait: Number((latest.disk.readWaitTime || 0).toFixed(2)),
            writeWait: Number((latest.disk.writeWaitTime || 0).toFixed(2)),
            mountPoints: latest.disk.disks.map((d: any) => ({
                path: d.mount,
                total: Number(d.capacity.toFixed(2)),
                used: Number(((d.usage / 100) * d.capacity).toFixed(2)),
                usagePercent: Number(d.usage.toFixed(2))
            })),
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                readSpeed: Number((s.disk.readsPerSec || 0).toFixed(2)),
                writeSpeed: Number((s.disk.writesPerSec || 0).toFixed(2))
            }))
        },

        network: {
            currentRx: Number((latest.network.interfaces[0]?.rxBytesPerSec || 0).toFixed(2)),
            currentTx: Number((latest.network.interfaces[0]?.txBytesPerSec || 0).toFixed(2)),
            activeConnections: latest.network.activeConnections,
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                rx: Number((s.network?.interfaces?.[0]?.rxBytesPerSec || 0).toFixed(2)),
                tx: Number((s.network?.interfaces?.[0]?.txBytesPerSec || 0).toFixed(2))
            })),
            droppedPackets: (latest.network?.interfaces?.[0]?.rxDropped || 0) + (latest.network?.interfaces?.[0]?.txDropped || 0),
            errors: (latest.network?.interfaces?.[0]?.rxErrors || 0) + (latest.network?.interfaces?.[0]?.txErrors || 0),
            interfaceName: latest.network?.interfaces?.[0]?.interface || "unknown",
        },

        processes: latest.pm2Processes.map((p: any) => ({
            pid: p.pid,
            name: p.name,
            status: p.status as ProcessStatus,
            uptime: p.uptime,
            restartCount: p.restartCount,
            cpuUsage: Number(p.cpuPercent.toFixed(2)),
            memoryUsage: Number(p.memoryMB.toFixed(2))
        }))
    };
};