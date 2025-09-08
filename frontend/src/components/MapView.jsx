"use client"

import { useState } from "react"
import { BarChart3, ToggleLeft, ToggleRight, MapPin, Activity, Globe, Layers, Maximize2, Waves, Zap } from "lucide-react"

export function MapView() {
  const [chatbotEnabled, setChatbotEnabled] = useState(false)
  const [viewMode, setViewMode] = useState("trajectories")

  return (
    <div style={{ padding: '24px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            padding: '12px', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
          }}>
            <Globe style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>Ocean Trajectories</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>Real-time Argo float monitoring & data collection</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setViewMode(viewMode === "trajectories" ? "heatmap" : "trajectories")}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px', 
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(15, 23, 42, 0.8)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
          >
            <Layers style={{ width: '18px', height: '18px' }} />
            <span>{viewMode === "trajectories" ? "Heatmap" : "Trajectories"}</span>
          </button>
          <button
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '12px', 
              color: '#e2e8f0',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(15, 23, 42, 0.8)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
          >
            <Maximize2 style={{ width: '18px', height: '18px' }} />
            <span>Fullscreen</span>
          </button>
        </div>
      </div>

      {/* 3D Ocean Map Container */}
      <div style={{ 
        position: 'relative', 
        height: '500px', 
        background: `
          radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%),
          linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
        `,
        borderRadius: '20px', 
        overflow: 'hidden', 
        border: '2px solid rgba(59, 130, 246, 0.2)',
        boxShadow: 'inset 0 0 100px rgba(6, 182, 212, 0.1), 0 20px 40px rgba(0, 0, 0, 0.3)',
        position: 'relative'
      }}>
        {/* 3D Ocean Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `
            radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, rgba(6, 182, 212, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)
          `,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center', color: '#60a5fa' }}>
            <Globe style={{ width: '120px', height: '120px', margin: '0 auto 16px', opacity: 0.6, filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.3))' }} />
            <p style={{ fontSize: '16px', fontWeight: '600', margin: 0, textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>Global Ocean Coverage</p>
          </div>
        </div>

        {/* 3D Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gridTemplateRows: 'repeat(20, 1fr)', height: '100%' }}>
            {[...Array(600)].map((_, i) => (
              <div key={i} style={{ 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                background: 'linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)'
              }}></div>
            ))}
          </div>
        </div>

        {/* Animated Float Data Points */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${8 + (i * 3.5) % 84}%`,
              top: `${12 + (i % 6) * 12}%`,
              cursor: 'pointer',
              zIndex: 10
            }}
          >
            <div style={{ 
              width: '16px', 
              height: '16px', 
              background: 'linear-gradient(135deg, #4ade80 0%, #10b981 50%, #059669 100%)',
              borderRadius: '50%', 
              boxShadow: '0 0 20px rgba(74, 222, 128, 0.6), 0 4px 12px rgba(0, 0, 0, 0.3)',
              animation: 'pulse 3s infinite',
              position: 'relative'
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: '-4px',
                background: 'linear-gradient(135deg, #4ade80, #10b981)',
                borderRadius: '50%', 
                animation: 'ping 2s infinite', 
                opacity: 0.4,
                filter: 'blur(2px)'
              }}></div>
              <div style={{ 
                position: 'absolute', 
                inset: '-8px',
                background: 'linear-gradient(135deg, #4ade80, #10b981)',
                borderRadius: '50%', 
                animation: 'ping 2s infinite 0.5s', 
                opacity: 0.2,
                filter: 'blur(4px)'
              }}></div>
            </div>
            <div style={{ 
              position: 'absolute', 
              top: '-32px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              background: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(10px)',
              color: 'white', 
              fontSize: '11px', 
              padding: '6px 12px', 
              borderRadius: '8px', 
              opacity: 0, 
              transition: 'opacity 0.3s ease', 
              whiteSpace: 'nowrap',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}>
              Float #{i + 1}
            </div>
          </div>
        ))}

        {/* Animated Ocean Currents */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '120px',
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.6) 50%, transparent 100%)',
                opacity: 0.6,
                animation: `pulse ${2 + i * 0.2}s infinite`,
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 4) * 15}%`,
                transform: `rotate(${i * 15 - 30}deg)`,
                borderRadius: '2px',
                boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)'
              }}
            />
          ))}
        </div>

        {/* Enhanced Map Controls */}
        <div style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '16px', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderRadius: '50%', 
                animation: 'pulse 2s infinite',
                boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)'
              }}></div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>1,482 Active</span>
            </div>
            <div style={{ width: '2px', height: '20px', background: 'linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.5), transparent)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>Global Coverage</span>
            </div>
          </div>
        </div>

        {/* Enhanced Legend */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '16px', 
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0', marginBottom: '12px' }}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'linear-gradient(135deg, #4ade80, #10b981)',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(74, 222, 128, 0.6)'
              }}></div>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Active Floats</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
                borderRadius: '50%',
                boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)'
              }}></div>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Data Collection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '3px', 
                background: 'linear-gradient(90deg, transparent, #60a5fa, transparent)',
                borderRadius: '2px',
                boxShadow: '0 0 8px rgba(96, 165, 250, 0.6)'
              }}></div>
              <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Ocean Currents</span>
            </div>
          </div>
        </div>

        {/* Enhanced Last Update */}
        <div style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          color: 'white', 
          padding: '12px 16px', 
          borderRadius: '12px', 
          fontSize: '12px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{ fontWeight: '600', color: '#e2e8f0' }}>Last Update</div>
          <div style={{ color: '#94a3b8', marginTop: '2px' }}>2 min ago</div>
        </div>
      </div>
    </div>
  )
}
