import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MaintenanceScreen } from '../MaintenanceScreen';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key
}));

describe('MaintenanceScreen', () => {
  it('renders maintenance message', () => {
    render(<MaintenanceScreen />);
    expect(screen.getByText('الموقع تحت الصيانة')).toBeInTheDocument();
  });

  it('renders formatted date when endDate is provided', () => {
    render(<MaintenanceScreen endDate="2030-01-01T12:00:00Z" />);
    expect(screen.getByText('الوقت المتوقع للانتهاء:')).toBeInTheDocument();
  });

  it('reload button works', () => {
    const mockReload = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { reload: mockReload },
      writable: true
    });
    render(<MaintenanceScreen />);
    screen.getByRole('button', { name: /إعادة التحميل/i }).click();
    expect(mockReload).toHaveBeenCalled();
  });
});
