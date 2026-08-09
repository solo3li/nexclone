import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ToolsSection from '../ToolsSection';
import { NextIntlClientProvider } from 'next-intl';

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}));

vi.mock('../../i18n/routing', () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  useRouter: () => ({ push: vi.fn() }),
}));

describe('ToolsSection', () => {
  const renderWithIntl = (ui: React.ReactElement, locale = 'en') => {
    return render(
      <NextIntlClientProvider locale={locale} messages={{
        Tools: {
          badge: "badge",
          title: "title",
          subtitle: "subtitle",
          useTool: "useTool",
          startUsing: "startUsing",
          list: {
            t1: { title: "t1 title", desc: "t1 desc", badge: "t1 badge", tags: ["tag1"] },
            t2: { title: "t2 title", desc: "t2 desc", badge: "t2 badge", tags: ["tag2"] },
            t10: { title: "t10 title", desc: "t10 desc", badge: "t10 badge", tags: ["tag10"] },
          }
        }
      }}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it('renders tool cards', () => {
    renderWithIntl(<ToolsSection />);
    expect(screen.getByText('title')).toBeInTheDocument();
    expect(screen.getByText('subtitle')).toBeInTheDocument();
    expect(screen.getByText('t1 title')).toBeInTheDocument();
    expect(screen.getByText('Advanced Lip-Sync')).toBeInTheDocument();
  });
});
