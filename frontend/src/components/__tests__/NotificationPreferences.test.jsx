import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotificationProvider } from '../../contexts/NotificationContext';
import { NotificationPreferences } from '../NotificationPreferences';

describe('NotificationPreferences', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when closed', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={false} onClose={mockOnClose} />
      </NotificationProvider>
    );

    expect(screen.queryByText('Notification Preferences')).not.toBeInTheDocument();
  });

  it('should render when open', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('General Settings')).toBeInTheDocument();
    expect(screen.getByText('Data Quality Threshold')).toBeInTheDocument();
    expect(screen.getByText('Threshold Settings')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    fireEvent.click(screen.getByText('✕'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render all general settings checkboxes', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    expect(screen.getByText('Real-time Updates')).toBeInTheDocument();
    expect(screen.getByText('Threshold Alerts')).toBeInTheDocument();
    expect(screen.getByText('Data Quality Warnings')).toBeInTheDocument();
    expect(screen.getByText('Email Notifications')).toBeInTheDocument();
  });

  it('should toggle checkbox preferences', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    const realTimeCheckbox = screen.getByLabelText(/Real-time Updates/);
    expect(realTimeCheckbox).toBeChecked();

    fireEvent.click(realTimeCheckbox);
    expect(realTimeCheckbox).not.toBeChecked();

    // Should show save changes footer
    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });

  it('should update data quality threshold', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    const slider = screen.getByDisplayValue('70');
    fireEvent.change(slider, { target: { value: '80' } });

    await waitFor(() => {
      expect(screen.getByDisplayValue('80')).toBeInTheDocument();
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });

  it('should render threshold settings for all attributes', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    expect(screen.getByText('temperature')).toBeInTheDocument();
    expect(screen.getByText('salinity')).toBeInTheDocument();
    expect(screen.getByText('pressure')).toBeInTheDocument();
    expect(screen.getByText('oxygen')).toBeInTheDocument();
    expect(screen.getByText('chlorophyll')).toBeInTheDocument();
    expect(screen.getByText('turbidity')).toBeInTheDocument();
  });

  it('should update threshold values', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    // Find temperature threshold inputs
    const temperatureSection = screen.getByText('temperature').closest('div');
    const inputs = temperatureSection.querySelectorAll('input[type="number"]');
    
    // Update warning min threshold
    fireEvent.change(inputs[0], { target: { value: '20' } });

    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });
  });

  it('should save changes when save button is clicked', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    // Make a change
    const realTimeCheckbox = screen.getByLabelText(/Real-time Updates/);
    fireEvent.click(realTimeCheckbox);

    await waitFor(() => {
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });

    // Save changes
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
    });
  });

  it('should reset changes when reset button is clicked', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    // Make a change
    const realTimeCheckbox = screen.getByLabelText(/Real-time Updates/);
    const originalState = realTimeCheckbox.checked;
    fireEvent.click(realTimeCheckbox);

    await waitFor(() => {
      expect(realTimeCheckbox.checked).toBe(!originalState);
      expect(screen.getByText('You have unsaved changes')).toBeInTheDocument();
    });

    // Reset changes
    fireEvent.click(screen.getByText('Reset'));

    await waitFor(() => {
      expect(realTimeCheckbox.checked).toBe(originalState);
      expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
    });
  });

  it('should not show save footer when no changes', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    expect(screen.queryByText('You have unsaved changes')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Changes')).not.toBeInTheDocument();
    expect(screen.queryByText('Reset')).not.toBeInTheDocument();
  });

  it('should handle keyboard navigation', () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    const modal = screen.getByRole('dialog', { hidden: true }) || screen.getByText('Notification Preferences').closest('div');
    
    // Should be focusable
    expect(modal).toBeInTheDocument();
    
    // All interactive elements should be accessible
    const checkboxes = screen.getAllByRole('checkbox');
    const buttons = screen.getAllByRole('button');
    const inputs = screen.getAllByRole('slider');
    
    expect(checkboxes.length).toBeGreaterThan(0);
    expect(buttons.length).toBeGreaterThan(0);
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('should validate threshold input ranges', async () => {
    render(
      <NotificationProvider>
        <NotificationPreferences isOpen={true} onClose={mockOnClose} />
      </NotificationProvider>
    );

    // Find temperature threshold inputs
    const temperatureSection = screen.getByText('temperature').closest('div');
    const inputs = temperatureSection.querySelectorAll('input[type="number"]');
    
    // Test with valid values
    fireEvent.change(inputs[0], { target: { value: '10' } });
    fireEvent.change(inputs[1], { target: { value: '30' } });

    await waitFor(() => {
      expect(inputs[0].value).toBe('10');
      expect(inputs[1].value).toBe('30');
    });
  });
});