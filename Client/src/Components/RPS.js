import { Line } from "react-chartjs-2";
import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import { RpsData1h, RpsData6h, RpsData24h, RpsData7d, RpsData30d } from "../data/Rps_data";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
const COLOR_PALETTE = [
        "#3b82f6", // blue
        "#ef4444", // red
        "#10b981", // green
        "#f59e0b", // orange
        "#8b5cf6", // purple
        "#ec4899", // pink
        "#14b8a6", // teal
        "#6366f1", // indigo
        "#84cc16", // lime
        "#f97316"  // deep orange
        ];
class Rps extends React.Component {
    constructor() {
        super();
        this.state = {
        time_range: "1h",
        view_mode: "endpoint"
        };
    }
    
    getRawData() {
        const range = this.state.time_range;

        if (range === "1h") return RpsData1h;
        if (range === "6h") return RpsData6h;
        if (range === "24h") return RpsData24h;
        if (range === "7d") return RpsData7d;
        return RpsData30d;
    }

    getChartData() {
        const rawData = this.getRawData();
        const mode = this.state.view_mode;
        if (mode === "endpoint") {
        const sorted = [...rawData.endpoints]
            .map(ep => ({
            ...ep,
            total: ep.data.reduce((a, b) => a + b, 0)
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);
            return {
                labels: rawData.labels,
                datasets: sorted.map((ep, index) => ({
                label: ep.name,
                data: ep.data,
                borderWidth: 2,
                tension: 0.4,
                borderColor: COLOR_PALETTE[index % COLOR_PALETTE.length],
                backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length],
                }))
            };
        }

        return {
        labels: rawData.labels,
        datasets: rawData.services.map((service, index) => ({
        label: service.name,
        data: service.data,
        borderColor: COLOR_PALETTE[index % COLOR_PALETTE.length],
        backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length],
        borderWidth: 2,
        tension: 0.4,
        fill: false
    }))
    }
}

    getSummary() {
        const chartData = this.getChartData();
        const totalSeries = chartData.datasets.reduce((acc, dataset) => {
        return acc.map((val, i) => val + dataset.data[i]);
        }, new Array(chartData.labels.length).fill(0));
        const total = totalSeries.reduce((a, b) => a + b, 0);
        return { total};
    }

    render() {
        const options = {
        responsive: true,
        plugins: {
            legend: {
            position: "bottom"
            }
        }
    };

    const chartData = this.getChartData();
    const { total} = this.getSummary();

    return (
        <div>
            <div style={{ marginBottom: "20px" }}>
            <label>Time Range: </label>
            <select
                value={this.state.time_range}
                onChange={(e) => this.setState({ time_range: e.target.value })}
            >
                <option value="1h">1 Hour</option>
                <option value="6h">6 Hours</option>
                <option value="24h">24 Hours</option>
                <option value="7d">7 Days</option>
                <option value="30d">30 Days</option>
            </select>
            <label style={{ marginLeft: "20px" }}>View: </label>
            <select
                value={this.state.view_mode}
                onChange={(e) => this.setState({ view_mode: e.target.value })}
            >
                <option value="endpoint">Endpoint</option>
                <option value="service">Service</option>
            </select>
            </div>
            <Line data={chartData} options={options} />
            <div style={{ marginTop: "20px" }}>
            <h3>Total RPS: {total.toFixed(2)}</h3>
            </div>
        </div>
        );
    }
}

export default Rps;