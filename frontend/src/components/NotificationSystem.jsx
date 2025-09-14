import { useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, AlertCircle, Settings, Trash2 } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="glass-effect"
        style={{
          position: 'relative',
          padding: '12px',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          background: unreadCount > 0 ? 'var(--glass-medium)' : 'var(--glass-light)'
        }}
      >
        <Bell style={{ 
          width: '20px', 
          height: '20px', 
          color: 'var(--blue-15)' 
        }} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '18px',
            height: '18px',
            background: '#ef4444',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontWeight: '700',
            color: 'white',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.6)'
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown 
          notifications={recentNotifications}
          onClose={() => setIsOpen(false)}
          onMarkAsRead={markAsRead}
        />
      )}
    </div>
  );
};

const NotificationDropdown = ({ notifications, onClose, onMarkAsRead }) => {
  const { clearAll } = useNotifications();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertCircle style={{ width: '16px', height: '16px', color: '#ef4444' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '16px', height: '16px', color: '#f59e0b' }} />;
      case 'success':
        return <CheckCircle style={{ width: '16px', height: '16px', color: '#10b981' }} />;
      default:
        return <Info style={{ width: '16px', height: '16px', color: '#3b82f6' }} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'critical':
        return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)' };
      default:
        return { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)' };
    }
  };

  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      right: '0',
      marginTop: '8px',
      width: '320px',
      maxHeight: '400px',
      background: 'var(--blue-95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid var(--blue-70)',
      boxShadow: 'var(--shadow-heavy)',
      zIndex: 1000,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid var(--blue-80)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'var(--blue-15)',
          margin: 0
        }}>
          Notifications
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={clearAll}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--blue-30)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--blue-80)';
              e.target.style.color = 'var(--blue-15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--blue-30)';
            }}
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              color: 'var(--blue-30)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--blue-80)';
              e.target.style.color = 'var(--blue-15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--blue-30)';
            }}
          >
            <X style={{ width: '14px', height: '14px' }} />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{
            padding: '32px 16px',
            textAlign: 'center',
            color: 'var(--blue-30)'
          }}>
            <Bell style={{ width: '32px', height: '32px', margin: '0 auto 8px', opacity: 0.5 }} />
            <p style={{ fontSize: '14px', margin: 0 }}>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const colors = getNotificationColor(notification.type);
            return (
              <div
                key={notification.id}
                onClick={() => onMarkAsRead(notification.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--blue-85)',
                  cursor: 'pointer',
                  background: notification.read ? 'transparent' : colors.bg,
                  borderLeft: `3px solid ${colors.border.replace('0.3', '1')}`,
                  transition: 'all 0.2s ease',
                  opacity: notification.read ? 0.7 : 1
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--blue-85)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = notification.read ? 'transparent' : colors.bg;
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{ marginTop: '2px' }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: 'var(--blue-15)',
                      marginBottom: '4px'
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: 'var(--blue-25)',
                      lineHeight: '1.4',
                      marginBottom: '6px'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'var(--blue-40)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span>{formatTimeAgo(notification.timestamp)}</span>
                      {!notification.read && (
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: '#3b82f6'
                        }} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export const AlertBanner = () => {
  const { notifications, removeNotification } = useNotifications();
  
  const criticalNotifications = notifications.filter(n => 
    n.type === 'critical' && !n.read
  ).slice(0, 3);

  if (criticalNotifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      {criticalNotifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: 'rgba(239, 68, 68, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.3)',
            maxWidth: '300px',
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle style={{ width: '20px', height: '20px', color: 'white', marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px'
              }}>
                {notification.title}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'rgba(255, 255, 255, 0.9)',
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              <X style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DataQualityTooltip = ({ quality, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const getQualityInfo = (quality) => {
    if (quality >= 90) {
      return {
        label: 'Excellent',
        color: '#10b981',
        description: 'High quality data with minimal uncertainty'
      };
    } else if (quality >= 70) {
      return {
        label: 'Good',
        color: '#f59e0b',
        description: 'Acceptable data quality with some limitations'
      };
    } else {
      return {
        label: 'Poor',
        color: '#ef4444',
        description: 'Low quality data, use with caution'
      };
    }
  };

  const qualityInfo = getQualityInfo(quality);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
          background: 'var(--blue-95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '8px',
          padding: '12px',
          border: '1px solid var(--blue-70)',
          boxShadow: 'var(--shadow-heavy)',
          zIndex: 1000,
          whiteSpace: 'nowrap',
          minWidth: '200px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: qualityInfo.color,
            marginBottom: '4px'
          }}>
            Data Quality: {qualityInfo.label} ({quality}%)
          </div>
          <div style={{
            fontSize: '11px',
            color: 'var(--blue-25)',
            lineHeight: '1.3'
          }}>
            {qualityInfo.description}
          </div>
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: '6px solid var(--blue-95)'
          }} />
        </div>
      )}
    </div>
  );
};

// Utility function to format time ago
const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};