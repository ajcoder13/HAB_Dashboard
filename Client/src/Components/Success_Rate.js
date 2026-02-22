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
    SuccessData1h,
    SuccessData6h,
    SuccessData24h,
    SuccessData7d,
    SuccessData30d
} from "../data/Success_data";

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
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899"
];

class SuccessRate extends React.Component {
    constructor() {
        super();
        this.state = {
            time_range: "1h",
            view_mode: "overall"
        };
    }

    getRawData() {
        const range = this.state.time_range;

        if (range === "1h") return SuccessData1h;
        if (range === "6h") return SuccessData6h;
        if (range === "24h") return SuccessData24h;
        if (range === "7d") return SuccessData7d;
        return SuccessData30d;
    }

    getSummary() {
        const raw = this.getRawData();

        const avgSuccess =
            raw.overall.success.reduce((a, b) => a + b, 0) /
            raw.overall.success.length;

        const avgError =
            raw.overall.error.reduce((a, b) => a + b, 0) /
            raw.overall.error.length;

        const avgServer =
            raw.overall.server.reduce((a, b) => a + b, 0) /
            raw.overall.server.length;

        return {
            success: avgSuccess,
            error: avgError,
            server: avgServer
        };
    }

    getChartData() {
        const raw = this.getRawData();

        if (this.state.view_mode === "overall") {
            return {
                labels: raw.labels,
                datasets: [
                    {
                        label: "Overall Success %",
                        data: raw.overall.success,
                        borderColor: "#10b981",
                        backgroundColor: "#10b981",
                        tension: 0.4,
                        fill: false
                    }
                ]
            };
        }

        return {
            labels: raw.labels,
            datasets: raw.endpoints.map((ep, index) => {
                const successRate = ep.success.map((val, i) => {
                    const total =
                        ep.success[i] +
                        ep.error[i] +
                        ep.server[i];

                    return (ep.success[i] / total) * 100;
                });

                return {
                    label: ep.name,
                    data: successRate,
                    borderColor:
                        COLOR_PALETTE[index % COLOR_PALETTE.length],
                    backgroundColor:
                        COLOR_PALETTE[index % COLOR_PALETTE.length],
                    tension: 0.4,
                    fill: false
                };
            })
        };
    }

    render() {
        const chartData = this.getChartData();
        const { success, error, server } = this.getSummary();
        return (
            <div>
                <div style={{ marginBottom: "20px" }}>
                    <label>Time Range: </label>
                    <select
                        value={this.state.time_range}
                        onChange={(e) =>
                            this.setState({ time_range: e.target.value })
                        }
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
                        onChange={(e) =>
                            this.setState({ view_mode: e.target.value })
                        }
                    >
                        <option value="overall">Overall</option>
                        <option value="endpoint">Per Endpoint</option>
                    </select>
                </div>
                <Line data={chartData} />
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        marginBottom: "20px"
                    }}
                >
                    <div className="cards-container">
                        <div className="metric-card">
                            <div className="metric-title">Overall Success</div>
                            <div className="metric-value success-value">
                                {success.toFixed(2)}%
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">Error Rate</div>
                            <div className="metric-value error-value">
                                {error.toFixed(2)}%
                            </div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-title">5xx Rate</div>
                            <div className="metric-value server-value">
                                {server.toFixed(2)}%
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SuccessRate;