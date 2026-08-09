import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TextToVoicePage from '../text-to-voice/page';

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

vi.mock('../../../../src/store/useAppStore', () => ({
  useAppStore: () => ({
    user: { availableCredits: 100 },
    isAuthenticated: true,
    hasPhoneNumber: true,
    setUser: vi.fn(),
    updateUser: vi.fn(),
  }),
}));

vi.mock('../../../../src/store/useToolsStore', () => ({
  useToolsStore: () => ({
    estimateTextToVoice: vi.fn().mockResolvedValue({ estimatedCost: 1 }),
    generateTextToVoice: vi.fn().mockResolvedValue({ taskId: '123' }),
  }),
}));

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
}));

vi.mock('../../../../src/i18n/routing', () => ({
  useRouter: () => ({ push: vi.fn() }),
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

vi.mock('../../../../src/utils/api', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [] }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  }
}));

vi.mock('framer-motion', () => ({
  motion: { 
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('TextToVoicePage', () => {
  it('renders textarea and options', async () => {
    render(<TextToVoicePage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument();
    });

    expect(screen.getByText('enterText')).toBeInTheDocument();
    expect(screen.getByText('voiceSettings')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
