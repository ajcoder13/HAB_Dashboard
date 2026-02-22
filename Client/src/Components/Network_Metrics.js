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

import {NetworkMetricsData1h} from '../data/Network_Metrics_data.js';

import {NetworkMetricsData6h} from '../data/Network_Metrics_data.js';

import {NetworkMetricsData24h} from '../data/Network_Metrics_data.js';

import {NetworkMetricsData7d} from '../data/Network_Metrics_data.js';

import {NetworkMetricsData30d} from '../data/Network_Metrics_data.js';

import { activeConnectionCount } from "../data/Network_Metrics_data.js";

import { connectionRate } from "../data/Network_Metrics_data.js";


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,  
    Legend,
);

class NetworkMetrics extends React.Component{
    constructor(){
        super()
        this.state={
            time_range:"1h"
        }
    }
    getChartData() {
        const range = this.state.time_range
        let data=NetworkMetricsData1h;
        if (range === "1h") {
            data=NetworkMetricsData1h;
        } 
        else if (range === "6h") {
            data=NetworkMetricsData6h;
        } 
        else if (range === "24h") {
            data=NetworkMetricsData24h;
        }
        else if(range==="7d"){
            data=NetworkMetricsData7d;
        }
        else{
            data=NetworkMetricsData30d;
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
        <h3>Active connection count = {activeConnectionCount}</h3>
        <h3>Connection Rate = {connectionRate}</h3>
        </div>)

    }
}
export default NetworkMetrics;