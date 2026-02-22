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
    Filler
}from "chart.js";

import {MemUtiData1h} from '../data/Mem_uti_data.js';

import {MemUtiData6h} from '../data/Mem_uti_data.js';

import {MemUtiData24h} from '../data/Mem_uti_data.js';

import {MemUtiData7d} from '../data/Mem_uti_data.js';

import {MemUtiData30d} from '../data/Mem_uti_data.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,  
    Legend,
    Filler
);

class MemUti extends React.Component{
    constructor(){
        super()
        this.state={
            time_range:"1h"
        }
    }
    getChartData() {
        const range = this.state.time_range
        let data=MemUtiData1h;
        if (range === "1h") {
            data=MemUtiData1h;
        } 
        else if (range === "6h") {
            data=MemUtiData6h;
        } 
        else if (range === "24h") {
            data=MemUtiData24h;
        }
        else if(range==="7d"){
            data=MemUtiData7d;
        }
        else{
            data=MemUtiData30d;
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
        },
        scales: {
            y: { stacked: true }
        }
        };
        const chartData = this.getChartData();
        const total = 100;
        const used = total-chartData.datasets[3].data[chartData.datasets[3].data.length-1];
        const usagePercent = (used / total) * 100;

        let pressure = "Low";
        let color = "green";

        if (usagePercent > 70) {
        pressure = "Medium";
        color = "orange";
        }

        if (usagePercent > 85) {
        pressure = "High";
        color = "red";
        }

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
        <div>
            <h2 style={{ color }}>
            Memory Pressure: {pressure}
            </h2>
        </div>
        </div>)

    }
}
export default MemUti;