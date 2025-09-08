import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Home, Database, BarChart3, MessageCircle, User, Bell, Search, Menu, Download, Settings, ChevronDown, LogOut, LogIn, UserPlus } from "lucide-react";

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
    navigate('/');
  };

  return (
    <nav style={{
      background: `
        radial-gradient(ellipse at top, rgba(0, 46, 77, 0.9) 0%, transparent 70%),
        linear-gradient(135deg, #002e4d 0%, #003d66 25%, #004d80 50%, #005c99 75%, #006bb3 100%)
      `,
      borderBottom: '1px solid rgba(0, 46, 77, 0.3)',
      boxShadow: `
        0 8px 32px rgba(0, 46, 77, 0.2),
        0 4px 16px rgba(0, 61, 102, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <div style={{ padding: '4px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo and Brand */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link to="/">
                    <img
                      src="/WhatsApp_Image_2025-09-08_at_14.18.35_c9b9a178-removebg-preview.png"
                      alt="OceanLens Logo"
                      style={{ height: "48px", width: "auto" }}
                    />
                  </Link>

                </div>
              </div>
            </div>
       
          </div>

          {/* Search Bar */}
          <div style={{ display: 'flex', flex: 1, maxWidth: '500px', margin: '0 32px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search style={{ 
                position: 'absolute', 
                left: '16px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#64748b', 
                width: '20px', 
                height: '20px' 
              }} />
              <input
                type="text"
                placeholder="Search ocean data, floats, or locations..."
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 48px',
                  border: '2px solid rgba(0, 46, 77, 0.3)',
                  borderRadius: '16px',
                  background: `
                    radial-gradient(circle at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)
                  `,
                  color: '#1e293b',
                  fontSize: '14px',
                  outline: 'none',
                  backdropFilter: 'blur(20px)',
                  transition: 'all 0.3s ease',
                  boxShadow: `
                    0 4px 16px rgba(0, 46, 77, 0.2),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3)
                  `
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {navItems.map((item) => (
              <button
                key={item.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  background: location.pathname === item.path 
                    ? `
                        radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%),
                        linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)
                      `
                    : 'transparent',
                  color: location.pathname === item.path ? '#3b82f6' : '#64748b',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(59, 130, 246, 0.4)'
                    : '1px solid transparent',
                  boxShadow: location.pathname === item.path 
                    ? '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.color = '#1e293b';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#64748b';
                  }
                }}
              >
                <item.icon style={{ width: '18px', height: '18px' }} />
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '24px' }}>
            <button style={{
              padding: '10px',
              color: '#64748b',
              background: `
                radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)
              `,
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <Bell style={{ width: '20px', height: '20px' }} />
            </button>
            
            <button style={{
              padding: '10px',
              color: '#64748b',
              background: `
                radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.1) 100%)
              `,
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              <MessageCircle style={{ width: '20px', height: '20px' }} />
            </button>
            
            <div style={{ width: '1px', height: '24px', background: 'rgba(59, 130, 246, 0.2)' }}></div>
            
            {/* Authentication Section */}
            {user ? (
              /* User Profile Dropdown */
              <div style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                  background: `
                    radial-gradient(circle at center, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.2) 100%),
                    linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)
                  `,
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
                  }}>
                    <User style={{ width: '16px', height: '16px', color: 'white' }} />
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                  <ChevronDown style={{ width: '16px', height: '16px' }} />
                </button>
              
              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '200px',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
                  zIndex: 1000
                }}>
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}>
                    <Download style={{ width: '16px', height: '16px' }} />
                    <span>Downloads</span>
                  </button>
                  <button style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}>
                    <Settings style={{ width: '16px', height: '16px' }} />
                    <span>Settings</span>
                  </button>
                  <div style={{ height: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '8px 0' }}></div>
                  <button 
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ef4444',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      fontSize: '14px'
                    }}>
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
            ) : (
              /* Login/Signup Buttons */
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'transparent',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.borderColor = '#3b82f6';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <LogIn style={{ width: '16px', height: '16px' }} />
                  <span>Login</span>
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px',
                    fontWeight: '500',
                    boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  <UserPlus style={{ width: '16px', height: '16px' }} />
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
