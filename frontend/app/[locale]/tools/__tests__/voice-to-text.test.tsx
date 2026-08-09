import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import VoiceToTextPage from '../voice-to-text/page';

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
  }),
}));

vi.mock('../../../../src/store/useToolsStore', () => ({
  useToolsStore: () => ({
    startVoiceToText: vi.fn(),
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
    get: vi.fn().mockResolvedValue({ data: {} }),
  }
}));

vi.mock('framer-motion', () => ({
  motion: { 
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('VoiceToTextPage', () => {
  it('renders successfully', async () => {
    render(<VoiceToTextPage />);
    
    await waitFor(() => {
      expect(screen.queryByTestId('suspense-fallback')).not.toBeInTheDocument();
    });

    // Just check if the component mounts without crashing
    // and wait for it to load.
    expect(document.body).toBeDefined();
  });
});
