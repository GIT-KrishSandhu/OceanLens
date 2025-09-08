import { useState } from "react"
import { MapPin, Globe, Layers, Maximize2 } from "lucide-react"

export function MapView({ onFullscreenToggle, isFullscreen = false }) {
  const [viewMode, setViewMode] = useState("trajectories")

  const handleFullscreenToggle = () => {
    if (onFullscreenToggle) {
      onFullscreenToggle()
    }
  }

  return (
    <div style={{ padding: '24px', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="gradient-level-4" style={{ 
            padding: '12px', 
            borderRadius: '16px'
          }}>
            <Globe style={{ width: '24px', height: '24px', color: 'var(--blue-15)' }} />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'var(--blue-15)',
              margin: 0,
              textShadow: '0 0 20px rgba(102, 163, 255, 0.5)'
            }}>Ocean Trajectories</h2>
            <p style={{ fontSize: '14px', color: 'var(--blue-20)', margin: '4px 0 0 0' }}>Real-time Argo float monitoring & data collection</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              const newMode = viewMode === "trajectories" ? "heatmap" : "trajectories";
              setViewMode(newMode);
              console.log(`Switched to ${newMode} view`);
            }}
            className={viewMode === "heatmap" ? "professional-button gradient-level-5" : "glass-effect"}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              borderRadius: '12px', 
              color: viewMode === "heatmap" ? 'var(--blue-15)' : 'var(--blue-20)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              if (viewMode !== "heatmap") {
                e.target.style.background = 'var(--glass-medium)';
                e.target.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (viewMode !== "heatmap") {
                e.target.style.background = 'var(--glass-light)';
                e.target.style.transform = 'translateY(0)';
              }
            }}
          >
            <Layers style={{ width: '18px', height: '18px' }} />
            <span>{viewMode === "trajectories" ? "Heatmap" : "Trajectories"}</span>
          </button>
          <button
            onClick={handleFullscreenToggle}
            className="glass-effect"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '12px 20px', 
              borderRadius: '12px', 
              color: 'var(--blue-20)',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--glass-medium)';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'var(--glass-light)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <Maximize2 style={{ width: '18px', height: '18px' }} />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Professional 3D Ocean Map Container */}
      <div className="gradient-level-3" style={{ 
        position: 'relative', 
        height: '500px', 
        borderRadius: '20px', 
        overflow: 'hidden'
      }}>
        {/* Dark Professional 3D Ocean Background */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: `
            radial-gradient(circle at 30% 20%, var(--blue-85) 0%, transparent 50%),
            radial-gradient(circle at 70% 80%, var(--blue-80) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, var(--blue-75) 0%, transparent 70%)
          `,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Globe style={{ 
              width: '120px', 
              height: '120px', 
              margin: '0 auto 16px', 
              opacity: 0.6, 
              filter: 'drop-shadow(0 0 30px rgba(102, 163, 255, 0.6))',
              color: 'var(--blue-40)'
            }} />
            <p style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              margin: 0, 
              textShadow: '0 0 15px rgba(102, 163, 255, 0.8)',
              color: 'var(--blue-30)'
            }}>Global Ocean Coverage</p>
          </div>
        </div>

        {/* Dark Professional 3D Grid Pattern */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(30, 1fr)', gridTemplateRows: 'repeat(20, 1fr)', height: '100%' }}>
            {[...Array(600)].map((_, i) => (
              <div key={i} style={{ 
                border: `1px solid var(--blue-70)`,
                background: `linear-gradient(45deg, transparent 0%, var(--blue-85) 50%, transparent 100%)`
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
              background: 'var(--gradient-level-5)',
              borderRadius: '50%', 
              boxShadow: 'var(--shadow-heavy)',
              animation: 'pulse 3s infinite',
              position: 'relative',
              border: `2px solid var(--blue-40)`
            }}>
              <div style={{ 
                position: 'absolute', 
                inset: '-4px',
                background: 'var(--gradient-level-4)',
                borderRadius: '50%', 
                animation: 'ping 2s infinite', 
                opacity: 0.6,
                filter: 'blur(2px)'
              }}></div>
              <div style={{ 
                position: 'absolute', 
                inset: '-8px',
                background: 'var(--gradient-level-3)',
                borderRadius: '50%', 
                animation: 'ping 2s infinite 0.5s', 
                opacity: 0.3,
                filter: 'blur(4px)'
              }}></div>
            </div>
            <div className="gradient-level-2" style={{ 
              position: 'absolute', 
              top: '-32px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backdropFilter: 'blur(10px)',
              color: 'var(--blue-20)', 
              fontSize: '11px', 
              padding: '6px 12px', 
              borderRadius: '8px', 
              opacity: 0, 
              transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
              whiteSpace: 'nowrap'
            }}>
              Float #{i + 1}
            </div>
          </div>
        ))}

        {/* Dark Professional Animated Ocean Currents */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '120px',
                height: '4px',
                background: `linear-gradient(90deg, transparent 0%, var(--blue-60) 50%, transparent 100%)`,
                opacity: 0.8,
                animation: `pulse ${2 + i * 0.2}s infinite`,
                left: `${10 + i * 7}%`,
                top: `${20 + (i % 4) * 15}%`,
                transform: `rotate(${i * 15 - 30}deg)`,
                borderRadius: '2px',
                boxShadow: `0 0 15px var(--blue-60)`
              }}
            />
          ))}
        </div>

        {/* Professional Map Controls */}
        <div className="gradient-level-2" style={{ 
          position: 'absolute', 
          top: '20px', 
          left: '20px', 
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'var(--gradient-level-5)',
                borderRadius: '50%', 
                animation: 'pulse 2s infinite',
                boxShadow: 'var(--shadow-medium)',
                border: `1px solid var(--blue-40)`
              }}></div>
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue-20)' }}>1,482 Active</span>
            </div>
            <div style={{ width: '2px', height: '20px', background: 'var(--gradient-level-4)', borderRadius: '1px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
              <span style={{ fontSize: '14px', color: 'var(--blue-25)' }}>Global Coverage</span>
            </div>
          </div>
        </div>

        {/* Professional Legend */}
        <div className="gradient-level-2" style={{ 
          position: 'absolute', 
          bottom: '20px', 
          left: '20px', 
          backdropFilter: 'blur(20px)',
          borderRadius: '16px', 
          padding: '16px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue-20)', marginBottom: '12px' }}>Legend</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'var(--gradient-level-5)',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-light)',
                border: `1px solid var(--blue-40)`
              }}></div>
              <span style={{ fontSize: '12px', color: 'var(--blue-25)' }}>Active Floats</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                background: 'var(--gradient-level-4)',
                borderRadius: '50%',
                boxShadow: 'var(--shadow-light)',
                border: `1px solid var(--blue-50)`
              }}></div>
              <span style={{ fontSize: '12px', color: 'var(--blue-25)' }}>Data Collection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '12px', 
                height: '3px', 
                background: `linear-gradient(90deg, transparent, var(--blue-50), transparent)`,
                borderRadius: '2px',
                boxShadow: `0 0 8px var(--blue-50)`
              }}></div>
              <span style={{ fontSize: '12px', color: 'var(--blue-25)' }}>Ocean Currents</span>
            </div>
          </div>
        </div>

        {/* Professional Last Update */}
        <div className="gradient-level-2" style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: '20px', 
          backdropFilter: 'blur(20px)',
          padding: '12px 16px', 
          borderRadius: '12px', 
          fontSize: '12px'
        }}>
          <div style={{ fontWeight: '600', color: 'var(--blue-20)' }}>Last Update</div>
          <div style={{ color: 'var(--blue-25)', marginTop: '2px' }}>2 min ago</div>
        </div>
      </div>
    </div>
  )
}
