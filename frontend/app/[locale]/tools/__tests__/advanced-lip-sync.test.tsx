import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdvancedLipSyncPage from '../advanced-lip-sync/page';

// Mock next/dynamic
vi.mock('next/dynamic', () => ({
  default: (loader: any) => {
    const DynamicComponent = React.lazy(async () => { const res = await loader(); return res.default ? res : { default: res }; });
    return function SuspenseWrapper(props: any) {
      return (
        <React.Suspense fallback={<div data-testid="suspense-fallback">Loading...</div>}>
          <DynamicComponent {...props} />
        </React.Suspense>
      );
    };
  }
}));

// Mock store
vi.mock('../../../../src/store/useAppStore', () => ({
  useAppStore: () => ({
    user: { activePlan: { lipSyncCostPerGeneration: 1 } },
    isAuthenticated: true,
    setUser: vi.fn(),
  }),
}));

vi.mock('../../../../src/store/useToolsStore', () => ({
  useToolsStore: () => ({
    startLipsync: vi.fn().mockResolvedValue({ id: 'task-123' }),
  }),
}));

// Mock intl & routing
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('../../../../src/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn() }),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock API
vi.mock('../../../../src/utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  }
}));

// Mock UI components
vi.mock('framer-motion', () => ({
  motion: { 
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('AdvancedLipSyncPage', () => {
  it('renders correctly and shows upload zones', async () => {
    render(<AdvancedLipSyncPage />);
    
    // Wait for lazy component to resolve
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Upload Video')).toBeInTheDocument();
    expect(screen.getByText('Upload Audio File')).toBeInTheDocument();
  });

  it('generate button is disabled initially', async () => {
    render(<AdvancedLipSyncPage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument();
    });

    const generateBtn = screen.getByRole('button', { name: /generate/i });
    expect(generateBtn).toBeDisabled();
  });
});
