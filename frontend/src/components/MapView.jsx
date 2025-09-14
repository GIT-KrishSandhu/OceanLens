import { useState, useEffect } from "react"
import { MapPin, Globe, Maximize2, Thermometer, Droplets, Activity, Zap, TrendingUp, Eye, Download, RefreshCw } from "lucide-react"
import { MapContainer, TileLayer, Polygon, Tooltip, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export function MapView({ onFullscreenToggle, isFullscreen = false }) {
  const [argoFloats, setArgoFloats] = useState([])
  const [selectedParameter, setSelectedParameter] = useState("temperature")
  const [isLoading, setIsLoading] = useState(false)

  const handleFullscreenToggle = () => {
    if (onFullscreenToggle) {
      onFullscreenToggle()
    }
  }

  // Focus on India and surrounding Indian Ocean
  const indiaCenter = [15.0, 75.0] // Centered more on India
  const indiaZoom = 5.2 // Closer zoom for India focus

  // Define Indian Ocean region focused around India
  const indianOceanBounds = [
    [-30, 40],  // bottom-left (closer to India)
    [-30, 100], // bottom-right 
    [35, 100],  // top-right
    [35, 40],   // top-left
  ]

  // Labels for surrounding regions
  const regionLabels = [
    { name: "India", coords: [22, 78] },
    { name: "Arabian Peninsula", coords: [20, 55] },
    { name: "East Africa", coords: [-10, 40] },
    { name: "Australia", coords: [-25, 115] },
    { name: "Southeast Asia", coords: [5, 100] },
    { name: "Madagascar", coords: [-20, 47] }
  ]

  // Ocean parameters for heat map
  const oceanParameters = {
    temperature: {
      name: "Sea Surface Temperature",
      unit: "°C",
      icon: Thermometer,
      color: "#FF6B6B",
      range: [15, 35]
    },
    salinity: {
      name: "Salinity",
      unit: "PSU", 
      icon: Droplets,
      color: "#4ECDC4",
      range: [30, 40]
    },
    oxygen: {
      name: "Dissolved Oxygen",
      unit: "mg/L",
      icon: Activity,
      color: "#96CEB4",
      range: [2, 8]
    }
  }

  // Generate simulated ARGO float data focused on India region
  const generateArgoFloats = () => {
    const floats = []
    const numFloats = 150 // More floats for better coverage around India
    
    // ARGO float status types
    const statusTypes = ['active', 'inactive', 'recent', 'maintenance']
    const floatTypes = ['APEX', 'NOVA', 'ARVOR', 'PROVOR', 'SOLO']
    
    for (let i = 0; i < numFloats; i++) {
      // Focus more floats around India and nearby waters
      let lat, lng
      if (Math.random() < 0.7) {
        // 70% of floats concentrated around India
        lat = 5 + Math.random() * 25 // 5°N to 30°N (India region)
        lng = 65 + Math.random() * 25 // 65°E to 90°E (India region)
      } else {
        // 30% spread in wider Indian Ocean
        lat = -25 + Math.random() * 50 // Wider Indian Ocean
        lng = 45 + Math.random() * 50
      }
      
      // Generate realistic ARGO float data
      const status = statusTypes[Math.floor(Math.random() * statusTypes.length)]
      const floatType = floatTypes[Math.floor(Math.random() * floatTypes.length)]
      const wmoid = 1900000 + Math.floor(Math.random() * 99999) // Realistic WMO ID
      const cycleNumber = Math.floor(Math.random() * 300) + 1
      const daysSinceLastProfile = Math.floor(Math.random() * 30)
      
      // Generate measurements for each parameter
      const temperature = oceanParameters.temperature.range[0] + 
        Math.random() * (oceanParameters.temperature.range[1] - oceanParameters.temperature.range[0])
      const salinity = oceanParameters.salinity.range[0] + 
        Math.random() * (oceanParameters.salinity.range[1] - oceanParameters.salinity.range[0])
      const oxygen = oceanParameters.oxygen.range[0] + 
        Math.random() * (oceanParameters.oxygen.range[1] - oceanParameters.oxygen.range[0])
      
      const maxDepth = 1500 + Math.random() * 500 // 1500-2000m typical ARGO depth
      const batteryLevel = status === 'active' ? 70 + Math.random() * 30 : 20 + Math.random() * 50
      
      floats.push({
        id: wmoid,
        lat,
        lng,
        wmoid,
        status,
        floatType,
        cycleNumber,
        daysSinceLastProfile,
        maxDepth: Math.round(maxDepth),
        batteryLevel: Math.round(batteryLevel),
        measurements: {
          temperature: parseFloat(temperature.toFixed(2)),
          salinity: parseFloat(salinity.toFixed(2)),
          oxygen: parseFloat(oxygen.toFixed(2))
        },
        lastProfileDate: new Date(Date.now() - daysSinceLastProfile * 86400000).toISOString(),
        deploymentDate: new Date(Date.now() - (cycleNumber * 10 + Math.random() * 365) * 86400000).toISOString(),
        country: ['USA', 'France', 'Australia', 'India', 'Japan', 'UK'][Math.floor(Math.random() * 6)],
        institution: ['NOAA', 'Ifremer', 'CSIRO', 'INCOIS', 'JAMSTEC', 'Met Office'][Math.floor(Math.random() * 6)]
      })
    }
    
    return floats
  }

  // Load ARGO float data
  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => {
      setArgoFloats(generateArgoFloats())
      setIsLoading(false)
    }, 1500)
  }, [])

  // Get ARGO float color based on status - using site theme colors
  const getFloatColor = (float) => {
    switch (float.status) {
      case 'active':
        return '#06b6d4' // Cyan - matches site theme
      case 'recent':
        return '#3b82f6' // Blue - matches site theme
      case 'inactive':
        return '#64748b' // Slate gray - subtle
      case 'maintenance':
        return '#8b5cf6' // Purple - matches site accent
      default:
        return '#6b7280' // Gray for unknown
    }
  }

  // Get float status description
  const getStatusDescription = (status) => {
    switch (status) {
      case 'active':
        return 'Active - Transmitting data'
      case 'recent':
        return 'Recently active'
      case 'inactive':
        return 'Inactive - No recent data'
      case 'maintenance':
        return 'Under maintenance'
      default:
        return 'Unknown status'
    }
  }

  // Get parameter value from float measurements
  const getParameterValue = (float) => {
    return float.measurements[selectedParameter]
  }

  return (
    <div style={{ padding: isFullscreen ? '40px' : '24px', height: '100%', background: isFullscreen ? 'linear-gradient(135deg, rgba(0, 31, 77, 0.95) 0%, rgba(0, 41, 102, 0.95) 100%)' : 'transparent' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            padding: '16px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
            border: '2px solid rgba(59, 130, 246, 0.8)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.6)'
          }}>
            <Globe style={{ width: '28px', height: '28px', color: '#ffffff', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' }} />
          </div>
          <div>
            <h2 style={{
              fontSize: isFullscreen ? '32px' : '24px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: 0,
              textShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
              letterSpacing: '-0.02em'
            }}>Ocean Trajectories</h2>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
                setIsLoading(true)
                setTimeout(() => {
                  setArgoFloats(generateArgoFloats())
                  setIsLoading(false)
                }, 1500)
              }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
                padding: '12px 16px',
              borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                color: '#06b6d4',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(6, 182, 212, 0.3)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(6, 182, 212, 0.2)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px' }} />
              <span>Refresh</span>
          </button>

          <button
            onClick={handleFullscreenToggle}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              borderRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                border: 'none',
                color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)'
                e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.6)'
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)'
                e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)'
            }}
          >
            <Maximize2 style={{ width: '18px', height: '18px' }} />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
          </div>
        </div>
      </div>

      {/* Heat Map Visualization */}
      <div style={{
        position: 'relative',
        height: isFullscreen ? 'calc(100vh - 200px)' : '600px',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(0, 46, 77, 0.9) 0%, rgba(0, 26, 77, 0.8) 100%)',
        border: '2px solid rgba(59, 130, 246, 0.3)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 46, 77, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '24px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(59, 130, 246, 0.3)',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#cbd5e1', fontSize: '16px', fontWeight: '500' }}>
                Loading ARGO floats...
              </p>
            </div>
          </div>
        )}

        <MapContainer
          center={indiaCenter}
          zoom={indiaZoom}
          style={{ height: "100%", width: "100%", borderRadius: "24px", zIndex: 1 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Highlight Indian Ocean */}
          <Polygon
            positions={indianOceanBounds}
            pathOptions={{ 
              color: "#3b82f6", 
              weight: 3, 
              fillColor: "rgba(59, 130, 246, 0.1)", 
              fillOpacity: 0.3,
              dashArray: "5, 5"
            }}
          >
            <Tooltip sticky>Indian Ocean Region</Tooltip>
          </Polygon>

          {/* ARGO Float Markers */}
          {argoFloats.map((float) => (
            <CircleMarker
              key={float.id}
              center={[float.lat, float.lng]}
              radius={float.status === 'active' ? 8 : 6}
              pathOptions={{
                fillColor: getFloatColor(float),
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
              }}
            >
              <Tooltip>
                <div style={{ 
                  padding: '12px', 
                  minWidth: '240px',
                  maxWidth: '280px',
                  background: 'linear-gradient(135deg, rgba(0, 46, 77, 0.95) 0%, rgba(0, 26, 77, 0.95) 100%)',
                  borderRadius: '12px',
                  border: `1px solid ${getFloatColor(float)}`,
                  color: '#ffffff',
                  backdropFilter: 'blur(10px)',
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px ${getFloatColor(float)}40`
                }}>
                  {/* Compact Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '12px',
                    paddingBottom: '8px',
                    borderBottom: `1px solid ${getFloatColor(float)}30`
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: getFloatColor(float),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 0 12px ${getFloatColor(float)}60`
                    }}>
                      <MapPin style={{ width: '12px', height: '12px', color: '#ffffff' }} />
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '700', 
                        margin: 0,
                        color: '#ffffff'
                      }}>
                        ARGO {float.wmoid.toString().slice(-4)}
                      </h3>
                      <p style={{ 
                        fontSize: '10px', 
                        margin: '1px 0 0 0',
                        color: getFloatColor(float)
                      }}>
                        {float.floatType} • {float.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Compact Info Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px',
                    marginBottom: '10px',
                    fontSize: '11px'
                  }}>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>Location</span>
                      <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                        {float.lat.toFixed(2)}°, {float.lng.toFixed(2)}°
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>Depth</span>
                      <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                        {float.maxDepth}m
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>Cycle</span>
                      <span style={{ fontWeight: '600', color: '#e2e8f0' }}>
                        #{float.cycleNumber}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#94a3b8', display: 'block', fontSize: '9px' }}>Battery</span>
                      <span style={{ 
                        fontWeight: '600',
                        color: float.batteryLevel > 50 ? '#06b6d4' : float.batteryLevel > 25 ? '#8b5cf6' : '#64748b'
                      }}>
                        {float.batteryLevel}%
                      </span>
                    </div>
                  </div>

                  {/* Compact Measurements */}
                  <div style={{ marginBottom: '10px' }}>
                    <h4 style={{ 
                      fontSize: '11px', 
                      fontWeight: '600', 
                      margin: '0 0 6px 0',
                      color: '#cbd5e1'
                    }}>
                      Current Data
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      gap: '6px'
                    }}>
                      {Object.entries(oceanParameters).map(([key, param]) => {
                        const IconComponent = param.icon
                        const value = float.measurements[key]
                        const isSelected = selectedParameter === key
                        
                        return (
                          <div
                            key={key}
                            style={{
                              background: isSelected ? `${param.color}25` : 'rgba(0, 0, 0, 0.3)',
                              border: isSelected ? `1px solid ${param.color}` : '1px solid rgba(255, 255, 255, 0.1)',
                              borderRadius: '6px',
                              padding: '4px 6px',
                              textAlign: 'center',
                              flex: 1
                            }}
                          >
                            <IconComponent style={{ 
                              width: '10px', 
                              height: '10px', 
                              color: param.color,
                              marginBottom: '2px'
                            }} />
                            <div style={{ 
                              fontSize: '10px', 
                              fontWeight: '700',
                              color: param.color,
                              lineHeight: '1'
                            }}>
                              {value}
                            </div>
                            <div style={{ 
                              fontSize: '8px', 
                              color: '#94a3b8',
                              lineHeight: '1'
                            }}>
                              {param.unit}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Compact Footer */}
                  <div style={{ 
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    padding: '6px 8px',
                    fontSize: '9px',
                    color: '#94a3b8',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}>
                    <span>{float.country}</span>
                    <span>{float.daysSinceLastProfile}d ago</span>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}

          {/* Labels for surrounding regions */}
          {regionLabels.map((region, i) => (
            <Tooltip
              key={i}
              permanent
              direction="center"
              offset={[0, 0]}
              opacity={0.9}
              position={region.coords}
            >
              <span style={{ 
                fontWeight: "bold", 
                color: "#1e293b", 
                background: "rgba(255, 255, 255, 0.9)", 
                padding: "4px 8px", 
                borderRadius: "8px",
                fontSize: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
              }}>
                {region.name}
              </span>
            </Tooltip>
          ))}
        </MapContainer>

        {/* ARGO Float Legend */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 46, 77, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          minWidth: '200px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin style={{ width: '18px', height: '18px', color: '#3b82f6' }} />
            <span style={{ color: '#e2e8f0', fontWeight: '600', fontSize: '14px' }}>
              ARGO Float Status
            </span>
          </div>
          
          {/* Status Legend */}
          <div style={{ marginBottom: '16px' }}>
            {[
              { status: 'active', label: 'Active', color: '#06b6d4' },
              { status: 'recent', label: 'Recent', color: '#3b82f6' },
              { status: 'maintenance', label: 'Maintenance', color: '#8b5cf6' },
              { status: 'inactive', label: 'Inactive', color: '#64748b' }
            ].map((item) => (
              <div key={item.status} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '6px' 
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: item.color,
                  border: '2px solid #ffffff',
                  boxShadow: `0 0 8px ${item.color}40`
                }}></div>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Float Stats */}
          <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Total Floats:</span>
              <span style={{ fontWeight: '600' }}>{argoFloats.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Active:</span>
              <span style={{ fontWeight: '600', color: '#06b6d4' }}>
                {argoFloats.filter(f => f.status === 'active').length}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Last Update:</span>
              <span style={{ fontWeight: '600' }}>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>

        {/* Parameter Selection Cards */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {Object.entries(oceanParameters).map(([key, param]) => {
            const IconComponent = param.icon
            const isActive = selectedParameter === key
            const avgValue = argoFloats.length > 0 
              ? argoFloats.reduce((sum, float) => sum + float.measurements[key], 0) / argoFloats.length
              : 0
            
            return (
              <div
                key={key}
                style={{
                  background: isActive 
                    ? `linear-gradient(135deg, ${param.color}30 0%, ${param.color}15 100%)`
                    : 'rgba(0, 46, 77, 0.85)',
                  border: isActive 
                    ? `2px solid ${param.color}`
                    : '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  backdropFilter: 'blur(15px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  minWidth: '200px',
                  boxShadow: isActive 
                    ? `0 8px 32px ${param.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
                    : '0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                }}
                onClick={() => setSelectedParameter(key)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(59, 130, 246, 0.2)'
                    e.target.style.borderColor = '#3b82f6'
                    e.target.style.transform = 'translateY(-2px)'
                    e.target.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.3)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(0, 46, 77, 0.85)'
                    e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                    e.target.style.transform = 'translateY(0)'
                    e.target.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2)'
                  }
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <div style={{
                    padding: '8px',
                    borderRadius: '8px',
                    background: isActive ? param.color : `${param.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComponent style={{ 
                      width: '16px', 
                      height: '16px', 
                      color: isActive ? 'white' : param.color 
                    }} />
                  </div>
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: isActive ? '#ffffff' : '#e2e8f0' 
                  }}>
                    {param.name}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: '700', 
                  color: param.color,
                  marginBottom: '4px'
                }}>
                  {avgValue.toFixed(1)} {param.unit}
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#94a3b8',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Range: {param.range[0]}-{param.range[1]} {param.unit}</span>
                  {isActive && (
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: param.color,
                      boxShadow: `0 0 8px ${param.color}`
                    }}></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
