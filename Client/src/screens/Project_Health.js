import React, { Component } from "react";
import Tabs from "../Components/tabs";
import Rps from "../Components/RPS";
import SuccessRate from "../Components/Success_Rate";
import ResponseTime from "../Components/Response_time";
import StatusCode from "../Components/Status_Code";
import "./App.css";

class Memory extends Component {
    render() {
        return (
        <div className="App">
            <Tabs />
            <br />
            <h1 className="Metrics-heading">
            Request Rate (RPS)
            </h1>
            <Rps />
            <br/>
            <h1 className="Metrics-heading">
            Success Rate
            </h1>
            <SuccessRate/>
            <br/>
            <h1 className="Metrics-heading">
            Response Time Metrics
            </h1>
            <ResponseTime/>
            <br/>
            <h1 className="Metrics-heading">
            Status Code Distribution
            </h1>
            <StatusCode/>
        </div>
        );
    }
}

export default Memory;