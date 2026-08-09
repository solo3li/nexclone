import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolsPage from '../page';

// Mock Next.js routing and intl
vi.mock('next-intl', () => ({
  useLocale: () => 'en',
  useTranslations: () => (key: string) => key,
}));

vi.mock('../../../../src/i18n/routing', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));

describe('ToolsPage', () => {
  it('renders the tools page header', () => {
    render(<ToolsPage />);
    expect(screen.getByText('Welcome to')).toBeInTheDocument();
    expect(screen.getByText('Tools Studio')).toBeInTheDocument();
  });

  it('renders all tool links', () => {
    render(<ToolsPage />);
    expect(screen.getByText('Text to Voice')).toBeInTheDocument();
    expect(screen.getByText('Voice to Text')).toBeInTheDocument();
    expect(screen.getByText('Avatar to Video')).toBeInTheDocument();
    expect(screen.getByText('Advanced Lip Sync')).toBeInTheDocument();
  });
});
