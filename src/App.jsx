import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/Homepage";
import Workspace from "./workspace/workspace.jsx"; // Added .jsx extension

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/workspace" element={<Workspace />} />
      </Routes>
    </Router>
  );
}