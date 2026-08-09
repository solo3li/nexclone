import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GoogleAuthProviderWrapper } from '../GoogleAuthProviderWrapper';

vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }: any) => <div data-testid="google-provider">{children}</div>
}));

describe('GoogleAuthProviderWrapper', () => {
  it('renders children without provider if clientId is null', () => {
    render(
      <GoogleAuthProviderWrapper clientId={null}>
        <div data-testid="child">Child Content</div>
      </GoogleAuthProviderWrapper>
    );
    expect(screen.queryByTestId('google-provider')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders children with provider if clientId is provided', () => {
    render(
      <GoogleAuthProviderWrapper clientId="my-client-id">
        <div data-testid="child">Child Content</div>
      </GoogleAuthProviderWrapper>
    );
    expect(screen.getByTestId('google-provider')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
