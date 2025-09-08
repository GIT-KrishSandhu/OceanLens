"use client"

import { useState } from "react"
import { MessageCircle, Send, X, Bot, User, BarChart3, Download, RefreshCw, Zap, Lock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export function ChatAssistant({ isOpen, onToggle }) {
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Show me salinity profiles near equator in 2019",
      sender: "user",
      timestamp: "2:34 PM",
      hasGraph: false
    },
    {
      id: 2,
      text: "Here are the salinity profiles near the equator in 2019",
      sender: "bot",
      timestamp: "2:35 PM",
      hasGraph: true
    }
  ])
  const [inputText, setInputText] = useState("")

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasGraph: false
      }
      setMessages([...messages, newMessage])
      setInputText("")
      
      // Simulate bot response with graph
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "I understand you're interested in " + inputText + ". Let me analyze the data and provide you with relevant insights.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          hasGraph: true
        }
        setMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  const handleDownload = () => {
    if (!user) {
      alert('Please login to download data');
      return;
    }
    console.log('Downloading chat data...');
    // Here you would implement actual download functionality
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      right: 0,
      top: '80px',
      height: 'calc(100vh - 80px)',
      width: '400px',
      background: 'rgba(128, 204, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderLeft: '1px solid rgba(102, 194, 255, 0.3)',
      boxShadow: '-20px 0 40px rgba(128, 204, 255, 0.4)',
      zIndex: 40,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ 
              padding: '10px', 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
              borderRadius: '12px',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
            }}>
              <Bot style={{ width: '20px', height: '20px', color: '#60a5fa' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>FloatChat Assistant</h3>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>AI-powered ocean analytics</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            style={{
              padding: '8px',
              color: '#94a3b8',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
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
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{ display: 'flex', justifyContent: message.sender === "user" ? "flex-end" : "flex-start" }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '16px',
                borderRadius: '16px',
                background: message.sender === "user"
                  ? 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)'
                  : 'rgba(0, 46, 77, 0.8)',
                color: message.sender === "user" ? 'white' : '#e2e8f0',
                border: message.sender === "user" 
                  ? 'none' 
                  : '1px solid rgba(59, 130, 246, 0.3)',
                boxShadow: message.sender === "user"
                  ? '0 8px 32px rgba(59, 130, 246, 0.4)'
                  : '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                {message.sender === "bot" && (
                  <Bot style={{ width: '16px', height: '16px', color: '#60a5fa', marginTop: '2px' }} />
                )}
                {message.sender === "user" && (
                  <User style={{ width: '16px', height: '16px', color: 'white', marginTop: '2px' }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.5' }}>{message.text}</p>
                  <p style={{ fontSize: '11px', opacity: 0.7, margin: '8px 0 0 0' }}>{message.timestamp}</p>
                  
                  {/* Static Graph Display */}
                  {message.hasGraph && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{
                        background: 'rgba(0, 46, 77, 0.6)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                        marginBottom: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                          <BarChart3 style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                          <span style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>Salinity Profile Analysis</span>
                        </div>
                        
                        {/* Mini Chart */}
                        <div style={{ height: '120px', position: 'relative', marginBottom: '12px' }}>
                          {/* Y-axis */}
                          <div style={{ 
                            position: 'absolute', 
                            left: 0, 
                            top: 0, 
                            bottom: 0, 
                            width: '30px', 
                            display: 'flex', 
                            flexDirection: 'column', 
                            justifyContent: 'space-between',
                            fontSize: '10px',
                            color: '#94a3b8'
                          }}>
                            <span>0</span>
                            <span>50</span>
                            <span>100</span>
                            <span>150</span>
                            <span>200</span>
                          </div>
                          
                          {/* Chart Area */}
                          <div style={{ 
                            marginLeft: '35px', 
                            height: '100%', 
                            position: 'relative',
                            background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
                            borderRadius: '8px'
                          }}>
                            {/* Data Line */}
                            <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
                              <path
                                d="M 0,80 Q 20,60 40,70 T 80,50 T 120,40 T 160,45 T 200,35"
                                stroke="#60a5fa"
                                strokeWidth="2"
                                fill="none"
                                style={{ filter: 'drop-shadow(0 0 4px rgba(96, 165, 250, 0.6))' }}
                              />
                              <path
                                d="M 0,90 Q 20,75 40,80 T 80,65 T 120,55 T 160,60 T 200,50"
                                stroke="#06b6d4"
                                strokeWidth="2"
                                fill="none"
                                style={{ filter: 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.6))' }}
                              />
                            </svg>
                            
                            {/* Data Points */}
                            {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((x, i) => (
                              <div
                                key={i}
                                style={{
                                  position: 'absolute',
                                  left: `${x}px`,
                                  top: `${60 + Math.sin(i * 0.5) * 20}px`,
                                  width: '4px',
                                  height: '4px',
                                  background: '#60a5fa',
                                  borderRadius: '50%',
                                  boxShadow: '0 0 6px rgba(96, 165, 250, 0.8)'
                                }}
                              />
                            ))}
                          </div>
                        </div>
                        
                        {/* X-axis Label */}
                        <div style={{ 
                          textAlign: 'center', 
                          fontSize: '10px', 
                          color: '#94a3b8',
                          marginTop: '8px'
                        }}>
                          Salinity (g/kg)
                        </div>
                        
                        {/* Legend */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '2px', background: '#60a5fa', borderRadius: '1px' }}></div>
                            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Profile 1</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{ width: '8px', height: '2px', background: '#06b6d4', borderRadius: '1px' }}></div>
                            <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Profile 2</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          borderRadius: '8px',
                          color: '#60a5fa',
                          fontSize: '11px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.3s ease'
                        }}>
                          <RefreshCw style={{ width: '12px', height: '12px' }} />
                          Refine Query
                        </button>
                        <button style={{
                          flex: 1,
                          padding: '8px 12px',
                          background: 'rgba(6, 182, 212, 0.2)',
                          border: '1px solid rgba(6, 182, 212, 0.3)',
                          borderRadius: '8px',
                          color: '#06b6d4',
                          fontSize: '11px',
                          fontWeight: '500',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px',
                          transition: 'all 0.3s ease'
                        }}>
                          <BarChart3 style={{ width: '12px', height: '12px' }} />
                          Visualize
                        </button>
                        <button 
                          onClick={handleDownload}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: user ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                            border: user ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
                            borderRadius: '8px',
                            color: user ? '#10b981' : '#6b7280',
                            fontSize: '11px',
                            fontWeight: '500',
                            cursor: user ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px',
                            transition: 'all 0.3s ease'
                          }}>
                          {user ? <Download style={{ width: '12px', height: '12px' }} /> : <Lock style={{ width: '12px', height: '12px' }} />}
                          {user ? 'Download CSV' : 'Login Required'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        background: 'rgba(0, 46, 77, 0.8)'
      }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about ocean data..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(0, 46, 77, 0.8)',
              border: '2px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              color: '#e2e8f0',
              fontSize: '14px',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
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
            <Send style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>
    </div>
  )
}
