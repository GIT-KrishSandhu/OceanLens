import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationProvider, useNotifications } from '../../contexts/NotificationContext';
import { NotificationBell, AlertBanner, DataQualityTooltip } from '../NotificationSystem';

// Mock component to test the context
const TestComponent = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    clearAll,
    checkThresholds,
    checkDataQuality,
    unreadCount
  } = useNotifications();

  return (
    <div>
      <div data-testid="unread-count">{unreadCount}</div>
      <div data-testid="notifications-count">{notifications.length}</div>
      <button 
        onClick={() => addNotification({
          type: 'info',
          title: 'Test Notification',
          message: 'This is a test'
        })}
        data-testid="add-notification"
      >
        Add Notification
      </button>
      <button 
        onClick={() => addNotification({
          type: 'critical',
          title: 'Critical Alert',
          message: 'This is critical'
        })}
        data-testid="add-critical"
      >
        Add Critical
      </button>
      <button onClick={clearAll} data-testid="clear-all">Clear All</button>
      <button 
        onClick={() => checkThresholds({
          id: 'temperature',
          title: 'Temperature',
          numericValue: 35,
          value: '35°C'
        })}
        data-testid="check-thresholds"
      >
        Check Thresholds
      </button>
      <button 
        onClick={() => checkDataQuality({
          id: 'temperature',
          title: 'Temperature',
          dataQuality: 50
        })}
        data-testid="check-quality"
      >
        Check Quality
      </button>
      {notifications.map(n => (
        <div key={n.id} data-testid={`notification-${n.id}`}>
          <span>{n.title}</span>
          <button onClick={() => markAsRead(n.id)}>Mark Read</button>
          <button onClick={() => removeNotification(n.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

describe('NotificationContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide notification context', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
  });

  it('should add notifications', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-notification'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
      expect(screen.getByText('Test Notification')).toBeInTheDocument();
    });
  });

  it('should mark notifications as read', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-notification'));

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('1');
    });

    fireEvent.click(screen.getByText('Mark Read'));

    await waitFor(() => {
      expect(screen.getByTestId('unread-count')).toHaveTextContent('0');
    });
  });

  it('should remove notifications', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-notification'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    });

    fireEvent.click(screen.getByText('Remove'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
    });
  });

  it('should clear all notifications', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-notification'));
    fireEvent.click(screen.getByTestId('add-notification'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('2');
    });

    fireEvent.click(screen.getByTestId('clear-all'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
    });
  });

  it('should check thresholds and create alerts', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('check-thresholds'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
      expect(screen.getByText('Temperature Alert')).toBeInTheDocument();
    });
  });

  it('should check data quality and create warnings', async () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('check-quality'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
      expect(screen.getByText('Data Quality Warning')).toBeInTheDocument();
    });
  });

  it('should auto-remove non-critical notifications', async () => {
    vi.useFakeTimers();
    
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-notification'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    });

    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('0');
    });

    vi.useRealTimers();
  });

  it('should not auto-remove critical notifications', async () => {
    vi.useFakeTimers();
    
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-critical'));

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    });

    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.getByTestId('notifications-count')).toHaveTextContent('1');
    });

    vi.useRealTimers();
  });
});

describe('NotificationBell', () => {
  it('should render notification bell', () => {
    render(
      <NotificationProvider>
        <NotificationBell />
      </NotificationProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show unread count badge', async () => {
    const TestWrapper = () => {
      const { addNotification } = useNotifications();
      
      return (
        <div>
          <NotificationBell />
          <button 
            onClick={() => addNotification({
              type: 'info',
              title: 'Test',
              message: 'Test'
            })}
            data-testid="add-test"
          >
            Add
          </button>
        </div>
      );
    };

    render(
      <NotificationProvider>
        <TestWrapper />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-test'));

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  it('should open dropdown when clicked', () => {
    render(
      <NotificationProvider>
        <NotificationBell />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Notifications')).toBeInTheDocument();
  });
});

describe('AlertBanner', () => {
  it('should not render when no critical notifications', () => {
    render(
      <NotificationProvider>
        <AlertBanner />
      </NotificationProvider>
    );

    expect(screen.queryByText('Critical Alert')).not.toBeInTheDocument();
  });

  it('should render critical notifications', async () => {
    const TestWrapper = () => {
      const { addNotification } = useNotifications();
      
      return (
        <div>
          <AlertBanner />
          <button 
            onClick={() => addNotification({
              type: 'critical',
              title: 'Critical Alert',
              message: 'This is critical'
            })}
            data-testid="add-critical"
          >
            Add Critical
          </button>
        </div>
      );
    };

    render(
      <NotificationProvider>
        <TestWrapper />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByTestId('add-critical'));

    await waitFor(() => {
      expect(screen.getByText('Critical Alert')).toBeInTheDocument();
    });
  });
});

describe('DataQualityTooltip', () => {
  it('should render children', () => {
    render(
      <DataQualityTooltip quality={85}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should show tooltip on hover', async () => {
    render(
      <DataQualityTooltip quality={85}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Test Content'));

    await waitFor(() => {
      expect(screen.getByText(/Data Quality: Good/)).toBeInTheDocument();
    });
  });

  it('should hide tooltip on mouse leave', async () => {
    render(
      <DataQualityTooltip quality={85}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Test Content'));
    
    await waitFor(() => {
      expect(screen.getByText(/Data Quality: Good/)).toBeInTheDocument();
    });

    fireEvent.mouseLeave(screen.getByText('Test Content'));

    await waitFor(() => {
      expect(screen.queryByText(/Data Quality: Good/)).not.toBeInTheDocument();
    });
  });

  it('should show correct quality labels', async () => {
    const { rerender } = render(
      <DataQualityTooltip quality={95}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Test Content'));
    await waitFor(() => {
      expect(screen.getByText(/Excellent/)).toBeInTheDocument();
    });

    rerender(
      <DataQualityTooltip quality={75}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Test Content'));
    await waitFor(() => {
      expect(screen.getByText(/Good/)).toBeInTheDocument();
    });

    rerender(
      <DataQualityTooltip quality={50}>
        <div>Test Content</div>
      </DataQualityTooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Test Content'));
    await waitFor(() => {
      expect(screen.getByText(/Poor/)).toBeInTheDocument();
    });
  });
});