import { useState } from 'react';
import { Settings, Bell, AlertTriangle, Shield, Mail, Save, RotateCcw } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationPreferences = ({ isOpen, onClose }) => {
  const { preferences, updatePreferences } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState(preferences);
  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (key, value) => {
    setLocalPreferences(prev => {
      const updated = { ...prev, [key]: value };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(preferences));
      return updated;
    });
  };

  const handleThresholdChange = (attribute, type, value) => {
    setLocalPreferences(prev => {
      const updated = {
        ...prev,
        thresholds: {
          ...prev.thresholds,
          [attribute]: {
            ...prev.thresholds[attribute],
            [type]: type === 'critical' ? 
              { ...prev.thresholds[attribute].critical, ...value } :
              value
          }
        }
      };
      setHasChanges(JSON.stringify(updated) !== JSON.stringify(preferences));
      return updated;
    });
  };

  const handleSave = () => {
    updatePreferences(localPreferences);
    setHasChanges(false);
  };

  const handleReset = () => {
    setLocalPreferences(preferences);
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--blue-95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        border: '1px solid var(--blue-70)',
        boxShadow: 'var(--shadow-heavy)',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--blue-80)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              background: 'var(--glass-light)',
              borderRadius: '12px'
            }}>
              <Settings style={{ width: '20px', height: '20px', color: 'var(--blue-15)' }} />
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--blue-15)',
              margin: 0
            }}>
              Notification Preferences
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              color: 'var(--blue-30)',
              transition: 'all 0.2s ease'
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {/* General Settings */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--blue-15)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Bell style={{ width: '16px', height: '16px' }} />
              General Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localPreferences.enableRealTimeUpdates}
                  onChange={(e) => handlePreferenceChange('enableRealTimeUpdates', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--blue-15)' }}>
                    Real-time Updates
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--blue-30)' }}>
                    Receive notifications when data is updated
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localPreferences.enableThresholdAlerts}
                  onChange={(e) => handlePreferenceChange('enableThresholdAlerts', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--blue-15)' }}>
                    Threshold Alerts
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--blue-30)' }}>
                    Get alerted when values exceed normal ranges
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localPreferences.enableDataQualityWarnings}
                  onChange={(e) => handlePreferenceChange('enableDataQualityWarnings', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--blue-15)' }}>
                    Data Quality Warnings
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--blue-30)' }}>
                    Warn when data quality falls below threshold
                  </div>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={localPreferences.enableEmailNotifications}
                  onChange={(e) => handlePreferenceChange('enableEmailNotifications', e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--blue-15)' }}>
                    Email Notifications
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--blue-30)' }}>
                    Send critical alerts via email
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Data Quality Threshold */}
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--blue-15)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Shield style={{ width: '16px', height: '16px' }} />
              Data Quality Threshold
            </h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ fontSize: '14px', color: 'var(--blue-20)' }}>
                Minimum Quality:
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={localPreferences.dataQualityThreshold}
                onChange={(e) => handlePreferenceChange('dataQualityThreshold', parseInt(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ 
                fontSize: '14px', 
                fontWeight: '600', 
                color: 'var(--blue-15)',
                minWidth: '40px'
              }}>
                {localPreferences.dataQualityThreshold}%
              </span>
            </div>
          </div>

          {/* Threshold Settings */}
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--blue-15)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle style={{ width: '16px', height: '16px' }} />
              Threshold Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(localPreferences.thresholds).map(([attribute, thresholds]) => (
                <div key={attribute} style={{
                  padding: '16px',
                  background: 'var(--glass-light)',
                  borderRadius: '12px',
                  border: '1px solid var(--blue-80)'
                }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--blue-15)',
                    marginBottom: '12px',
                    textTransform: 'capitalize'
                  }}>
                    {attribute}
                  </h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--blue-30)', marginBottom: '4px', display: 'block' }}>
                        Warning Range
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={thresholds.min}
                          onChange={(e) => handleThresholdChange(attribute, 'min', parseFloat(e.target.value))}
                          style={{
                            padding: '6px 8px',
                            background: 'var(--blue-85)',
                            border: '1px solid var(--blue-70)',
                            borderRadius: '6px',
                            color: 'var(--blue-15)',
                            fontSize: '12px',
                            width: '60px'
                          }}
                        />
                        <span style={{ color: 'var(--blue-30)', fontSize: '12px' }}>to</span>
                        <input
                          type="number"
                          value={thresholds.max}
                          onChange={(e) => handleThresholdChange(attribute, 'max', parseFloat(e.target.value))}
                          style={{
                            padding: '6px 8px',
                            background: 'var(--blue-85)',
                            border: '1px solid var(--blue-70)',
                            borderRadius: '6px',
                            color: 'var(--blue-15)',
                            fontSize: '12px',
                            width: '60px'
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label style={{ fontSize: '12px', color: 'var(--blue-30)', marginBottom: '4px', display: 'block' }}>
                        Critical Range
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="number"
                          value={thresholds.critical.min}
                          onChange={(e) => handleThresholdChange(attribute, 'critical', { min: parseFloat(e.target.value) })}
                          style={{
                            padding: '6px 8px',
                            background: 'var(--blue-85)',
                            border: '1px solid var(--blue-70)',
                            borderRadius: '6px',
                            color: 'var(--blue-15)',
                            fontSize: '12px',
                            width: '60px'
                          }}
                        />
                        <span style={{ color: 'var(--blue-30)', fontSize: '12px' }}>to</span>
                        <input
                          type="number"
                          value={thresholds.critical.max}
                          onChange={(e) => handleThresholdChange(attribute, 'critical', { max: parseFloat(e.target.value) })}
                          style={{
                            padding: '6px 8px',
                            background: 'var(--blue-85)',
                            border: '1px solid var(--blue-70)',
                            borderRadius: '6px',
                            color: 'var(--blue-15)',
                            fontSize: '12px',
                            width: '60px'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        {hasChanges && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid var(--blue-80)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--glass-light)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--blue-30)' }}>
              You have unsaved changes
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleReset}
                style={{
                  padding: '8px 16px',
                  background: 'transparent',
                  border: '1px solid var(--blue-70)',
                  borderRadius: '8px',
                  color: 'var(--blue-25)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <RotateCcw style={{ width: '12px', height: '12px' }} />
                Reset
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '8px 16px',
                  background: 'var(--blue-60)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Save style={{ width: '12px', height: '12px' }} />
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};