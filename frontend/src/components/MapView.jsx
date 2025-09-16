import { useState, useEffect } from "react"
import { MapPin, Globe, Maximize2, Thermometer, Droplets, Activity, RefreshCw } from "lucide-react"
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
  const indiaCenter = [15.0, 75.0]
  const indiaZoom = 5.2

  // Define Indian Ocean region
  const indianOceanBounds = [
    [-30, 40],
    [-30, 100], 
    [35, 100],
    [35, 40],
  ]

  // Ocean parameters
  const oceanParameters = {
    temperature: {
      name: "Temperature",
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
      name: "Oxygen",
      unit: "mg/L",
      icon: Activity,
      color: "#96CEB4",
      range: [2, 8]
    }
  }

  // Generate simulated ARGO float data - ocean only
  const generateArgoFloats = () => {
    const floats = []
    const numFloats = 120 // Increased from 50 to 120 for better ocean coverage
    
    const statusTypes = ['active', 'inactive', 'recent']
    const floatTypes = ['APEX', 'NOVA', 'ARVOR', 'PROVOR', 'SOLO']
    
    // Define ocean regions to avoid land - PRECISE ocean coordinates only
    const oceanRegions = [
      // Arabian Sea (west of India) - carefully avoiding land
      { latMin: 8, latMax: 22, lngMin: 58, lngMax: 72 },
      // Bay of Bengal (east of India) - carefully avoiding land  
      { latMin: 8, latMax: 22, lngMin: 82, lngMax: 95 },
      // Indian Ocean south of India - open ocean only
      { latMin: -12, latMax: 3, lngMin: 65, lngMax: 95 },
      // Western Indian Ocean - open ocean
      { latMin: -25, latMax: 3, lngMin: 45, lngMax: 58 },
      // Eastern Indian Ocean - open ocean
      { latMin: -25, latMax: 3, lngMin: 95, lngMax: 110 },
      // Southern Indian Ocean - far from land
      { latMin: -35, latMax: -15, lngMin: 60, lngMax: 100 },
      // Open ocean areas only
      { latMin: -20, latMax: -5, lngMin: 70, lngMax: 90 },
      { latMin: -10, latMax: 5, lngMin: 50, lngMax: 65 },
      { latMin: -10, latMax: 5, lngMin: 100, lngMax: 115 }
    ]
    
    for (let i = 0; i < numFloats; i++) {
      // Select a random ocean region
      const region = oceanRegions[Math.floor(Math.random() * oceanRegions.length)]
      
      // Generate coordinates within the selected ocean region
      const lat = region.latMin + Math.random() * (region.latMax - region.latMin)
      const lng = region.lngMin + Math.random() * (region.lngMax - region.lngMin)
      
      const status = statusTypes[Math.floor(Math.random() * statusTypes.length)]
      const floatType = floatTypes[Math.floor(Math.random() * floatTypes.length)]
      const wmoid = 1900000 + Math.floor(Math.random() * 99999)
      
      const temperature = oceanParameters.temperature.range[0] + 
        Math.random() * (oceanParameters.temperature.range[1] - oceanParameters.temperature.range[0])
      const salinity = oceanParameters.salinity.range[0] + 
        Math.random() * (oceanParameters.salinity.range[1] - oceanParameters.salinity.range[0])
      const oxygen = oceanParameters.oxygen.range[0] + 
        Math.random() * (oceanParameters.oxygen.range[1] - oceanParameters.oxygen.range[0])
      
      floats.push({
        id: wmoid,
        lat,
        lng,
        wmoid,
        status,
        floatType,
        measurements: {
          temperature: parseFloat(temperature.toFixed(2)),
          salinity: parseFloat(salinity.toFixed(2)),
          oxygen: parseFloat(oxygen.toFixed(2))
        }
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
    }, 1000)
  }, [])

  // Get ARGO float color based on status
  const getFloatColor = (float) => {
    switch (float.status) {
      case 'active':
        return '#06b6d4'
      case 'recent':
        return '#3b82f6'
      case 'inactive':
        return '#64748b'
      default:
        return '#6b7280'
    }
  }

  return (
    <div style={{ 
      padding: isFullscreen ? '20px' : '16px', 
      height: '100%', 
      background: isFullscreen ? '#f8fafc' : 'transparent' 
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '20px' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#3b82f6',
            color: 'white'
          }}>
            <Globe style={{ width: '24px', height: '24px' }} />
          </div>
          <h2 style={{
            fontSize: isFullscreen ? '28px' : '20px',
            fontWeight: '600',
            color: '#1e293b',
            margin: 0
          }}>
            Ocean Trajectories
          </h2>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => {
                setArgoFloats(generateArgoFloats())
                setIsLoading(false)
              }, 1000)
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '8px',
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              color: '#475569',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
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
              padding: '10px 16px',
              borderRadius: '8px',
              background: '#3b82f6',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <Maximize2 style={{ width: '16px', height: '16px' }} />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div style={{
        position: 'relative',
        height: isFullscreen ? 'calc(100vh - 200px)' : '500px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#f8fafc',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Loading Overlay */}
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(248, 250, 252, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            borderRadius: '12px'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #e2e8f0',
                borderTop: '3px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <p style={{ color: '#475569', fontSize: '14px', fontWeight: '500' }}>
                Loading ARGO floats...
              </p>
            </div>
          </div>
        )}

        <MapContainer
          center={indiaCenter}
          zoom={indiaZoom}
          style={{ height: "100%", width: "100%", borderRadius: "12px" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Indian Ocean Region */}
          <Polygon
            positions={indianOceanBounds}
            pathOptions={{ 
              color: "#3b82f6", 
              weight: 2, 
              fillColor: "rgba(59, 130, 246, 0.1)", 
              fillOpacity: 0.3
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
                  minWidth: '200px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  color: '#1e293b',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: getFloatColor(float),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <MapPin style={{ width: '10px', height: '10px', color: '#ffffff' }} />
                    </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '14px', 
                        fontWeight: '600', 
                        margin: 0,
                        color: '#1e293b'
                      }}>
                        ARGO {float.wmoid.toString().slice(-4)}
                      </h3>
                      <p style={{ 
                        fontSize: '12px', 
                        margin: '2px 0 0 0',
                        color: '#64748b'
                      }}>
                        {float.floatType} • {float.status.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '8px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Location</span>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>
                        {float.lat.toFixed(2)}°, {float.lng.toFixed(2)}°
                      </span>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>Type</span>
                      <span style={{ fontWeight: '500', color: '#1e293b' }}>
                        {float.floatType}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '8px' }}>
                    <h4 style={{ 
                      fontSize: '12px', 
                      fontWeight: '600', 
                      margin: '0 0 6px 0',
                      color: '#374151'
                    }}>
                      Measurements
                    </h4>
                    <div style={{ 
                      display: 'flex', 
                      gap: '8px'
                    }}>
                      {Object.entries(oceanParameters).map(([key, param]) => {
                        const IconComponent = param.icon
                        const value = float.measurements[key]
                        
                        return (
                          <div
                            key={key}
                            style={{
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '6px 8px',
                              textAlign: 'center',
                              flex: 1
                            }}
                          >
                            <IconComponent style={{ 
                              width: '12px', 
                              height: '12px', 
                              color: param.color,
                              marginBottom: '4px'
                            }} />
                            <div style={{ 
                              fontSize: '12px', 
                              fontWeight: '600',
                              color: param.color,
                              lineHeight: '1'
                            }}>
                              {value}
                            </div>
                            <div style={{ 
                              fontSize: '10px', 
                              color: '#64748b',
                              lineHeight: '1'
                            }}>
                              {param.unit}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* ARGO Float Legend */}
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          background: '#ffffff',
          borderRadius: '8px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minWidth: '180px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MapPin style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
            <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '14px' }}>
              Float Status
            </span>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            {[
              { status: 'active', label: 'Active', color: '#06b6d4' },
              { status: 'recent', label: 'Recent', color: '#3b82f6' },
              { status: 'inactive', label: 'Inactive', color: '#64748b' }
            ].map((item) => (
              <div key={item.status} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                marginBottom: '6px' 
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: item.color
                }}></div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '12px', color: '#64748b' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Total:</span>
              <span style={{ fontWeight: '600' }}>{argoFloats.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Active:</span>
              <span style={{ fontWeight: '600', color: '#06b6d4' }}>
                {argoFloats.filter(f => f.status === 'active').length}
              </span>
            </div>
          </div>
        </div>

        {/* Parameter Selection */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          display: 'flex',
          gap: '8px'
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
                  background: isActive ? '#f0f9ff' : '#ffffff',
                  border: isActive ? `2px solid ${param.color}` : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  cursor: 'pointer',
                  minWidth: '120px',
                  boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => setSelectedParameter(key)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <IconComponent style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: param.color 
                  }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#1e293b' 
                  }}>
                    {param.name}
                  </span>
                </div>
                <div style={{ 
                  fontSize: '16px', 
                  fontWeight: '700', 
                  color: param.color
                }}>
                  {avgValue.toFixed(1)} {param.unit}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Simple CSS for loading animation */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
