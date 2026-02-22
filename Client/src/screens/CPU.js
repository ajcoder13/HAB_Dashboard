import './App.css';
import Tabs from '../Components/tabs';
import CpuUti from '../Components/CPU_utilization';
import MemUti from '../Components/Memory_Utilization';
import SwapUti from '../Components/Swap_Usage';
import DiskIO from '../Components/Disk_IO';
import DiskMount from '../Components/Disk_Space_Mount';
import NetworkMetrics from '../Components/Network_Metrics';
import ProcessHealth from '../Components/Process_Health';

function CPU() {
    return (
        <div className="App">
            <Tabs/>
            <br/>
            <h1 className="Metrics-heading">CPU Utilization</h1>
            <CpuUti/>
            <br/>
            <h1 className="Metrics-heading">Memory Utilization</h1>
            <MemUti/>
            <h2 className="Metrics-heading">Swap Usage</h2>
            <SwapUti/>
            <br/>
            <h1 className="Metrics-heading">Disk I/O</h1>
            <DiskIO/>
            <h2 className="Metrics-heading">Disk space usage per mount point</h2>
            <DiskMount/>
            <br/>
            <h1 className="Metrics-heading">Network Metrics</h1>
            <NetworkMetrics/>
            <br/>
            <ProcessHealth/>
        </div>
    );
}
export default CPU;