import { useState } from "react"
import { Navigation } from "../components/Navigation.jsx"
import { Sidebar } from "../components/Sidebar.jsx"
import { MapView } from "../components/MapView.jsx"
import { DataCards } from "../components/DataCards.jsx"
import { ChatAssistant } from "../components/ChatAssistant.jsx"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chatOpen, setChatOpen] = useState(true)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `
        radial-gradient(ellipse at top left, rgba(0, 46, 77, 0.8) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(0, 61, 102, 0.6) 0%, transparent 50%),
        radial-gradient(ellipse at center, rgba(0, 77, 128, 0.4) 0%, transparent 70%),
        linear-gradient(135deg, #002e4d 0%, #003d66 30%, #004d80 60%, #005c99 100%)
      `,
      position: 'relative',
      boxShadow: 'inset 0 0 200px rgba(0, 46, 77, 0.1)'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(ellipse 800px 600px at 20% 80%, rgba(128, 204, 255, 0.15) 0%, transparent 60%),
          radial-gradient(ellipse 600px 800px at 80% 20%, rgba(102, 194, 255, 0.12) 0%, transparent 60%),
          radial-gradient(ellipse 1000px 400px at 50% 50%, rgba(77, 184, 255, 0.1) 0%, transparent 70%),
          radial-gradient(ellipse 400px 1000px at 70% 30%, rgba(51, 173, 255, 0.08) 0%, transparent 80%)
        `,
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'blur(1px)'
      }}></div>

      <Navigation />

      <div style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
        {/* Left Sidebar - Filters */}
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content Area */}
        <main
          style={{
            flex: 1,
            transition: 'all 0.3s ease',
            marginLeft: sidebarOpen ? '320px' : '0',
            marginRight: chatOpen ? '400px' : '0',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          {/* Top Section - Map */}
          <div style={{
            background: 'rgba(128, 204, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(102, 194, 255, 0.3)',
            boxShadow: '0 20px 40px rgba(128, 204, 255, 0.4)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <MapView />
          </div>

          {/* Bottom Section - Attribute Cards */}
          <div style={{
            background: 'rgba(102, 194, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(77, 184, 255, 0.3)',
            boxShadow: '0 20px 40px rgba(102, 194, 255, 0.4)',
            padding: '24px',
            position: 'relative'
          }}>
            <DataCards />
          </div>
        </main>

        {/* Right Sidebar - Chatbot */}
        <ChatAssistant isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      </div>
    </div>
  )
}
