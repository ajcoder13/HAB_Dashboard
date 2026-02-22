import React from "react";
import { Line } from "react-chartjs-2";
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

import {
    ResponseTimeData1h,
    ResponseTimeData6h,
    ResponseTimeData24h,
    ResponseTimeData7d,
    ResponseTimeData30d
} from "../data/Response_Time_data";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

class ResponseTime extends React.Component {
    constructor() {
        super();
        this.state = {
            time_range: "1h",
            selected_endpoint: "GET /users"
        };
    }

    getRawData() {
        const range = this.state.time_range;
        if (range === "1h") return ResponseTimeData1h;
        if (range === "6h") return ResponseTimeData6h;
        if (range === "24h") return ResponseTimeData24h;
        if (range === "7d") return ResponseTimeData7d;
        return ResponseTimeData30d;
    }

    getSelectedEndpointData() {
        const raw = this.getRawData();
        return raw.endpoints.find(
            ep => ep.name === this.state.selected_endpoint
        );
    }

    getChartData() {
        const raw = this.getRawData();
        const ep = this.getSelectedEndpointData();

        return {
            labels: raw.labels,
            datasets: [
                {
                    label: "Average",
                    data: ep.avg,
                    borderColor: "#3b82f6",
                    tension: 0.4,
                    fill: false
                },
                {
                    label: "P50",
                    data: ep.p50,
                    borderColor: "#10b981",
                    tension: 0.4,
                    fill: false
                },
                {
                    label: "P95",
                    data: ep.p95,
                    borderColor: "#f59e0b",
                    tension: 0.4,
                    fill: false
                },
                {
                    label: "P99",
                    data: ep.p99,
                    borderColor: "#ef4444",
                    tension: 0.4,
                    fill: false
                }
            ]
        };
    }

    getTopSlowEndpoints() {
        const raw = this.getRawData();

        const sorted = raw.endpoints
            .map(ep => ({
                name: ep.name,
                avgP95:
                    ep.p95.reduce((a, b) => a + b, 0) / ep.p95.length
            }))
            .sort((a, b) => b.avgP95 - a.avgP95)
            .slice(0, 10);

        return sorted;
    }

    render() {
        const raw = this.getRawData();
        const ep = this.getSelectedEndpointData();
        const chartData = this.getChartData();
        const slowEndpoints = this.getTopSlowEndpoints();

        return (
            <div className="response-wrapper">
                <div className="controls">
                    <label>Time Range: </label>
                    <select
                        value={this.state.time_range}
                        onChange={e =>
                            this.setState({ time_range: e.target.value })
                        }
                    >
                        <option value="1h">1h</option>
                        <option value="6h">6h</option>
                        <option value="24h">24h</option>
                        <option value="7d">7d</option>
                        <option value="30d">30d</option>
                    </select>
                    <label style={{ marginLeft: "20px" }}>Endpoint: </label>
                    <select
                        value={this.state.selected_endpoint}
                        onChange={e =>
                            this.setState({
                                selected_endpoint: e.target.value
                            })
                        }
                    >
                        {raw.endpoints.map(ep => (
                            <option key={ep.name} value={ep.name}>
                                {ep.name}
                            </option>
                        ))}
                    </select>
                </div>
                <Line data={chartData} />
                <div className="cards-container">
                    <div className="metric-card">
                        <div className="metric-title">P50</div>
                        <div className="metric-value">
                            {ep.p50.slice(-1)[0]} ms
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-title">P95</div>
                        <div className="metric-value">{ep.p95.slice(-1)[0]} ms</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-title">P99</div>
                        <div className="metric-value">{ep.p99.slice(-1)[0]} ms</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-title">Average</div>
                        <div className="metric-value">{ep.avg.slice(-1)[0]} ms</div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-title">Max</div>
                        <div className="metric-value">{ep.max} ms</div>
                    </div>
                        <div className="metric-card">
                        <div className="metric-title">Min</div>
                        <div className="metric-value">
                            {ep.min} ms
                        </div>
                    </div>
                </div>
                <h3 style={{ marginTop: "30px" }}>
                    Slowest Endpoints (Top 10 by Avg P95)
                </h3>
                <table className="process-table">
                    <thead>
                        <tr>
                            <th>Endpoint</th>
                            <th>Avg P95 (ms)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {slowEndpoints.map(item => (
                            <tr key={item.name}>
                                <td>{item.name}</td>
                                <td>{item.avgP95.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ResponseTime;