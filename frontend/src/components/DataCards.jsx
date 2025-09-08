import { AlertTriangle, TrendingUp, Waves, Thermometer, Droplets, Gauge, Activity, CheckCircle, BarChart3, Eye, Zap, ArrowUp, ArrowDown, Download, Lock } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

export function DataCards() {
  const { user } = useAuth();
  
  const handleExport = (cardTitle) => {
    if (!user) {
      alert('Please login to export data');
      return;
    }
    console.log(`Exporting ${cardTitle} data...`);
    // Here you would implement actual export functionality
  };

  const dataCards = [
    {
      title: "Temperature",
      subtitle: "Ocean Surface",
      icon: Thermometer,
      iconColor: "#f97316",
      bgGradient: "linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(251, 146, 60, 0.1) 100%)",
      borderColor: "rgba(249, 115, 22, 0.3)",
      data: "892 profiles",
      status: "warning",
      statusText: "2 warnings",
      statusIcon: AlertTriangle,
      statusColor: "#ea580c",
      value: "18.5°C",
      change: "+0.3°C",
      changeType: "positive",
      trend: [65, 72, 68, 75, 80, 78, 85, 82, 88, 90, 87, 92]
    },
    {
      title: "Salinity",
      subtitle: "Salt Content",
      icon: Droplets,
      iconColor: "#3b82f6",
      bgGradient: "linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(96, 165, 250, 0.1) 100%)",
      borderColor: "rgba(59, 130, 246, 0.3)",
      data: "1,156 measurements",
      status: "success",
      statusText: "Normal",
      statusIcon: CheckCircle,
      statusColor: "#059669",
      value: "35.2 PSU",
      change: "-0.1",
      changeType: "negative",
      trend: [45, 48, 52, 49, 55, 58, 54, 57, 60, 62, 59, 64]
    },
    {
      title: "Pressure",
      subtitle: "Water Depth",
      icon: Gauge,
      iconColor: "#8b5cf6",
      bgGradient: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(167, 139, 250, 0.1) 100%)",
      borderColor: "rgba(139, 92, 246, 0.3)",
      data: "743 readings",
      status: "success",
      statusText: "Optimal",
      statusIcon: CheckCircle,
      statusColor: "#059669",
      value: "1013.2 hPa",
      change: "+2.1",
      changeType: "positive",
      trend: [30, 35, 32, 38, 42, 40, 45, 48, 50, 52, 49, 55]
    },
    {
      title: "Oxygen",
      subtitle: "Dissolved O₂",
      icon: Activity,
      iconColor: "#10b981",
      bgGradient: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(52, 211, 153, 0.1) 100%)",
      borderColor: "rgba(16, 185, 129, 0.3)",
      data: "2,341 samples",
      status: "success",
      statusText: "Healthy",
      statusIcon: CheckCircle,
      statusColor: "#059669",
      value: "8.2 mg/L",
      change: "+0.1",
      changeType: "positive",
      trend: [55, 58, 62, 59, 65, 68, 64, 67, 70, 72, 69, 74]
    },
    {
      title: "Chlorophyll",
      subtitle: "Biomass Index",
      icon: Waves,
      iconColor: "#06b6d4",
      bgGradient: "linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%)",
      borderColor: "rgba(6, 182, 212, 0.3)",
      data: "1,847 samples",
      status: "success",
      statusText: "Active",
      statusIcon: CheckCircle,
      statusColor: "#059669",
      value: "0.45 mg/m³",
      change: "+0.02",
      changeType: "positive",
      trend: [25, 28, 32, 29, 35, 38, 34, 37, 40, 42, 39, 44]
    },
    {
      title: "Turbidity",
      subtitle: "Water Clarity",
      icon: BarChart3,
      iconColor: "#f59e0b",
      bgGradient: "linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(251, 191, 36, 0.1) 100%)",
      borderColor: "rgba(245, 158, 11, 0.3)",
      data: "1,203 readings",
      status: "warning",
      statusText: "High",
      statusIcon: AlertTriangle,
      statusColor: "#d97706",
      value: "12.3 NTU",
      change: "+1.2",
      changeType: "positive",
      trend: [70, 75, 78, 72, 80, 85, 82, 88, 90, 92, 89, 95]
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            padding: '12px', 
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            borderRadius: '16px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.2)'
          }}>
            <BarChart3 style={{ width: '24px', height: '24px', color: '#60a5fa' }} />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>Argo Attributes</h2>
            <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>Real-time oceanographic measurements & analysis</p>
          </div>
        </div>
        <button style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 20px', 
          fontSize: '14px', 
          fontWeight: '500', 
          color: '#60a5fa', 
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '12px', 
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(59, 130, 246, 0.2)';
          e.target.style.borderColor = '#3b82f6';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(59, 130, 246, 0.1)';
          e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
        }}
        >
          <Eye style={{ width: '16px', height: '16px' }} />
          <span>View All</span>
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {dataCards.map((card, index) => (
          <div key={index} style={{ 
            background: 'rgba(77, 184, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px', 
            padding: '24px', 
            border: `2px solid ${card.borderColor}`,
            boxShadow: `0 20px 40px rgba(77, 184, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-8px)';
            e.target.style.boxShadow = `0 32px 64px rgba(77, 184, 255, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = `0 20px 40px rgba(77, 184, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
          }}
          >
            {/* Background Gradient */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: card.bgGradient,
              borderRadius: '20px 20px 0 0'
            }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    padding: '12px', 
                    background: card.bgGradient,
                    borderRadius: '16px',
                    border: `1px solid ${card.borderColor}`,
                    boxShadow: `0 8px 32px ${card.iconColor}20`
                  }}>
                    <card.icon style={{ width: '24px', height: '24px', color: card.iconColor }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>{card.title}</h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0 0' }}>{card.subtitle}</p>
                  </div>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '11px', 
                  fontWeight: '600', 
                  background: card.status === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: card.status === 'success' ? '#10b981' : '#f59e0b',
                  border: `1px solid ${card.status === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                }}>
                  <card.statusIcon style={{ width: '12px', height: '12px' }} />
                  <span>{card.statusText}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff' }}>{card.value}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '8px', background: card.changeType === 'positive' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }}>
                  {card.changeType === 'positive' ? 
                    <ArrowUp style={{ width: '12px', height: '12px', color: '#10b981' }} /> : 
                    <ArrowDown style={{ width: '12px', height: '12px', color: '#ef4444' }} />
                  }
                  <span style={{ fontSize: '12px', fontWeight: '600', color: card.changeType === 'positive' ? '#10b981' : '#ef4444' }}>
                    {card.change}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>{card.data}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap style={{ width: '12px', height: '12px', color: '#60a5fa' }} />
                  <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: '500' }}>Live</span>
                </div>
              </div>
              
              {/* Enhanced Mini Chart */}
              <div style={{ 
                height: '40px', 
                background: 'rgba(0, 46, 77, 0.6)',
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'end', 
                gap: '2px', 
                padding: '8px',
                border: '1px solid rgba(59, 130, 246, 0.1)'
              }}>
                {card.trend.map((value, i) => (
                  <div
                    key={i}
                    style={{ 
                      flex: 1, 
                      borderRadius: '2px', 
                      background: `linear-gradient(to top, ${card.iconColor}60, ${card.iconColor}40)`,
                      height: `${value}%`,
                      boxShadow: `0 0 8px ${card.iconColor}40`,
                      transition: 'all 0.3s ease'
                    }}
                  ></div>
                ))}
              </div>

              {/* Export Button */}
              <button
                onClick={() => handleExport(card.title)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: user ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                  border: user ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(107, 114, 128, 0.3)',
                  borderRadius: '8px',
                  color: user ? '#10b981' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: '500',
                  cursor: user ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.3s ease',
                  marginTop: '12px'
                }}
                onMouseEnter={(e) => {
                  if (user) {
                    e.target.style.background = 'rgba(16, 185, 129, 0.3)';
                    e.target.style.borderColor = '#10b981';
                  }
                }}
                onMouseLeave={(e) => {
                  if (user) {
                    e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                    e.target.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                  }
                }}
              >
                {user ? <Download style={{ width: '14px', height: '14px' }} /> : <Lock style={{ width: '14px', height: '14px' }} />}
                <span>{user ? 'Export Data' : 'Login Required'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
