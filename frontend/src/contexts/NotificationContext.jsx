import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    enableRealTimeUpdates: true,
    enableThresholdAlerts: true,
    enableDataQualityWarnings: true,
    enableEmailNotifications: false,
    thresholds: {
      temperature: { min: 15, max: 25, critical: { min: 10, max: 30 } },
      salinity: { min: 30, max: 40, critical: { min: 25, max: 45 } },
      pressure: { min: 1000, max: 1020, critical: { min: 990, max: 1030 } },
      oxygen: { min: 6, max: 12, critical: { min: 4, max: 15 } },
      chlorophyll: { min: 0.1, max: 1.0, critical: { min: 0.05, max: 2.0 } },
      turbidity: { min: 0, max: 10, critical: { min: 0, max: 20 } }
    },
    dataQualityThreshold: 70
  });

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      timestamp: new Date(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
    
    // Auto-remove non-critical notifications after 5 seconds
    if (notification.type !== 'critical') {
      setTimeout(() => {
        removeNotification(id);
      }, 5000);
    }
    
    return id;
  }, [removeNotification]);

  // Mark notification as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Update preferences
  const updatePreferences = useCallback((newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  }, []);

  // Check thresholds for attribute data
  const checkThresholds = useCallback((attributeData) => {
    if (!preferences.enableThresholdAlerts) return;

    const threshold = preferences.thresholds[attributeData.id];
    if (!threshold) return;

    const value = attributeData.numericValue;
    let alertType = null;
    let message = '';

    // Check critical thresholds
    if (value <= threshold.critical.min || value >= threshold.critical.max) {
      alertType = 'critical';
      message = `Critical ${attributeData.title} level: ${attributeData.value}`;
    }
    // Check warning thresholds
    else if (value <= threshold.min || value >= threshold.max) {
      alertType = 'warning';
      message = `${attributeData.title} outside normal range: ${attributeData.value}`;
    }

    if (alertType) {
      addNotification({
        type: alertType,
        category: 'threshold',
        title: `${attributeData.title} Alert`,
        message,
        attributeId: attributeData.id,
        value: attributeData.value,
        threshold: alertType === 'critical' ? threshold.critical : threshold
      });
    }
  }, [preferences.enableThresholdAlerts, preferences.thresholds, addNotification]);

  // Check data quality
  const checkDataQuality = useCallback((attributeData) => {
    if (!preferences.enableDataQualityWarnings) return;

    if (attributeData.dataQuality < preferences.dataQualityThreshold) {
      addNotification({
        type: 'warning',
        category: 'data_quality',
        title: 'Data Quality Warning',
        message: `${attributeData.title} data quality is ${attributeData.dataQuality}%`,
        attributeId: attributeData.id,
        quality: attributeData.dataQuality
      });
    }
  }, [preferences.enableDataQualityWarnings, preferences.dataQualityThreshold, addNotification]);

  // Simulate real-time updates
  useEffect(() => {
    if (!preferences.enableRealTimeUpdates) return;

    const interval = setInterval(() => {
      // Simulate random data updates
      const attributes = ['temperature', 'salinity', 'pressure', 'oxygen', 'chlorophyll', 'turbidity'];
      const randomAttribute = attributes[Math.floor(Math.random() * attributes.length)];
      
      addNotification({
        type: 'info',
        category: 'update',
        title: 'Data Updated',
        message: `${randomAttribute.charAt(0).toUpperCase() + randomAttribute.slice(1)} data has been updated`,
        attributeId: randomAttribute
      });
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [preferences.enableRealTimeUpdates, addNotification]);

  const value = {
    notifications,
    preferences,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    updatePreferences,
    checkThresholds,
    checkDataQuality,
    unreadCount: notifications.filter(n => !n.read).length
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};