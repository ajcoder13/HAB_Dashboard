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
            currentUsage: Number(latest.cpu.usage.toFixed(1)),
            loadAverage: latest.cpu.loadavg ? Number(latest.cpu.loadavg[0].toFixed(2)) : 0,
            averageUsage: Number((rawArray.reduce((acc, curr) => acc + curr.cpu.usage, 0) / rawArray.length).toFixed(1)),
            minUsage: Math.min(...rawArray.map(s => s.cpu.usage)),
            maxUsage: Math.max(...rawArray.map(s => s.cpu.usage)),
            cores: latest.cpu.cores.map((usage: number, id: number) => ({ id, usage: Number(usage.toFixed(1)) })),
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                usage: s.cpu.usage
            })),
            topProcesses: latest.cpu.topProcesses.map((p: any) => ({
                pid: p.pid,
                name: p.name,
                cpu: p.cpu
            })),
        },

        memory: {
            total: latest.memory.total,
            currentUsed: Number(latest.memory.used.toFixed(2)),
            currentFree: Number((latest.memory.total - latest.memory.used).toFixed(2)),
            pressure: (latest.memory.used > latest.memory.total * 0.8 ? "High" : "Low") as MemoryPressure,
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                used: s.memory.used,
            }))
        },

        disk: {
            currentRead: latest.disk.readsPerSec,
            currentWrite: latest.disk.writesPerSec,
            ioWaitPercent: Number(((latest.disk.readWaitTime || 0) + (latest.disk.writeWaitTime || 0)).toFixed(2)),
            readWait: latest.disk.readWaitTime,
            writeWait: latest.disk.writeWaitTime,
            mountPoints: latest.disk.disks.map((d: any) => ({
                path: d.mount,
                total: d.capacity,
                used: (d.usage / 100) * d.capacity,
                usagePercent: d.usage
            })),
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                readSpeed: s.disk.readsPerSec,
                writeSpeed: s.disk.writesPerSec
            }))
        },

        network: {
            currentRx: latest.network.interfaces[0]?.rxBytesPerSec || 0,
            currentTx: latest.network.interfaces[0]?.txBytesPerSec || 0,
            activeConnections: latest.network.activeConnections,
            history: rawArray.map(s => ({
                timestamp: new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                rx: s.network.interfaces[0]?.rxBytesPerSec || 0,
                tx: s.network.interfaces[0]?.txBytesPerSec || 0
            })),
            droppedPackets: (latest.network.interfaces[0].rxDropped || 0) + (latest.network.interfaces[0].txDropped || 0),
            errors: (latest.network.interfaces[0].rxErrors || 0) + (latest.network.interfaces[0].txErrors || 0),
            interfaceName: latest.network.interfaces[0].interface,
        },

        processes: latest.pm2Processes.map((p: any) => ({
            pid: p.pid,
            name: p.name,
            status: p.status as ProcessStatus,
            uptime: p.uptime,
            restartCount: p.restartCount,
            cpuUsage: p.cpuPercent,
            memoryUsage: p.memoryMB
        }))
    };
};