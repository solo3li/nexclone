import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import HistoryPage from '../page';
import { useHistoryStore } from '../../../../src/store/useHistoryStore';
import { signalRNotificationService } from '../../../../lib/signalr-client';

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('../../../../src/components/Navbar', () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock('../../../../src/components/Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../../../../src/components/MobileBottomNav', () => ({
  default: () => <div data-testid="mobile-bottom-nav">MobileBottomNav</div>,
}));

vi.mock('../../../../src/store/useHistoryStore', () => ({
  useHistoryStore: vi.fn(),
}));

vi.mock('../../../../lib/signalr-client', () => ({
  signalRNotificationService: {
    startConnection: vi.fn(),
    onNotification: vi.fn(),
  },
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, className }: any) => <div onClick={onClick} className={className} data-testid="motion-div">{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('HistoryPage', () => {
  const mockFetchHistory = vi.fn();
  const mockDeleteHistoryItem = vi.fn();
  
  const mockHistoryItems = [
    {
      id: '1',
      type: 'text-to-voice',
      title: 'Project Alpha / audio',
      date: '2023-10-01',
      createdAt: '2023-10-01T10:00:00Z',
      duration: '1:20',
      status: 'completed',
      lang: 'en',
      voice: 'Voice1',
      fileUrl: 'http://example.com/file1.mp3',
      creditsUsed: 5,
    },
    {
      id: '2',
      type: 'gpt',
      title: 'Project Beta / text',
      date: '2023-10-02',
      createdAt: '2023-10-02T10:00:00Z',
      duration: '0:00',
      status: 'processing',
      lang: '-',
      voice: '-',
      fileUrl: '',
      creditsUsed: 0,
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useHistoryStore as any).mockReturnValue({
      historyItems: mockHistoryItems,
      fetchHistory: mockFetchHistory.mockResolvedValue([]),
      deleteHistoryItem: mockDeleteHistoryItem,
    });
    
    global.confirm = vi.fn(() => true);
  });

  it('renders loading state initially', () => {
    // We can not easily test the initial loading state without delaying the promise,
    // but we can mock fetchHistory to never resolve to keep it in loading state
    (useHistoryStore as any).mockReturnValue({
      historyItems: [],
      fetchHistory: () => new Promise(() => {}),
      deleteHistoryItem: mockDeleteHistoryItem,
    });
    
    render(<HistoryPage />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders empty state when no items', async () => {
    (useHistoryStore as any).mockReturnValue({
      historyItems: [],
      fetchHistory: mockFetchHistory.mockResolvedValue([]),
      deleteHistoryItem: mockDeleteHistoryItem,
    });
    
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No operations yet')).toBeInTheDocument();
    });
  });

  it('renders history items successfully', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('audio')).toBeInTheDocument(); // from title split
      expect(screen.getByText('text')).toBeInTheDocument();
    });
  });

  it('filters history items', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('audio')).toBeInTheDocument();
      expect(screen.getByText('text')).toBeInTheDocument();
    });
    
    const filterBtn = screen.getByText('GPT');
    fireEvent.click(filterBtn);
    
    expect(screen.queryByText('audio')).not.toBeInTheDocument();
    expect(screen.getByText('text')).toBeInTheDocument();
  });

  it('handles item deletion', async () => {
    render(<HistoryPage />);
    
    await waitFor(() => {
      expect(screen.getByText('audio')).toBeInTheDocument();
    });
    
    // Find delete buttons (trash icons)
    const deleteButtons = document.querySelectorAll('button:has(svg)');
    // Just finding the first button that acts as delete
    // In our case, the trash button has a hover class with red
    const trashBtn = Array.from(document.querySelectorAll('button')).find(el => el.className.includes('hover:text-red-400'));
    
    if (trashBtn) {
      fireEvent.click(trashBtn);
      
      expect(global.confirm).toHaveBeenCalled();
      expect(mockDeleteHistoryItem).toHaveBeenCalledWith('1');
    }
  });
});
