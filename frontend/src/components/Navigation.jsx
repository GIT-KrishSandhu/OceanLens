import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  Database,
  BarChart3,
  MessageCircle,
  User,
  Bell,
  Search,
  Menu,
  Download,
  Settings,
  ChevronDown,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Data Explorer", icon: Database, path: "/data" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
  ];

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <nav
      className="gradient-level-1"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 30,
        backdropFilter: "blur(20px)",
        borderBottom: "2px solid var(--blue-70)",
      }}
    >
      <div style={{ padding: "2px 24px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo and Brand */}
          <div>
            <Link to="/">
              <img
                src="/unnamed-removebg-preview.png"
                alt="OceanLens Logo"
                style={{ height: "80px", width: "auto" }}
              />
            </Link>
          </div>

          {/* Search Bar */}
          <div
            style={{
              display: "flex",
              flex: 1,
              maxWidth: "500px",
              margin: "0 32px",
            }}
          >
            <div style={{ position: "relative", width: "100%" }}>
              <Search
                style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--blue-30)",
                  width: "20px",
                  height: "20px",
                }}
              />
              <input
                type="text"
                placeholder="Search ocean data, floats, or locations..."
                className="glass-effect"
                style={{
                  width: "100%",
                  padding: "8px 16px 8px 48px",
                  borderRadius: "16px",
                  color: "var(--blue-15)",
                  fontSize: "14px",
                  outline: "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "var(--blue-50)";
                  e.target.style.boxShadow = "0 0 0 4px rgba(0, 102, 255, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "var(--blue-70)";
                  e.target.style.boxShadow = "var(--shadow-medium)";
                }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={
                  location.pathname === item.path
                    ? "professional-button gradient-level-4"
                    : "glass-effect"
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = "var(--glass-medium)";
                    e.target.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = "var(--glass-light)";
                    e.target.style.transform = "translateY(0)";
                  }
                }}
              >
                <item.icon style={{ width: "18px", height: "18px" }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginLeft: "24px",
            }}
          >
            <button
              className="glass-effect"
              style={{
                padding: "8px",
                color: "var(--blue-25)",
                borderRadius: "12px",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Bell style={{ width: "20px", height: "20px" }} />
            </button>

            <div
              style={{
                width: "2px",
                height: "24px",
                background: "var(--gradient-level-3)",
                borderRadius: "1px",
              }}
            ></div>

            {/* Authentication Section */}
            {user ? (
              /* User Profile Dropdown */
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="professional-button gradient-level-4"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      background: "var(--gradient-level-5)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "var(--shadow-medium)",
                    }}
                  >
                    <User
                      style={{
                        width: "16px",
                        height: "16px",
                        color: "var(--blue-15)",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: "500" }}>
                    {user.name}
                  </span>
                  <ChevronDown style={{ width: "16px", height: "16px" }} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div
                    className="gradient-level-2"
                    style={{
                      position: "absolute",
                      top: "100%",
                      right: 0,
                      marginTop: "8px",
                      backdropFilter: "blur(20px)",
                      borderRadius: "16px",
                      padding: "8px",
                      minWidth: "200px",
                      zIndex: 1000,
                    }}
                  >
                    <button
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "var(--blue-20)",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: "14px",
                      }}
                    >
                      <Download style={{ width: "16px", height: "16px" }} />
                      <span>Downloads</span>
                    </button>
                    <button
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "var(--blue-20)",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: "14px",
                      }}
                    >
                      <Settings style={{ width: "16px", height: "16px" }} />
                      <span>Settings</span>
                    </button>
                    <div
                      style={{
                        height: "2px",
                        background: "var(--gradient-level-4)",
                        margin: "8px 0",
                        borderRadius: "1px",
                      }}
                    ></div>
                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        borderRadius: "8px",
                        color: "#ef4444",
                        cursor: "pointer",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        fontSize: "14px",
                      }}
                    >
                      <LogOut style={{ width: "16px", height: "16px" }} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Login/Signup Buttons */
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <button
                  onClick={() => navigate("/login")}
                  className="glass-effect"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    color: "var(--blue-20)",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--glass-medium)";
                    e.target.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--glass-light)";
                    e.target.style.transform = "translateY(0)";
                  }}
                >
                  <LogIn style={{ width: "16px", height: "16px" }} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="professional-button gradient-level-5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  <UserPlus style={{ width: "16px", height: "16px" }} />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
