import { Line } from "react-chartjs-2";
import React from "react";
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
}from "chart.js";

import {DiskIOData1h} from '../data/Disk_IO_data.js';

import {DiskIOData6h} from '../data/Disk_IO_data.js';

import {DiskIOData24h} from '../data/Disk_IO_data.js';

import {DiskIOData7d} from '../data/Disk_IO_data.js';

import {DiskIOData30d} from '../data/Disk_IO_data.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,  
    Legend,
);

class DiskIO extends React.Component{
    constructor(){
        super()
        this.state={
            time_range:"1h"
        }
    }
    getChartData() {
        const range = this.state.time_range
        let data=DiskIOData1h;
        if (range === "1h") {
            data=DiskIOData1h;
        } 
        else if (range === "6h") {
            data=DiskIOData6h;
        } 
        else if (range === "24h") {
            data=DiskIOData24h;
        }
        else if(range==="7d"){
            data=DiskIOData7d;
        }
        else{
            data=DiskIOData30d;
        }
        return data;
    }
    render(){
        const Options={plugins: {
            legend: {
                labels: {
                    font: {
                        size: 18,
                        weight: "bold"
                    },
                    color: "black"
                    
                }
            }
        }};
        const chartData = this.getChartData();
        return (
        <div>
        <div>
            <label>Select Time Range: </label>
            <select value={this.state.time_range} onChange={(e) => this.setState({ time_range: e.target.value})}>
                <option value="1h">1 Hour</option>
                <option value="6h">6 Hours</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
            </select>
        </div>
        <div>
        <Line options={Options} data={chartData}/>
        </div>
        </div>)

    }
}
export default DiskIO;