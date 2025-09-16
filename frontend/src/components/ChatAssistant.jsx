import { useState, useRef, useCallback, useEffect } from "react"
import { MessageCircle, Send, X, Bot, User, BarChart3, Download, RefreshCw, Zap, Lock, GripVertical, Waves, Sparkles, ArrowRight, Globe, TrendingUp, Database, Loader2 } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

export function ChatAssistant({ isOpen, onToggle, isFullscreen = false, width = 400, onWidthChange }) {
  const { user } = useAuth();
  const [isResizing, setIsResizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlot, setCurrentPlot] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown');
  const resizeRef = useRef(null);

  // API Configuration
  const API_BASE_URL = "http://127.0.0.1:8001";

  // Test API connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        setConnectionStatus('connecting')
        const response = await axios.get(`${API_BASE_URL}/docs`)
        console.log("✅ FastAPI connection successful:", response.status)
        setConnectionStatus('connected')
      } catch (error) {
        console.error("❌ FastAPI connection failed:", error.message)
        console.error("Make sure FastAPI is running on localhost:8001")
        setConnectionStatus('disconnected')
      }
    }
    
    if (user) {
      testConnection()
    }
  }, [user])

  const [messages, setMessages] = useState(
    user ? [] : [
      {
        id: 1,
        text: "Welcome to FloatChat! 🌊",
        sender: "bot",
        timestamp: "Now",
        hasGraph: false,
        isIntro: true
      }
    ]
  )
  const [inputText, setInputText] = useState("")

  const handleSendMessage = async () => {
    if (!user) {
      // Show login prompt for non-authenticated users
      return;
    }

    if (inputText.trim() && !isLoading) {
      const userMessage = {
        id: Date.now(),
        text: inputText,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        hasGraph: false
      }
      
      setMessages(prev => [...prev, userMessage])
      setInputText("")
      setIsLoading(true)

      try {
        // Send query to FastAPI backend
        console.log("Sending query to FastAPI:", inputText)
        const response = await axios.post(`${API_BASE_URL}/query`, {
          query: inputText
        }, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 300000 // 30 second timeout
        })
        
        console.log("FastAPI Response:", response.data)

        // Get plot data if available
        let plotData = null
        try {
          const plotResponse = await axios.get(`${API_BASE_URL}/plot`)
          plotData = plotResponse.data
          setCurrentPlot(plotData)
        } catch (plotError) {
          console.log("No plot data available:", plotError)
        }

        const botResponse = {
          id: Date.now() + 1,
          text: response.data.response || response.data.answer || response.data.message || "I've processed your query and found relevant ocean data.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          hasGraph: !!plotData,
          plotData: plotData
        }
        
        setMessages(prev => [...prev, botResponse])
      } catch (error) {
        console.error("API Error Details:", error)
        console.error("Error Response:", error.response?.data)
        console.error("Error Status:", error.response?.status)
        console.error("Error Config:", error.config)
        
        let errorMessage = "Sorry, I encountered an error processing your query. Please try again or rephrase your question."
        
        if (error.code === 'ECONNREFUSED') {
          errorMessage = "Unable to connect to the AI backend. Please make sure the FastAPI server is running on localhost:8001"
        } else if (error.response?.status === 404) {
          errorMessage = "API endpoint not found. Please check if the FastAPI server is running correctly."
        } else if (error.response?.status === 500) {
          errorMessage = "Server error occurred. Please try again in a moment."
        } else if (error.response?.data?.detail) {
          errorMessage = `API Error: ${error.response.data.detail}`
        }
        
        const errorResponse = {
          id: Date.now() + 1,
          text: errorMessage,
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          hasGraph: false,
          isError: true
        }
        setMessages(prev => [...prev, errorResponse])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  // Resize functionality
  const handleMouseDown = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !onWidthChange) return;

    const newWidth = window.innerWidth - e.clientX;
    const minWidth = 300;
    const maxWidth = Math.min(800, window.innerWidth * 0.6);

    onWidthChange(Math.max(minWidth, Math.min(maxWidth, newWidth)));
  }, [isResizing, onWidthChange]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const handleDownload = () => {
    if (!user) {
      alert('Please login to download data');
      return;
    }
    console.log('Downloading chat data...');
    // Here you would implement actual download functionality
  }

  if (!isOpen) return null

  // Check if we should show welcome screen (fullscreen mode with no real messages)
  const showWelcomeScreen = isFullscreen && (!user || (messages.length === 1 && messages[0].isIntro))

  return (
    <div className="gradient-level-2" style={{
      position: 'fixed',
      right: isFullscreen ? 0 : 0,
      top: isFullscreen ? 0 : '80px',
      left: isFullscreen ? 0 : 'auto',
      height: isFullscreen ? '100vh' : 'calc(100vh - 80px)',
      width: isFullscreen ? '100vw' : `${width}px`,
      backdropFilter: 'blur(20px)',
      borderLeft: isFullscreen ? 'none' : '2px solid var(--blue-70)',
      boxShadow: isFullscreen ? 'none' : 'var(--shadow-heavy)',
      zIndex: isFullscreen ? 50 : 40,
      display: 'flex',
      flexDirection: 'column',
      background: isFullscreen ? `
        radial-gradient(ellipse at top left, rgba(0, 10, 26, 0.9) 0%, transparent 50%),
        radial-gradient(ellipse at bottom right, rgba(0, 17, 51, 0.9) 0%, transparent 50%),
        radial-gradient(ellipse at center, rgba(0, 26, 77, 0.8) 0%, transparent 70%),
        linear-gradient(135deg, rgba(0, 31, 77, 0.95) 0%, rgba(0, 41, 102, 0.95) 25%, rgba(0, 51, 128, 0.95) 50%, rgba(0, 61, 153, 0.95) 75%, rgba(0, 71, 179, 0.95) 100%)
      ` : undefined
    }}>
      {/* Resize Handle */}
      {!isFullscreen && (
        <div
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            left: '-6px',
            top: 0,
            bottom: 0,
            width: '12px',
            cursor: 'col-resize',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isResizing ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            borderRadius: '6px',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => {
            if (!isResizing) {
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isResizing) {
              e.target.style.background = 'transparent';
            }
          }}
        >
          <GripVertical
            style={{
              width: '16px',
              height: '16px',
              color: isResizing ? '#3b82f6' : 'var(--blue-40)',
              transition: 'color 0.2s ease'
            }}
          />
        </div>
      )}
      {/* Header */}
      <div style={{
        padding: isFullscreen ? '24px 40px' : '20px',
        borderBottom: '1px solid var(--blue-70)',
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.8) 0%, rgba(15, 118, 110, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
              borderRadius: '12px',
              border: '2px solid rgba(59, 130, 246, 0.8)',
              boxShadow: '0 8px 32px rgba(59, 130, 246, 0.6)'
            }}>
              <Bot style={{ width: '20px', height: '20px', color: '#ffffff', filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.8))' }} />
            </div>
            <div>
              <h3 style={{ fontSize: isFullscreen ? '24px' : '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
                {isFullscreen ? 'FloatChat Assistant - Fullscreen' : 'FloatChat Assistant'}
              </h3>
              <p style={{ fontSize: isFullscreen ? '14px' : '12px', color: 'var(--blue-20)', margin: '2px 0 0 0' }}>
                {isFullscreen ? 'AI-powered ocean analytics - Full experience' : 'AI-powered ocean analytics'}
                {user && (
                  <span style={{ 
                    marginLeft: '8px', 
                    fontSize: '10px',
                    color: connectionStatus === 'connected' ? '#10b981' : 
                           connectionStatus === 'disconnected' ? '#ef4444' : '#f59e0b'
                  }}>
                    {connectionStatus === 'connected' ? '🟢 Connected' : 
                     connectionStatus === 'disconnected' ? '🔴 Disconnected' : '🟡 Connecting...'}
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onToggle}
            style={{
              padding: '8px',
              color: 'var(--blue-25)',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid var(--blue-70)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.color = 'var(--blue-15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.1)';
              e.target.style.color = 'var(--blue-25)';
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>

      {/* Fullscreen Welcome Screen */}
      {showWelcomeScreen ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Animated Background Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '10%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            right: '15%',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: 'float 8s ease-in-out infinite reverse'
          }}></div>

          {/* Main Logo and Branding */}
          <div style={{
            marginBottom: '48px',
            position: 'relative',
            zIndex: 2
          }}>
            {/* Large Logo */}
            <div style={{
              width: '120px',
              height: '120px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(6, 182, 212, 0.9) 100%)',
              borderRadius: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              border: '3px solid rgba(59, 130, 246, 0.8)',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3)',
              position: 'relative',
              animation: 'pulse 3s ease-in-out infinite'
            }}>
              <Bot style={{
                width: '60px',
                height: '60px',
                color: '#ffffff',
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))'
              }} />

              {/* Floating particles around logo */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                width: '20px',
                height: '20px',
                background: '#fbbf24',
                borderRadius: '50%',
                animation: 'sparkle 2s ease-in-out infinite'
              }}>
                <Sparkles style={{ width: '12px', height: '12px', color: 'white', margin: '4px' }} />
              </div>
            </div>

            {/* Brand Name */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              margin: '0 0 16px 0',
              textShadow: '0 0 40px rgba(96, 165, 250, 0.5)',
              letterSpacing: '-0.02em'
            }}>
              FloatChat
            </h1>

            {/* Tagline */}
            <p style={{
              fontSize: '24px',
              color: '#cbd5e1',
              margin: '0 0 8px 0',
              fontWeight: '300',
              letterSpacing: '0.01em'
            }}>
              AI-Powered Ocean Analytics
            </p>

            {/* Subtitle */}
            <p style={{
              fontSize: '16px',
              color: '#94a3b8',
              margin: 0,
              maxWidth: '600px',
              lineHeight: '1.6'
            }}>
              Dive deep into ocean data with our intelligent assistant. Analyze ARGO floats, visualize trends, and discover insights from the world's oceans.
            </p>
          </div>

          {/* Feature Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            maxWidth: '900px',
            width: '100%',
            marginBottom: '48px',
            position: 'relative',
            zIndex: 2
          }}>
            {[
              {
                icon: <Database style={{ width: '24px', height: '24px' }} />,
                title: 'ARGO Data Analysis',
                description: 'Access and analyze real-time ocean data from thousands of ARGO floats worldwide',
                color: '#3b82f6'
              },
              {
                icon: <BarChart3 style={{ width: '24px', height: '24px' }} />,
                title: 'Smart Visualizations',
                description: 'Generate interactive charts and graphs with natural language queries',
                color: '#06b6d4'
              },
              {
                icon: <TrendingUp style={{ width: '24px', height: '24px' }} />,
                title: 'Trend Discovery',
                description: 'Identify patterns and trends in ocean temperature, salinity, and more',
                color: '#10b981'
              }
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 46, 77, 0.8) 0%, rgba(0, 26, 77, 0.6) 100%)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  border: `1px solid rgba(${feature.color === '#3b82f6' ? '59, 130, 246' : feature.color === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, 0.3)`,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-8px)';
                  e.target.style.boxShadow = `0 20px 40px rgba(${feature.color === '#3b82f6' ? '59, 130, 246' : feature.color === '#06b6d4' ? '6, 182, 212' : '16, 185, 129'}, 0.3)`;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}CC 100%)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                  color: 'white'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#e2e8f0',
                  margin: '0 0 12px 0'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  fontSize: '14px',
                  color: '#94a3b8',
                  margin: 0,
                  lineHeight: '1.5'
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div style={{
            position: 'relative',
            zIndex: 2
          }}>
            {user ? (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                textAlign: 'center',
                maxWidth: '500px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <Waves style={{ width: '24px', height: '24px', color: '#10b981' }} />
                  <span style={{ fontSize: '20px', fontWeight: '600', color: '#10b981' }}>
                    Ready to Explore
                  </span>
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#cbd5e1',
                  margin: '0 0 24px 0',
                  lineHeight: '1.6'
                }}>
                  Welcome back! Start by asking me about ocean data, or try one of these examples:
                </p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {[
                    "Show me temperature trends in the Pacific Ocean",
                    "Analyze salinity data near the equator",
                    "Compare ocean data from 2020 vs 2023"
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputText(example);
                        // Auto-scroll to input
                        setTimeout(() => {
                          const input = document.querySelector('input[type="text"]');
                          if (input) input.focus();
                        }, 100);
                      }}
                      style={{
                        padding: '12px 20px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        color: '#10b981',
                        fontSize: '14px',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                        e.target.style.transform = 'translateX(8px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(16, 185, 129, 0.1)';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <span>{example}</span>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                borderRadius: '20px',
                padding: '32px',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                textAlign: 'center',
                maxWidth: '500px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '20px'
                }}>
                  <Lock style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
                  <span style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6' }}>
                    Get Started Today
                  </span>
                </div>
                <p style={{
                  fontSize: '16px',
                  color: '#cbd5e1',
                  margin: '0 0 24px 0',
                  lineHeight: '1.6'
                }}>
                  Sign up for free to unlock the full power of AI-driven ocean analytics and start exploring the depths of ocean data.
                </p>
                <button
                  onClick={() => window.location.href = '/login'}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: '0 auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-4px)';
                    e.target.style.boxShadow = '0 16px 48px rgba(59, 130, 246, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 32px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  <Sparkles style={{ width: '20px', height: '20px' }} />
                  Start Free Trial
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Regular Messages View */
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

                    {/* Intro Content for Non-Authenticated Users */}
                    {message.isIntro && !user && (
                      <div style={{ marginTop: '16px' }}>
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                          borderRadius: '12px',
                          padding: '20px',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          marginBottom: '16px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                            <Zap style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#e2e8f0' }}>AI-Powered Ocean Analytics</span>
                          </div>

                          <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                            AI assistant for ocean data analysis.
                          </p>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                            {[
                              "🔍 Analyze ARGO data",
                              "📊 Generate charts"
                            ].map((feature, index) => (
                              <div key={index} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                color: '#94a3b8'
                              }}>
                                <div style={{
                                  width: '3px',
                                  height: '3px',
                                  background: '#06b6d4',
                                  borderRadius: '50%'
                                }}></div>
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Call-to-Action */}
                        <div style={{
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          textAlign: 'center'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                            <Lock style={{ width: '16px', height: '16px', color: '#10b981' }} />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#10b981' }}>
                              Unlock Full AI Power
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                            Sign up now to start chatting with our AI and unlock advanced ocean analytics!
                          </p>
                          <button
                            onClick={() => window.location.href = '/login'}
                            style={{
                              padding: '10px 20px',
                              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                              border: 'none',
                              borderRadius: '8px',
                              color: 'white',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                              boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.transform = 'translateY(-2px)';
                              e.target.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.6)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                            }}
                          >
                            🚀 Get Started Free
                          </button>
                        </div>
                      </div>
                    )}

                    <p style={{ fontSize: '11px', opacity: 0.7, margin: '8px 0 0 0' }}>{message.timestamp}</p>

                    {/* Dynamic Graph Display */}
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
                            <span style={{ fontSize: '12px', fontWeight: '600', color: '#e2e8f0' }}>
                              {message.plotData?.title || 'Ocean Data Analysis'}
                            </span>
                          </div>

                          {/* Dynamic Chart */}
                          <div style={{ height: '120px', position: 'relative', marginBottom: '12px' }}>
                            {message.plotData ? (
                              // Render actual plot data from API
                              <div style={{
                                width: '100%',
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
                                borderRadius: '8px',
                                border: '1px solid rgba(59, 130, 246, 0.2)'
                              }}>
                                {message.plotData.image ? (
                                  <img 
                                    src={`data:image/png;base64,${message.plotData.image}`} 
                                    alt="Ocean Data Plot"
                                    style={{ 
                                      maxWidth: '100%', 
                                      maxHeight: '100%', 
                                      objectFit: 'contain',
                                      borderRadius: '4px'
                                    }}
                                  />
                                ) : (
                                  <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                    <BarChart3 style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
                                    <div style={{ fontSize: '12px' }}>Chart Generated</div>
                                  </div>
                                )}
                              </div>
                            ) : (
                              // Fallback static chart
                              <div style={{
                                marginLeft: '35px',
                                height: '100%',
                                position: 'relative',
                                background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#94a3b8',
                                fontSize: '12px'
                              }}>
                                <div style={{ textAlign: 'center' }}>
                                  <BarChart3 style={{ width: '24px', height: '24px', marginBottom: '4px' }} />
                                  <div>Processing data...</div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Chart Info */}
                          <div style={{
                            textAlign: 'center',
                            fontSize: '10px',
                            color: '#94a3b8',
                            marginTop: '8px'
                          }}>
                            {message.plotData?.xLabel || 'Ocean Parameters'}
                          </div>

                          {/* Legend */}
                          {message.plotData?.legend && (
                            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', flexWrap: 'wrap' }}>
                              {message.plotData.legend.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ 
                                    width: '8px', 
                                    height: '2px', 
                                    background: item.color || '#60a5fa', 
                                    borderRadius: '1px' 
                                  }}></div>
                                  <span style={{ fontSize: '10px', color: '#cbd5e1' }}>{item.label}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            onClick={() => {
                              setInputText(message.text);
                              // Auto-focus input
                              setTimeout(() => {
                                const input = document.querySelector('input[type="text"]');
                                if (input) input.focus();
                              }, 100);
                            }}
                            style={{
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
                            }}
                          >
                            <RefreshCw style={{ width: '12px', height: '12px' }} />
                            Refine Query
                          </button>
                          <button 
                            onClick={async () => {
                              try {
                                const plotResponse = await axios.get(`${API_BASE_URL}/plot`);
                                setCurrentPlot(plotResponse.data);
                                // Update the current message with new plot data
                                setMessages(prev => prev.map(msg => 
                                  msg.id === message.id 
                                    ? { ...msg, plotData: plotResponse.data, hasGraph: true }
                                    : msg
                                ));
                              } catch (error) {
                                console.error("Error fetching plot:", error);
                              }
                            }}
                            style={{
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
                            }}
                          >
                            <BarChart3 style={{ width: '12px', height: '12px' }} />
                            Refresh Plot
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
          
          {/* Loading Message */}
          {isLoading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div
                style={{
                  maxWidth: '85%',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(0, 46, 77, 0.8)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Bot style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                <Loader2 style={{ width: '16px', height: '16px', color: '#60a5fa', animation: 'spin 1s linear infinite' }} />
                <span>Analyzing ocean data...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '20px',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
        background: 'rgba(0, 46, 77, 0.8)'
      }}>
        {user ? (
          // Authenticated User Input
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isLoading ? "Processing your query..." : "Ask about ocean data..."}
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: isLoading ? 'rgba(0, 46, 77, 0.4)' : 'rgba(0, 46, 77, 0.8)',
                border: '2px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '12px',
                color: isLoading ? '#6b7280' : '#e2e8f0',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1
              }}
              onFocus={(e) => {
                if (!isLoading) {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputText.trim()}
              style={{
                padding: '12px',
                background: isLoading || !inputText.trim() 
                  ? 'rgba(107, 114, 128, 0.4)' 
                  : 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: isLoading || !inputText.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isLoading || !inputText.trim() 
                  ? 'none' 
                  : '0 8px 32px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease',
                opacity: isLoading || !inputText.trim() ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading && inputText.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(59, 130, 246, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = isLoading || !inputText.trim() 
                  ? 'none' 
                  : '0 8px 32px rgba(59, 130, 246, 0.4)';
              }}
            >
              {isLoading ? (
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              ) : (
                <Send style={{ width: '16px', height: '16px' }} />
              )}
            </button>
          </div>
        ) : (
          // Locked Input for Non-Authenticated Users
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(0, 46, 77, 0.4)',
              border: '2px solid rgba(107, 114, 128, 0.3)',
              borderRadius: '12px',
              color: '#6b7280',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: 0.6
            }}>
              <Lock style={{ width: '16px', height: '16px', color: '#6b7280' }} />
              <span>Login to unlock AI chat</span>
            </div>
            <button
              onClick={() => window.location.href = '/login'}
              style={{
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.4)';
              }}
            >
              <User style={{ width: '14px', height: '14px' }} />
              Login
            </button>
          </div>
        )}
      </div>

      {/* CSS Animations for fullscreen welcome screen */}
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg); 
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-20px) rotate(5deg); 
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            box-shadow: 0 20px 60px rgba(59, 130, 246, 0.4), 0 0 40px rgba(6, 182, 212, 0.3);
          }
          50% { 
            transform: scale(1.05); 
            box-shadow: 0 25px 80px rgba(59, 130, 246, 0.6), 0 0 60px rgba(6, 182, 212, 0.5);
          }
        }
        @keyframes sparkle {
          0%, 100% { 
            opacity: 1; 
            transform: scale(1) rotate(0deg); 
          }
          50% { 
            opacity: 0.7; 
            transform: scale(1.2) rotate(180deg); 
          }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
