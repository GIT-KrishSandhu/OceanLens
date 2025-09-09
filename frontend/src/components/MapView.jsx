"use client"

import { useState } from "react"
import { MapPin, Globe, Layers, Maximize2 } from "lucide-react"
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"

export function MapView({ onFullscreenToggle, isFullscreen = false }) {
  const [viewMode, setViewMode] = useState("trajectories")

  const handleFullscreenToggle = () => {
    if (onFullscreenToggle) {
      onFullscreenToggle()
    }
  }

  // Focus Indian Ocean
  const indiaCenter = [10.0, 78.0] // center near Indian Ocean
  const indiaZoom = 4.5

  // Define Indian Ocean bounding polygon (rough extent)
  const indianOceanBounds = [
    [-60, 20],  // bottom-left
    [-60, 120], // bottom-right
    [30, 120],  // top-right
    [30, 20],   // top-left
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

  return (
    <div style={{ padding: '24px', height: '100%' }}>
      {/* Header */}
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
            <p style={{ fontSize: '14px', color: 'var(--blue-20)', margin: '4px 0 0 0' }}>
              Real-time Argo float monitoring & data collection
            </p>
          </div>
        </div>

        {/* Buttons */}
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
          >
            <Maximize2 style={{ width: '18px', height: '18px' }} />
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="gradient-level-3" style={{
        position: 'relative',
        height: '500px',
        borderRadius: '20px',
        overflow: 'hidden'
      }}>
        <MapContainer
          center={indiaCenter}
          zoom={indiaZoom}
          style={{ height: "100%", width: "100%", borderRadius: "20px", zIndex: 1 }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Highlight Indian Ocean */}
          <Polygon
            positions={indianOceanBounds}
            pathOptions={{ color: "blue", weight: 2, fillColor: "lightblue", fillOpacity: 0.2 }}
          >
            <Tooltip sticky>Indian Ocean</Tooltip>
          </Polygon>

          {/* Labels for surrounding regions */}
          {regionLabels.map((region, i) => (
            <Tooltip
              key={i}
              permanent
              direction="center"
              offset={[0, 0]}
              opacity={0.8}
              position={region.coords}
            >
              <span style={{ fontWeight: "bold", color: "darkred", background: "white", padding: "2px 4px", borderRadius: "4px" }}>
                {region.name}
              </span>
            </Tooltip>
          ))}
        </MapContainer>

        {/* Floating controls, legend, last update (kept as in your version) */}
      </div>
    </div>
  )
}
