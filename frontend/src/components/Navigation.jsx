import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, Database, BarChart3, MessageCircle, User, Bell, Search, Menu, Download, Settings, ChevronDown, LogOut } from "lucide-react";

export function Navigation() {
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const navItems = [
    { name: "Dashboard", icon: Home, path: "/" },
    { name: "Data Explorer", icon: Database, path: "/data" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ padding: '16px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                position: 'relative'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>O</span>
                <div style={{
                  position: 'absolute',
                  inset: '-2px',
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)',
                  borderRadius: '18px',
                  zIndex: -1,
                  opacity: 0.3,
                  filter: 'blur(8px)'
                }}></div>
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>OceanLens</h1>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>Advanced Ocean Analytics</p>
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
                  border: '2px solid rgba(59, 130, 246, 0.2)',
                  borderRadius: '16px',
                  background: 'rgba(15, 23, 42, 0.8)',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease'
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
                    ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)'
                    : 'transparent',
                  color: location.pathname === item.path ? '#60a5fa' : '#94a3b8',
                  border: location.pathname === item.path 
                    ? '1px solid rgba(59, 130, 246, 0.3)'
                    : '1px solid transparent',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                    e.target.style.color = '#e2e8f0';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== item.path) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#94a3b8';
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
              color: '#94a3b8',
              background: 'rgba(59, 130, 246, 0.1)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <Bell style={{ width: '20px', height: '20px' }} />
            </button>
            
            <button style={{
              padding: '10px',
              color: '#94a3b8',
              background: 'rgba(59, 130, 246, 0.1)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <MessageCircle style={{ width: '20px', height: '20px' }} />
            </button>
            
            <div style={{ width: '1px', height: '24px', background: 'rgba(59, 130, 246, 0.2)' }}></div>
            
            {/* User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '12px',
                  color: '#e2e8f0',
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
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Admin</span>
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
                    color: '#e2e8f0',
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
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '14px'
                  }}>
                    <Settings style={{ width: '16px', height: '16px' }} />
                    <span>Settings</span>
                  </button>
                  <div style={{ height: '1px', background: 'rgba(59, 130, 246, 0.2)', margin: '8px 0' }}></div>
                  <button style={{
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
          </div>
        </div>
      </div>
    </nav>
  );
}
