// ─── NexMedia Design System ──────────────────────────────────────────────────
// Deep dark theme with vibrant purple accent, glass cards, and rich typography.

const PURPLE = '#9B51E0';
const PURPLE_LIGHT = '#C084FC';
const PURPLE_DARK = '#6D28D9';
const INDIGO = '#4F46E5';

export const Palette = {
  // Brand
  purple: PURPLE,
  purpleLight: PURPLE_LIGHT,
  purpleDark: PURPLE_DARK,
  indigo: INDIGO,

  // Backgrounds
  bg0: '#0D0D12',   // deepest
  bg1: '#13131A',   // page background
  bg2: '#1C1C28',   // card background
  bg3: '#252535',   // elevated card / input
  bg4: '#2E2E42',   // subtle borders

  // Text
  white: '#FFFFFF',
  textPrimary: '#F0F0FF',
  textSecondary: '#8888AA',
  textMuted: '#555570',

  // Status
  success: '#22C55E',
  successBg: 'rgba(34, 197, 94, 0.12)',
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.12)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.12)',

  // Borders & glass
  border: 'rgba(255, 255, 255, 0.08)',
  borderActive: 'rgba(155, 81, 224, 0.5)',
  glass: 'rgba(255, 255, 255, 0.04)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',

  // Overlay / gradients (used in LinearGradient)
  gradientPurple: ['#9B51E0', '#4F46E5'] as const,
  gradientDark: ['#1C1C28', '#0D0D12'] as const,
  gradientCard: ['rgba(28,28,40,0.95)', 'rgba(13,13,18,0.95)'] as const,
};

export default {
  light: {
    text: Palette.textPrimary,
    textSecondary: Palette.textSecondary,
    background: Palette.bg1,
    cardBackground: Palette.bg2,
    tint: Palette.purple,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.purple,
    border: Palette.border,
  },
  dark: {
    text: Palette.textPrimary,
    textSecondary: Palette.textSecondary,
    background: Palette.bg1,
    cardBackground: Palette.bg2,
    tint: Palette.purple,
    tabIconDefault: Palette.textMuted,
    tabIconSelected: Palette.purple,
    border: Palette.border,
  },
};
