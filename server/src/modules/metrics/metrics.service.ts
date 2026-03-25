import si from "systeminformation";
import pm2 from "pm2";

/* ---------- Types ---------- */

export interface ProcessCpuUsage {
  pid: number;
  name: string;
  cpu: number;
}

export interface CpuMetrics {
  usage: number;
  cores: number[];
  topProcesses: ProcessCpuUsage[];
}

export interface ProcessMemoryUsage {
  pid: number;
  name: string;
  memory: number;
}

export interface MemoryMetrics {
  total: number;
  used: number;
  topProcesses: ProcessMemoryUsage[];
}

export interface DiskUsage {
  mount: string;
  usage: number;
  capacity: number;
}

export interface DiskMetrics {
  disks: DiskUsage[];
  readsPerSec: number;
  writesPerSec: number;
  readWaitTime: number;
  writeWaitTime: number;
}

export interface NetworkInterface {
  interface: string;
  rxBytesPerSec: number;
  txBytesPerSec: number;
  rxDropped: number;
  txDropped: number;
  rxErrors: number;
  txErrors: number;
}

export interface NetworkMetrics {
  interfaces: NetworkInterface[];
  activeConnections: number;
}

export interface Pm2ProcessHealth {
  name: string;
  pid: number;
  status: string;
  uptime: number; // seconds
  restartCount: number;
  memoryMB: number;
  cpuPercent: number;
}

export interface Metrics {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  disk: DiskMetrics;
  network: NetworkMetrics;
  pm2Processes: Pm2ProcessHealth[];
  uptime: number;
  timestamp: number;
}

/* ---------- Implementation ---------- */

function bytesToGiB(b: number) {
  return b / 1024 / 1024 / 1024;
}

export async function collectMetrics(): Promise<Metrics> {
  // For some systeminformation metrics like cpu load and network speeds, the results are calculated
  //  correctly beginning with the second call of the function. It is determined by calculating the
  //  difference of cpu ticks between two calls of the function.

  const [_cpu, _diskIO, _net] = await Promise.all([
    si.currentLoad(),
    si.disksIO(),
    si.networkStats(),
  ]);

  // wait 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const [
    cpu,
    mem,
    diskIO,
    disk,
    net,
    connections,
    time,
    processes,
    pm2Processes,
  ] = await Promise.all([
    si.currentLoad(),
    si.mem(),
    si.disksIO(),
    si.fsSize(),
    si.networkStats(),
    si.networkConnections(),
    si.time(),
    si.processes(),
    getPm2ProcessHealth(),
  ]);

  const topProcessesCpu = processes.list
    .sort((a, b) => (b.cpu ?? 0) - (a.cpu ?? 0))
    .slice(0, 5)
    .map((p) => ({
      pid: p.pid,
      name: p.name,
      cpu: p.cpu,
    }));

  const topProcessesMem = processes.list
    .sort((a, b) => (b.memRss ?? 0) - (a.memRss ?? 0))
    .slice(0, 5)
    .map((p) => ({
      pid: p.pid,
      name: p.name,
      memory: p.memRss / 1024, // memRss is in kilobytes
    }));

  const metrics: Metrics = {
    cpu: {
      usage: cpu.currentLoad,
      cores: cpu.cpus.map((c) => c.load),
      topProcesses: topProcessesCpu,
    },
    memory: {
      total: bytesToGiB(mem.total),
      used: bytesToGiB(mem.active), /// TODO: Check some of these fields
      topProcesses: topProcessesMem,
    },
    disk: {
      disks: disk.map((d) => ({
        mount: d.mount,
        usage: d.use,
        capacity: d.size,
      })),
      readsPerSec: diskIO?.rIO_sec ?? 0,
      writesPerSec: diskIO?.wIO_sec ?? 0,
      readWaitTime: diskIO?.rWaitTime ?? 0,
      writeWaitTime: diskIO?.wWaitTime ?? 0,
    },
    network: {
      interfaces: net.map((n) => ({
        interface: n.iface,
        rxBytesPerSec: n.rx_sec,
        txBytesPerSec: n.tx_sec,
        rxDropped: n.rx_dropped,
        txDropped: n.tx_dropped,
        rxErrors: n.rx_errors,
        txErrors: n.tx_errors,
      })),
      activeConnections: connections.length,
    },
    uptime: time.uptime,
    timestamp: Date.now(),
    pm2Processes,
  };

  // console.log(JSON.stringify(metrics, null, 2));

  return metrics;
}

export async function getPm2ProcessHealth(): Promise<Pm2ProcessHealth[]> {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) return reject(err);

      pm2.list((err, list) => {
        pm2.disconnect();
        if (err) return reject(err);

        const formatted: Pm2ProcessHealth[] = list.map((proc) => {
          const env = proc.pm2_env;
          const monit = proc.monit;

          return {
            name: proc.name ?? "unknown",
            pid: proc.pid ?? 0,
            status: env?.status ?? "unknown",
            uptime: env?.pm_uptime
              ? Math.floor((Date.now() - env.pm_uptime) / 1000)
              : 0,
            restartCount: env?.restart_time ?? 0,
            memoryMB: Math.round((monit?.memory ?? 0) / 1024 / 1024),
            cpuPercent: monit?.cpu ?? 0,
          };
        });
        resolve(formatted);
      });
    });
  });
}
