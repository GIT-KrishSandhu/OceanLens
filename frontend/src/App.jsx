// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/data" element={<Home />} />
        <Route path="/visuals" element={<Home />} />
        <Route path="/chat" element={<Home />} />
        <Route path="/downloads" element={<Home />} />
        <Route path="/settings" element={<Home />} />
      </Routes>
    </Router>
  );
}
