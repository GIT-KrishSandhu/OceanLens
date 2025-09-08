import { useState } from "react"
import { Navigation } from "../components/Navigation.jsx"
import { Sidebar } from "../components/Sidebar.jsx"
import { MapView } from "../components/MapView.jsx"
import { DataCards } from "../components/DataCards.jsx"
import { ChatAssistant } from "../components/ChatAssistant.jsx"
import { Filter, MessageCircle } from "lucide-react"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)
  const [mapFullscreen, setMapFullscreen] = useState(false)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top left, #000a1a 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, #001133 0%, transparent 50%),
        radial-gradient(ellipse at center, #001a4d 0%, transparent 70%),
        linear-gradient(135deg, #001f4d 0%, #002966 25%, #003380 50%, #003d99 75%, #0047b3 100%)
      `,
      position: 'relative',
      boxShadow: 'inset 0 0 200px rgba(0, 31, 77, 0.3)'
    }}>
      {/* Dark Professional Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse 800px 600px at 20% 80%, rgba(0, 71, 179, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse 600px 800px at 80% 20%, rgba(0, 61, 153, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse 1000px 400px at 50% 50%, rgba(0, 51, 128, 0.1) 0%, transparent 70%),
          radial-gradient(ellipse 400px 1000px at 70% 30%, rgba(0, 41, 102, 0.08) 0%, transparent 80%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(1px)'
      }}></div>

      <Navigation />

      <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
        {/* Left Sidebar - Filters */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Left Toggle Button - Show Filters (when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="professional-button gradient-level-4"
            style={{
              position: 'fixed',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              padding: '12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-heavy)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) translateX(5px)';
              e.target.style.boxShadow = 'var(--shadow-heavy), 0 0 20px rgba(102, 163, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) translateX(0)';
              e.target.style.boxShadow = 'var(--shadow-heavy)';
            }}
          >
            <Filter style={{ width: '20px', height: '20px' }} />
          </button>
        )}

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            marginLeft: sidebarOpen ? '320px' : '0',
            marginRight: chatOpen ? '400px' : '0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Top Section - Map (Level 2) */}
          <div className="gradient-level-2" style={{
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            overflow: 'hidden',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <MapView onFullscreenToggle={() => setMapFullscreen(!mapFullscreen)} />
          </div>

          {/* Bottom Section - Attribute Cards (Level 3) */}
          {!mapFullscreen && (
            <div className="gradient-level-3" style={{
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '24px',
              position: 'relative',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <DataCards />
            </div>
          )}
        </main>

        {/* Right Sidebar - Chatbot */}
        <ChatAssistant isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />

        {/* Right Toggle Button - Show Chat (when chatbot is closed) */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="professional-button gradient-level-4"
            style={{
              position: 'fixed',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 1000,
              padding: '12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-heavy)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-50%) translateX(-5px)';
              e.target.style.boxShadow = 'var(--shadow-heavy), 0 0 20px rgba(102, 163, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(-50%) translateX(0)';
              e.target.style.boxShadow = 'var(--shadow-heavy)';
            }}
          >
            <MessageCircle style={{ width: '20px', height: '20px' }} />
          </button>
        )}
      </div>

      {/* Fullscreen Map Overlay */}
      {mapFullscreen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          background: `
            radial-gradient(ellipse at top left, #000a1a 0%, transparent 50%),
            radial-gradient(ellipse at bottom right, #001133 0%, transparent 50%),
            radial-gradient(ellipse at center, #001a4d 0%, transparent 70%),
            linear-gradient(135deg, #001f4d 0%, #002966 25%, #003380 50%, #003d99 75%, #0047b3 100%)
          `,
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Fullscreen Navigation */}
          <div className="gradient-level-1" style={{
            padding: '12px 24px',
            backdropFilter: 'blur(20px)',
            borderBottom: '2px solid var(--blue-70)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              color: 'var(--blue-15)',
              margin: 0,
              textShadow: '0 0 20px rgba(102, 163, 255, 0.5)'
            }}>Ocean Map - Fullscreen View</h1>
            <button
              onClick={() => setMapFullscreen(false)}
              className="professional-button gradient-level-4"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              <span>Exit Fullscreen</span>
            </button>
          </div>

          {/* Fullscreen Content */}
          <div style={{ 
            flex: 1, 
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Fullscreen Map - Takes 70% of space */}
            <div className="gradient-level-2" style={{
              height: '70%',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <MapView onFullscreenToggle={() => setMapFullscreen(false)} isFullscreen={true} />
            </div>

            {/* Fullscreen Data Cards - Takes 30% of space */}
            <div className="gradient-level-3" style={{
              height: '30%',
              backdropFilter: 'blur(20px)',
              borderRadius: '24px',
              padding: '24px',
              position: 'relative',
              overflow: 'auto'
            }}>
              <DataCards />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
