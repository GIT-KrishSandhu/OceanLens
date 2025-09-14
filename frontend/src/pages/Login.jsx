import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // simulate login
      if (formData.email && formData.password) {
        login({ id: 1, name: formData.email.split("@")[0], email: formData.email });
        navigate("/");
      }
    } else {
      // simulate signup
      if (formData.email && formData.password && formData.name) {
        login({ id: 1, name: formData.name, email: formData.email });
        navigate("/");
      }
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/login-back.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        color: "#fff",
        overflow: "hidden",
        position: "relative"
      }}
    >
      {/* Dark overlay for better readability */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 20, 40, 0.7)",
        zIndex: 1
      }}></div>

      {/* Logo */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginBottom: "20px",
        textAlign: "center",
        marginTop: "-25px"
      }}>
        <img
          src="/unnamed-removebg-preview-removebg-preview.png"
          alt="OceanLens Logo"
          style={{
            width: "240px",
            height: "auto",
            filter: "drop-shadow(0 6px 20px rgba(255, 255, 255, 0.4))"
          }}
        />
      </div>

      {/* Auth Card */}
      <div
        style={{
          width: "750px",
          height: "420px",
          background: "rgba(0, 30, 60, 0.9)",
          backdropFilter: "blur(25px)",
          borderRadius: "20px",
          boxShadow: "0 15px 50px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.15)",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          zIndex: 2,
          border: "2px solid rgba(102, 163, 255, 0.3)"
        }}
      >
        {/* Left Panel - Welcome Side */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, rgba(0, 77, 128, 0.9) 0%, rgba(0, 102, 204, 0.9) 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "25px",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isLogin ? "translateX(0)" : "translateX(100%)",
            position: "relative"
          }}
        >
          <div style={{
            textAlign: "center",
            maxWidth: "300px"
          }}>
            <div style={{
              width: "70px",
              height: "70px",
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)",
              borderRadius: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 18px",
              backdropFilter: "blur(15px)",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              boxShadow: "0 6px 24px rgba(59, 130, 246, 0.3)"
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="rgba(255, 255, 255, 0.9)" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
                <circle cx="12" cy="12" r="3" fill="rgba(102, 163, 255, 0.8)" />
                <path d="M12 19C15.866 19 19 15.866 19 12C19 8.134 15.866 5 12 5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h1 style={{
              fontSize: "26px",
              marginBottom: "12px",
              fontWeight: "700",
              textShadow: "0 4px 15px rgba(0, 0, 0, 0.4)"
            }}>
              {isLogin ? "Welcome Back, Explorer!" : "Dive into the Ocean of Data"}
            </h1>

            <p style={{
              fontSize: "14px",
              marginBottom: "20px",
              opacity: 0.95,
              lineHeight: "1.4",
              fontWeight: "400"
            }}>
              {isLogin
                ? "Continue your journey to decode the ocean's hidden stories."
                : "Join OceanLens to explore ARGO float data made simple, visual, and interactive."
              }
            </p>

            <button
              onClick={() => setIsLogin(!isLogin)}
              style={{
                padding: "16px 40px",
                background: "transparent",
                border: "2px solid rgba(255, 255, 255, 0.9)",
                borderRadius: "50px",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontSize: "17px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "1.2px"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 12px 30px rgba(255, 255, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {isLogin ? "Start Exploring" : "Dive In"}
            </button>
          </div>
        </div>

        {/* Right Panel - Form Side */}
        <div
          style={{
            flex: 1,
            padding: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isLogin ? "translateX(0)" : "translateX(-100%)",
            background: "rgba(0, 20, 40, 0.6)",
            backdropFilter: "blur(10px)"
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              maxWidth: "350px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "18px" }}>
              <h2 style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "6px",
                background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {isLogin ? "Sign In" : "Create Account"}
              </h2>
              <p style={{
                color: "#94a3b8",
                fontSize: "13px",
                margin: 0,
                lineHeight: "1.3"
              }}>
                {isLogin ? "Access your ocean analytics dashboard" : "Start your ocean exploration journey"}
              </p>
            </div>

            {/* Name Field - Only for Signup */}
            {!isLogin && (
              <div style={{ position: "relative" }}>
                <User style={{
                  position: "absolute",
                  left: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  color: "#64748b",
                  zIndex: 1
                }} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    ...inputStyle,
                    paddingLeft: "48px"
                  }}
                />
              </div>
            )}

            {/* Email Field */}
            <div style={{ position: "relative" }}>
              <Mail style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "#64748b",
                zIndex: 1
              }} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  paddingLeft: "48px"
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ position: "relative" }}>
              <Lock style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "20px",
                height: "20px",
                color: "#64748b",
                zIndex: 1
              }} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  paddingLeft: "48px",
                  paddingRight: "48px"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  zIndex: 1
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                padding: "18px",
                background: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
                border: "none",
                borderRadius: "18px",
                color: "#fff",
                fontWeight: "700",
                cursor: "pointer",
                fontSize: "17px",
                transition: "all 0.3s ease",
                boxShadow: "0 10px 40px rgba(59, 130, 246, 0.5)",
                marginTop: "12px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 15px 50px rgba(59, 130, 246, 0.7)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 10px 40px rgba(59, 130, 246, 0.5)";
              }}
            >
              {isLogin ? "Dive In" : "Start Exploring"}
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        position: "relative",
        zIndex: 2,
        marginTop: "15px",
        textAlign: "center"
      }}>
        <p style={{
          color: "rgba(255, 255, 255, 0.85)",
          fontSize: "14px",
          margin: 0,
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)",
          fontWeight: "500"
        }}>
          Powered by <span style={{ fontWeight: "700", color: "#60a5fa", textShadow: "0 0 8px rgba(96, 165, 250, 0.5)" }}>AGRO</span> | Refined by <span style={{ fontWeight: "700", color: "#06b6d4", textShadow: "0 0 8px rgba(6, 182, 212, 0.5)" }}>OCEANLENS</span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "16px",
  borderRadius: "16px",
  border: "2px solid rgba(59, 130, 246, 0.2)",
  background: "rgba(0, 77, 128, 0.6)",
  backdropFilter: "blur(10px)",
  color: "#e2e8f0",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.3s ease",
  boxSizing: "border-box"
};
