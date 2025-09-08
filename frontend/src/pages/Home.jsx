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
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      position: 'relative'
    }}>
      {/* Background Effects */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
        `,
        pointerEvents: 'none',
        zIndex: 0
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
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <MapView />
          </div>

          {/* Bottom Section - Attribute Cards */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
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
