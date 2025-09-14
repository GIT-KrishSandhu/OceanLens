// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { AlertBanner } from "./components/NotificationSystem";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home viewMode="dashboard" />} />
            <Route path="/data" element={<Home viewMode="dataExplorer" />} />
            <Route path="/chat" element={<Home viewMode="chatbot" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Login />} />
          </Routes>
          <AlertBanner />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
