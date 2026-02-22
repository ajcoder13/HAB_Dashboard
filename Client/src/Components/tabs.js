import React from "react";
import { Link } from "react-router-dom";

const Tabs = () => {
    return (
        <div id="tabsBar">
            <Link to="/" className="tabs">System Health</Link>
            <Link to="/memory" className="tabs">Memory</Link>
            <Link to="/disk" className="tabs">Disk</Link>
        </div>
    );
};

export default Tabs;