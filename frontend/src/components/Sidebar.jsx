import { useState } from "react"
import { ChevronDown, Filter, Calendar, Database, MapPin, Waves, X, Zap, Download, Plus, Lock, LogIn } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

export function Sidebar({ isOpen, onToggle }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [region, setRegion] = useState("Coral Sea")
  const [dataSource, setDataSource] = useState("OON")
  const [selectedParameters, setSelectedParameters] = useState([])
  const [dateRange, setDateRange] = useState({ start: "2025-01-01", end: "2025-01-10" })
  const [showParameterDropdown, setShowParameterDropdown] = useState(false)
  const [showLoginWarning, setShowLoginWarning] = useState(false)

  // Data source configurations - Updated with exact CSV column names
const dataSources = {
  OON: {
    name: "Ocean Observation Network (INCOIS)",
    hasDate: false,
    parameters: [
      { key: "chlor_a", label: "Chlorophyll-a concentration (mg/m³)" },
      { key: "pic", label: "Particulate Inorganic Carbon (PIC, mg/m³)" },
      { key: "Kd_490", label: "Diffuse Attenuation Coefficient at 490 nm (m⁻¹)" },
      { key: "poc", label: "Particulate Organic Carbon (POC, mg/m³)" },
      { key: "aot_862", label: "Aerosol Optical Thickness at 862 nm (dimensionless)" },
      { key: "sst", label: "Sea Surface Temperature (°C)" }
    ]
  },
  Ifremer: {
    name: "Ifremer Database",
    hasDate: true,
    parameters: [
      { key: "float_id", label: "Float ID" },
      { key: "temp_mean", label: "Temperature Mean (°C)" },
      { key: "temp_median", label: "Temperature Median (°C)" },
      { key: "temp_std_dev", label: "Temperature Std Dev (°C)" },
      { key: "salinity_mean", label: "Salinity Mean (PSU)" },
      { key: "salinity_max", label: "Salinity Max (PSU)" },
      { key: "pressure_max", label: "Pressure Max (dbar)" }
    ]
  }
}


  // Ocean regions for both datasets
  const oceanRegions = [
    // Indian Ocean regions (for Ifremer data)
    "Arabian Sea",
    "Bay of Bengal", 
    "Andaman Sea",
    "Laccadive Sea",
    "Somali Sea",
    "Mozambique Channel",
    "Madagascar Basin",
    "Mascarene Basin",
    "Central Indian Basin",
    "Wharton Basin",
    "Perth Basin",
    "Great Australian Bight",
    // Pacific Ocean regions (for OON data)
    "Coral Sea",
    "Tasman Sea", 
    "South Pacific"
  ]

  if (!isOpen) return null

  const handleApplyFilters = () => {
    console.log("Applied Filters:", { region, dataSource, selectedParameters, dateRange })
  }
const buildQueryParams = () => {
  const params = {}
  if (region) params.region = region
  if (dataSource) params.data_source = dataSource
  
  // Only add date range for Ifremer data
  if (dataSources[dataSource].hasDate) {
    if (dateRange?.start) params.start_date = dateRange.start
    if (dateRange?.end) params.end_date = dateRange.end
  }

  if (selectedParameters && selectedParameters.length > 0) {
    params.parameters = selectedParameters.join(",")
  }
  return params
}
const handleExportData = async () => {
  // Temporarily allow export without login for testing
  // if (!user) {
  //   navigate('/login')
  //   return
  // }

  const params = buildQueryParams()
  const query = new URLSearchParams(params).toString()

  // Vite env var convention: VITE_API_URL (see .env below)
  const API_BASE ="http://127.0.0.1:8000"
  const endpoint = `${API_BASE}/data_filters/download/?${query}`

  console.log("Export request:", { params, query, endpoint })

  try {
    const token = user?.token || user?.accessToken || null
    const headers = token ? { "Authorization": `Bearer ${token}` } : {}

    console.log("Making request to:", endpoint)
    const res = await fetch(endpoint, { method: "GET", headers })
    
    console.log("Response status:", res.status, res.statusText)
    console.log("Response headers:", Object.fromEntries(res.headers.entries()))
    
    if (!res.ok) {
      const text = await res.text().catch(()=>null)
      console.error("Export failed:", res.status, text)
      alert(`Export failed: ${res.status} ${text ? "— " + text : ""}`)
      return
    }

    const blob = await res.blob()
    console.log("Blob size:", blob.size)
    
    if (blob.size === 0) {
      alert("No data found for the selected filters. Please try different parameters.")
      return
    }

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url

    // read filename from header if present
    const cd = res.headers.get("Content-Disposition")
    let filename = "filtered_data.csv"
    if (cd) {
      const m = /filename="?(.+?)"?($|;)/.exec(cd)
      if (m) filename = m[1]
    }
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
    
    console.log("Export successful:", filename)
  } catch (err) {
    console.error("Export error:", err)
    alert(`Export failed: ${err.message}. Please check if the backend server is running on port 8000.`)
  }
}


  const addParameter = (parameter) => {
    if (!selectedParameters.includes(parameter)) {
      setSelectedParameters([...selectedParameters, parameter])
    }
    setShowParameterDropdown(false)
  }

  const removeParameter = (parameter) => {
    setSelectedParameters(selectedParameters.filter(p => p !== parameter))
  }

  const handleDataSourceChange = (newSource) => {
    setDataSource(newSource)
    setSelectedParameters([])
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

      <div 
        className="custom-scrollbar"
        style={{ 
          padding: '20px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px', 
          height: '100%', 
          overflowY: 'auto',
          background: 'linear-gradient(180deg, rgba(0, 30, 60, 0.1) 0%, rgba(0, 46, 77, 0.05) 100%)'
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px', 
          marginBottom: '8px',
          padding: '16px',
          margin: '-20px -20px 8px -20px',
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
          }}>Advanced Filters</h2>
        </div>        {
/* Data Source */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <Database style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Data Sources</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={dataSource}
              onChange={(e) => handleDataSourceChange(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(0, 77, 128, 0.8) 0%, rgba(0, 61, 102, 0.8) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '14px',
                color: 'var(--blue-15)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}
            >
              <option value="OON" style={{ background: 'var(--blue-90)' }}>Ocean Observation Network (INCOIS)</option>
              <option value="Ifremer" style={{ background: 'var(--blue-90)' }}>Ifremer Database</option>
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

        {/* Ocean Region */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <MapPin style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Ocean Regions</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(0, 77, 128, 0.8) 0%, rgba(0, 61, 102, 0.8) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '14px',
                color: 'var(--blue-15)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)'
              }}
            >
              {oceanRegions.map(regionName => (
                <option key={regionName} value={regionName} style={{ background: 'var(--blue-90)' }}>
                  {regionName}
                </option>
              ))}
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

        {/* Date Range - Cool Interactive UI - Only for Ifremer data */}
        {dataSources[dataSource].hasDate && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <Calendar style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Date Range Selection</span>
          </label>
          
          {/* Date Range Card */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(0, 77, 128, 0.8) 0%, rgba(0, 61, 102, 0.8) 100%)',
            borderRadius: '18px',
            border: '2px solid rgba(59, 130, 246, 0.4)',
            boxShadow: '0 6px 24px rgba(59, 130, 246, 0.3)',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
              `,
              pointerEvents: 'none'
            }}></div>
            
            {/* Date Inputs Container */}
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              position: 'relative',
              zIndex: 1
            }}>
              {/* From Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#10b981',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)'
                  }}></div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#10b981', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>Start Date</span>
                </div>
                <input
                  type="date"
                  value={dateRange.start}
                  max={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 46, 77, 0.9)',
                    border: '2px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '14px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#10b981';
                    e.target.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.2), 0 8px 20px rgba(0, 0, 0, 0.4)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>

              {/* Date Range Connector */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '4px 0'
              }}>
                <div style={{
                  width: '40px',
                  height: '2px',
                  background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)',
                  borderRadius: '1px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    right: '-4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid #06b6d4',
                    borderTop: '3px solid transparent',
                    borderBottom: '3px solid transparent'
                  }}></div>
                </div>
              </div>

              {/* To Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#06b6d4',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px rgba(6, 182, 212, 0.6)'
                  }}></div>
                  <span style={{ 
                    fontSize: '12px', 
                    color: '#06b6d4', 
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px'
                  }}>End Date</span>
                </div>
                <input
                  type="date"
                  value={dateRange.end}
                  min={dateRange.start}
                  max="2025-12-31"
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: 'rgba(0, 46, 77, 0.9)',
                    border: '2px solid rgba(6, 182, 212, 0.4)',
                    borderRadius: '14px',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    fontWeight: '500',
                    outline: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    cursor: 'pointer'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#06b6d4';
                    e.target.style.boxShadow = '0 0 0 4px rgba(6, 182, 212, 0.2), 0 8px 20px rgba(0, 0, 0, 0.4)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                />
              </div>

              {/* Date Range Info */}
              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                marginTop: '4px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '500' }}>
                    Selected Range:
                  </span>
                  <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '600' }}>
                    {(() => {
                      const start = new Date(dateRange.start);
                      const end = new Date(dateRange.end);
                      const diffTime = Math.abs(end - start);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return `${diffDays} days`;
                    })()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}        
{/* Ocean Parameters */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500', color: 'var(--blue-20)' }}>
            <Waves style={{ width: '16px', height: '16px', color: 'var(--blue-30)' }} />
            <span>Ocean Parameters</span>
          </label>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowParameterDropdown(!showParameterDropdown)}
              style={{
                width: '100%',
                padding: '14px 16px',
                background: 'linear-gradient(135deg, rgba(0, 77, 128, 0.8) 0%, rgba(0, 61, 102, 0.8) 100%)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '14px',
                color: 'var(--blue-15)',
                fontSize: '14px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>Add Parameter</span>
              </div>
              <ChevronDown style={{ 
                width: '16px', 
                height: '16px', 
                transform: showParameterDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s ease'
              }} />
            </button>
            
            {showParameterDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                background: 'rgba(0, 46, 77, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto'
              }}>
                {dataSources[dataSource].parameters.map((parameter, index) => (
                  <button
                    key={index}
                    onClick={() => addParameter(parameter.key)}
                    disabled={selectedParameters.includes(parameter.key)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      background: selectedParameters.includes(parameter.key) ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                      border: 'none',
                      borderBottom: index < dataSources[dataSource].parameters.length - 1 ? '1px solid rgba(59, 130, 246, 0.1)' : 'none',
                      color: selectedParameters.includes(parameter.key) ? '#94a3b8' : '#e2e8f0',
                      fontSize: '13px',
                      cursor: selectedParameters.includes(parameter.key) ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {parameter.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedParameters.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>Selected Parameters:</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {selectedParameters.map((parameterKey, index) => {
                  const parameter = dataSources[dataSource].parameters.find(p => p.key === parameterKey);
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        fontSize: '12px',
                        color: '#e2e8f0'
                      }}
                    >
                      <span style={{ flex: 1, marginRight: '8px' }}>{parameter ? parameter.label : parameterKey}</span>
                      <button
                        onClick={() => removeParameter(parameterKey)}
                        style={{
                          padding: '4px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '4px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <X style={{ width: '12px', height: '12px' }} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto', paddingTop: '20px' }}>
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
              transition: 'all 0.3s ease'
            }}
          >
            <Zap style={{ width: '16px', height: '16px' }} />
            Apply Filters
          </button>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={handleExportData}
              disabled={!user}
              style={{
                width: '100%',
                padding: '16px',
                background: user 
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, rgba(107, 114, 128, 0.6) 0%, rgba(75, 85, 99, 0.6) 100%)',
                border: 'none',
                borderRadius: '16px',
                color: user ? 'white' : '#9ca3af',
                fontSize: '14px',
                fontWeight: '600',
                cursor: user ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: user 
                  ? '0 8px 32px rgba(16, 185, 129, 0.4)' 
                  : '0 4px 16px rgba(107, 114, 128, 0.2)',
                transition: 'all 0.3s ease',
                opacity: user ? 1 : 0.7
              }}
              onMouseEnter={(e) => {
                if (!user) {
                  setShowLoginWarning(true);
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 24px rgba(107, 114, 128, 0.4)';
                } else {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(16, 185, 129, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!user) {
                  setShowLoginWarning(false);
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 16px rgba(107, 114, 128, 0.2)';
                } else {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 32px rgba(16, 185, 129, 0.4)';
                }
              }}
            >
              {user ? <Download style={{ width: '16px', height: '16px' }} /> : <Lock style={{ width: '16px', height: '16px' }} />}
              {user ? 'Export Dataset' : 'Export Dataset'}
            </button>
            
            {/* Login Warning Tooltip */}
            {showLoginWarning && !user && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginBottom: '12px',
                padding: '10px 14px',
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(220, 38, 38, 1) 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                zIndex: 1001,
                animation: 'fadeIn 0.2s ease-out'
              }}>
                ⚠️ Please login to export data
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '6px solid rgba(239, 68, 68, 0.95)'
                }}></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}