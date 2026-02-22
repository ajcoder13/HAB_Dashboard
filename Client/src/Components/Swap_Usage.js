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

import {SwapUtiData1h} from '../data/Swap_uti_data.js';

import {SwapUtiData6h} from '../data/Swap_uti_data.js';

import {SwapUtiData24h} from '../data/Swap_uti_data.js';

import {SwapUtiData7d} from '../data/Swap_uti_data.js';

import {SwapUtiData30d} from '../data/Swap_uti_data.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,  
    Legend,
);

class SwapUti extends React.Component{
    constructor(){
        super()
        this.state={
            time_range:"1h"
        }
    }
    getChartData() {
        const range = this.state.time_range
        let data=SwapUtiData1h;
        if (range === "1h") {
            data=SwapUtiData1h;
        } 
        else if (range === "6h") {
            data=SwapUtiData6h;
        } 
        else if (range === "24h") {
            data=SwapUtiData24h;
        }
        else if(range==="7d"){
            data=SwapUtiData7d;
        }
        else{
            data=SwapUtiData30d;
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
export default SwapUti;