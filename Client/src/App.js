import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CPU from "./screens/CPU";
import Memory from "./screens/Project_Health";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CPU />} />
        <Route path="/memory" element={<Memory />} />
      </Routes>
    </Router>
  );
}

export default App;