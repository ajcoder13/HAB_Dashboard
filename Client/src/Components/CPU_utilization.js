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

import {CpuUtiData1h} from '../data/CPU_uti_data.js';

import {CpuUtiData6h} from '../data/CPU_uti_data.js';

import {CpuUtiData24h} from '../data/CPU_uti_data.js';

import {CpuUtiData7d} from '../data/CPU_uti_data.js';

import {CpuUtiData30d} from '../data/CPU_uti_data.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,  
    Legend,
);

class CpuUti extends React.Component{
    constructor(){
        super()
        this.state={
            time_range:"1h"
        }
    }
    getChartData() {
        const range = this.state.time_range
        let data=CpuUtiData1h;
        if (range === "1h") {
            data=CpuUtiData1h;
        } 
        else if (range === "6h") {
            data=CpuUtiData6h;
        } 
        else if (range === "24h") {
            data=CpuUtiData24h;
        }
        else if(range==="7d"){
            data=CpuUtiData7d;
        }
        else{
            data=CpuUtiData30d;
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
        <div className="stats-container">
        <h1 className = "min">Min={Math.min(...chartData.datasets[0].data)}%</h1>
        <h1 className = "min">Max={Math.max(...chartData.datasets[0].data)}%</h1>
        <h1 className = "min"> Average = {(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / (chartData.datasets[0].data.length)).toFixed(2)}%</h1>
        </div>
        </div>)

    }
}
export default CpuUti;