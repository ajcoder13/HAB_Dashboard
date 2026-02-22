import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

import {
    StatusCodeData1h,
    StatusCodeData6h,
    StatusCodeData24h,
    StatusCodeData7d,
    StatusCodeData30d
} from "../data/Status_Code_data";

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const COLORS = [
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316"
];

class StatusCode extends React.Component {
    constructor() {
        super();
        this.state = {
            time_range: "1h",
            view_mode: "overall",
            selected_endpoint: "GET /users"
        };
    }

    getRawData() {
        const range = this.state.time_range;
        if (range === "1h") return StatusCodeData1h;
        if (range === "6h") return StatusCodeData6h;
        if (range === "24h") return StatusCodeData24h;
        if (range === "7d") return StatusCodeData7d;
        return StatusCodeData30d;
    }

    getPieData() {
        const raw = this.getRawData();
        if (this.state.view_mode === "overall") {
            const labels = Object.keys(raw.overall);
            const values = Object.values(raw.overall);
            return {
                labels,
                datasets: [
                    {
                        data: values,
                        backgroundColor: COLORS.slice(0, labels.length)
                    }
                ]
            };
        }
        const endpoint = raw.endpoints.find(
            ep => ep.name === this.state.selected_endpoint
        );
        const labels = Object.keys(endpoint.codes);
        const values = Object.values(endpoint.codes);
        return {
            labels,
            datasets: [
                {
                    data: values,
                    backgroundColor: COLORS.slice(0, labels.length)
                }
            ]
        };
    }

    getBarData() {
        const raw = this.getRawData();
        const endpoint = raw.endpoints.find(
            ep => ep.name === this.state.selected_endpoint
        );
        const labels = Object.keys(endpoint.codes);
        const values = Object.values(endpoint.codes);
        return {
            labels,
            datasets: [
                {
                    label: "Status Code Count",
                    data: values,
                    backgroundColor: "#3b82f6"
                }
            ]
        };
    }
    render() {
        const raw = this.getRawData();
        const pieData = this.getPieData();
        const barData = this.getBarData();
        return (
            <div style={{ maxWidth: "1000px", margin: "auto" }}>
                <div style={{ marginBottom: "20px" }}>
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
                    <label style={{ marginLeft: "20px" }}>View: </label>
                    <select
                        value={this.state.view_mode}
                        onChange={e =>
                            this.setState({ view_mode: e.target.value })
                        }
                    >
                        <option value="overall">Overall</option>
                        <option value="endpoint">Per Endpoint</option>
                    </select>
                    {this.state.view_mode === "endpoint" && (
                        <>
                            <label style={{ marginLeft: "20px" }}>
                                Endpoint:
                            </label>
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
                        </>
                    )}
                </div>
                <div style={{ display: "flex", gap: "40px" }}>
                    <div style={{ flex: 1 }}>
                        <Pie data={pieData} />
                    </div>
                    <br/>
                    <div style={{ flex: 1 }}>
                        <Bar data={barData} />
                    </div>
                </div>
            </div>
        );
    }
}

export default StatusCode;