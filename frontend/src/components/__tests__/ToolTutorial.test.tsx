import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ToolTutorialButton, ToolTutorialModal } from '../ToolTutorial';
import { NextIntlClientProvider } from 'next-intl';

describe('ToolTutorial', () => {
  const renderWithIntl = (ui: React.ReactElement, locale = 'en') => {
    return render(
      <NextIntlClientProvider locale={locale} messages={{}}>
        {ui}
      </NextIntlClientProvider>
    );
  };

  it('renders button correctly', () => {
    const onClick = vi.fn();
    renderWithIntl(<ToolTutorialButton onClick={onClick} />);
    expect(screen.getByText('How to use?')).toBeInTheDocument();
  });

  it('renders modal with steps', () => {
    const steps = [
      { title: 'Step 1', description: 'Desc 1' },
      { title: 'Step 2', description: 'Desc 2' },
    ];
    renderWithIntl(
      <ToolTutorialModal toolKey="test" steps={steps} isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByText('Desc 1')).toBeInTheDocument();
  });
});
