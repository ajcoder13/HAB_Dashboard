import { processData } from "../data/Process_Health_data";

const getStatusColor = (status) => {
    if (status === "online") return "green";
    if (status === "errored") return "red";
    return "gray";
};

const ProcessHealth = () => {
    return (
        <div className="process-container">
        <h2>Process Health (PM2)</h2>
        <div className="card-container">
            {processData.map((p) => (
            <div
                key={p.name}
                className="status-card"
                style={{ borderTop: `6px solid ${getStatusColor(p.status)}` }}
            >
                <h3>{p.name}</h3>
                <p className={`status ${p.status}`}>{p.status}</p>
                <p>CPU: {p.cpu}%</p>
                <p>Memory: {p.memory} MB</p>
                <p>Uptime: {p.uptime}</p>
                <p>Restarts: {p.restarts}</p>
            </div>
            ))}
        </div>

        <table className="process-table">
            <thead>
            <tr>
                <th>Name</th>
                <th>Status</th>
                <th>CPU %</th>
                <th>Memory (MB)</th>
                <th>Restarts</th>
                <th>PID</th>
                <th>Action</th>
            </tr>
            </thead>
            <tbody>
            {processData.map((p) => (
                <tr key={p.name}>
                <td>{p.name}</td>
                <td className={p.status}>{p.status}</td>
                <td>{p.cpu}%</td>
                <td>{p.memory}</td>
                <td>{p.restarts}</td>
                <td>{p.pid}</td>
                <td>
                    <button className="action-btn">
                    Manage
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default ProcessHealth;
