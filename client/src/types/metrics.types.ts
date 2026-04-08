export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";
export type SystemStatus = "Optimal" | "Degraded" | "Critical";
export type MemoryPressure = "Low" | "Medium" | "High";
export type ProcessStatus = "online" | "stopped" | "errored";


export interface SystemMetricsResponse {
    status: SystemStatus;
    uptime: string;
    lastUpdated: string;
    cpu: CPUMetrics;
    memory: MemoryMetrics;
    disk: DiskMetrics;
    network: NetworkMetrics;
    processes: PM2Process[];
}

export interface TopCPUProcess {
    pid: number;
    name: string;
    cpu: number;
}

export interface CPUHistory {
    timestamp: string; 
    usage: number;
}

export interface CPUMetrics {
    currentUsage: number;
    loadAverage?: number;
    averageUsage: number;
    minUsage: number;
    maxUsage: number;
    cores: { id: number; usage: number }[];
    history: CPUHistory[];
    topProcesses: TopCPUProcess[];
}


export interface MemoryHistory {
    timestamp: string;
    used: number;
}

export interface MemoryMetrics {
    total: number;
    currentUsed: number;
    currentFree: number;
    pressure: MemoryPressure;
    history: MemoryHistory[];
}


export interface DiskHistory {
    timestamp: string;
    readSpeed: number; 
    writeSpeed: number;
}

export interface MountPoint {
    path: string;
    total: number;
    used: number;
    usagePercent: number;
}

export interface DiskMetrics {
    currentRead: number;
    currentWrite: number;
    ioWaitPercent: number;
    readWait: number;
    writeWait: number;
    mountPoints: MountPoint[];
    history: DiskHistory[];
}


export interface NetworkHistory {
    timestamp: string;
    rx: number; 
    tx: number; 
}

export interface NetworkMetrics {
    currentRx: number;
    currentTx: number;
    activeConnections: number;
    history: NetworkHistory[];
    droppedPackets: number;
    errors: number;
    interfaceName: string;
}


export interface PM2Process {
    pid: number;
    name: string;
    status: ProcessStatus;
    uptime: number;        
    restartCount: number;
    cpuUsage: number;      
    memoryUsage: number;   
}

export interface GetMetricsParams {
    range: TimeRange;
    refreshInterval?: number;
}