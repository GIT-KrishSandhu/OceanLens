import { useState } from "react"
import { ChevronDown, Filter, Calendar, Thermometer, Waves, MapPin, Gauge, Droplets, X, Zap } from "lucide-react"

export function Sidebar({ isOpen, onToggle }) {
  const [region, setRegion] = useState("Global")
  const [floatType, setFloatType] = useState("Core")
  const [parameters, setParameters] = useState({
    temperature: true,
    salinity: true,
    pressure: false,
    oxygen: false,
  })

  if (!isOpen) return null

  const handleApplyFilters = () => {
    console.log("Applied Filters:", { region, floatType, parameters })
  }

  return (
    <div className="gradient-level-2" style={{
      position: 'fixed',
      left: 0,
      top: '80px',
      height: 'calc(100vh - 80px)',
      width: '320px',
      backdropFilter: 'blur(20px)',
      borderRight: '2px solid var(--blue-70)',
      boxShadow: 'var(--shadow-heavy)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Close Button */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '8px',
          color: '#94a3b8',
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 50
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
          e.target.style.color = '#e2e8f0';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
          e.target.style.color = '#94a3b8';
        }}
      >
        <X style={{ width: '16px', height: '16px' }} />
      </button>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '8px',
          padding: '16px',
          margin: '-24px -24px 8px -24px',
          background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(15, 118, 110, 0.8) 100%)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div style={{ 
            padding: '10px', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
            borderRadius: '12px',
            border: '2px solid rgba(59, 130, 246, 0.8)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.6)'
          }}>
            <Filter style={{ width: '20px', height: '20px', color: '#ffffff', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' }} />
          </div>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: '600', 
            color: '#ffffff',
            margin: 0
          }}>Data Filters</h2>
        </div>

        {/* Region Filter */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Ocean Region</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'var(--blue-90)',
                border: '2px solid var(--blue-70)',
                borderRadius: '12px',
                color: 'var(--blue-15)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--blue-50)';
                e.target.style.boxShadow = '0 0 0 4px rgba(0, 102, 255, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--blue-70)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Global" style={{ background: 'var(--blue-90)' }}>Global</option>
              <option value="Atlantic" style={{ background: 'var(--blue-90)' }}>Atlantic Ocean</option>
              <option value="Pacific" style={{ background: 'var(--blue-90)' }}>Pacific Ocean</option>
              <option value="Indian" style={{ background: 'var(--blue-90)' }}>Indian Ocean</option>
              <option value="Arctic" style={{ background: 'var(--blue-90)' }}>Arctic Ocean</option>
            </select>
            <ChevronDown style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '16px', 
              height: '16px', 
              color: '#64748b',
              pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Date Range */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <Calendar style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Date Range</span>
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <input
              type="date"
              defaultValue="2018-01-01"
              style={{
                padding: '12px',
                background: 'var(--blue-90)',
                border: '2px solid var(--blue-70)',
                borderRadius: '12px',
                color: 'var(--blue-15)',
                fontSize: '12px',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
            <input
              type="date"
              defaultValue="2024-12-31"
              style={{
                padding: '12px',
                background: 'var(--blue-90)',
                border: '2px solid var(--blue-70)',
                borderRadius: '12px',
                color: 'var(--blue-15)',
                fontSize: '12px',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            />
          </div>
        </div>

        {/* Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>Ocean Parameters</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(parameters).map(([key, checked]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => setParameters((prev) => ({ ...prev, [key]: e.target.checked }))}
                  style={{
                    width: '18px',
                    height: '18px',
                    accentColor: '#3b82f6',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {key === "temperature" && <Thermometer style={{ width: '16px', height: '16px', color: '#f97316' }} />}
                  {key === "salinity" && <Waves style={{ width: '16px', height: '16px', color: '#3b82f6' }} />}
                  {key === "pressure" && <Gauge style={{ width: '16px', height: '16px', color: '#8b5cf6' }} />}
                  {key === "oxygen" && <Droplets style={{ width: '16px', height: '16px', color: '#10b981' }} />}
                  <span style={{ fontSize: '14px', color: '#e2e8f0', textTransform: 'capitalize' }}>{key}</span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Float Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: '500', color: '#cbd5e1' }}>Float Type</label>
          <div style={{ position: 'relative' }}>
            <select
              value={floatType}
              onChange={(e) => setFloatType(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(0, 46, 77, 0.8)',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                color: '#e2e8f0',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              <option value="Core" style={{ background: '#1e293b' }}>Core</option>
              <option value="BGC" style={{ background: '#1e293b' }}>BGC (Biogeochemical)</option>
              <option value="Deep" style={{ background: '#1e293b' }}>Deep</option>
            </select>
            <ChevronDown style={{ 
              position: 'absolute', 
              right: '12px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              width: '16px', 
              height: '16px', 
              color: '#64748b',
              pointerEvents: 'none'
            }} />
          </div>
        </div>

        {/* Apply Button */}
        <button
          onClick={handleApplyFilters}
          style={{
            width: '100%',
            padding: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
            border: 'none',
            borderRadius: '16px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
            transition: 'all 0.3s ease',
            marginTop: 'auto'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
          }}
        >
          <Zap style={{ width: '16px', height: '16px' }} />
          Apply Filters
        </button>
      </div>
    </div>
  )
}
