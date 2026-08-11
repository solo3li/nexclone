// Centralized API Endpoints Registry

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  LOGOUT: "/api/auth/logout",
  ME: "/api/auth/me",
  VERIFY_EMAIL: "/api/auth/verify-email",
  RESEND_VERIFICATION: "/api/auth/resend-verification",
  RESEND_COOLDOWN: (email: string) => `/api/auth/resend-cooldown?email=${encodeURIComponent(email)}`,
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  RESET_PASSWORD: "/api/auth/reset-password",
  GOOGLE_LOGIN: "/api/auth/google-login",
  ADD_PHONE: "/api/auth/add-phone",

  // Profile
  PROFILE: "/api/profile",
  CHANGE_PASSWORD: "/api/profile/change-password",
  
  // Settings & Public
  SETTINGS_PUBLIC: "/api/settings/public",
  CUSTOM_PAGE: (slug: string) => `/api/platform/custom-page/${slug}`,
  SOCIAL_LINKS: "/api/platform/social-links",
  
  // Plans & Payment
  PLANS: "/api/platform/plans",
  PAYMENT_METHODS: "/api/platform/payment-methods",
  CHECKOUT_GATEWAYS: (planId: number | string) => `/api/checkout/gateways/${planId}`,
  MANUAL_PAYMENT_METHODS: "/api/manualpayments/methods",
  MY_INVOICES: "/api/invoices/my-invoices",
  VERIFY_INVOICE: (token: string) => `/api/invoices/verify/${token}`,
  
  // History
  HISTORY: "/api/history",
  HISTORY_DETAILS: (id: string) => `/api/history/${id}`,
  
  // Tickets
  TICKETS: "/api/tickets",
  TICKET_DETAILS: (id: string) => `/api/tickets/${id}`,
  TICKETS_CREATE: '/api/tickets',
  TICKET_MESSAGE: (id: string) => `/api/tickets/${id}/message`,

  // Blog
  BLOG: "/api/blog",
  BLOG_DETAILS: (id: string) => `/api/blog/${id}`,
  BLOG_COMMENT: (id: string) => `/api/blog/${id}/comments`,
  BLOG_COMMENTS: (id: string) => `/api/blog/${id}/comments`,
  
  // AI Tools — Platform Configs
  VOICES: "/api/platform/voices",
  DIALECTS: "/api/platform/dialects",
  EMOTIONS: "/api/platform/emotions",
  STYLES: "/api/platform/styles",
  TTS_CONFIG: "/api/platform/tts-config",
  VTT_CONFIG: "/api/platform/vtt-config",

  // AI Tools — Estimate & Execute (canonical names)
  VOICE_TO_TEXT_ESTIMATE: '/api/ai/voice-to-text/estimate',
  VOICE_TO_TEXT_GENERATE: '/api/ai/voice-to-text/transcribe',
  TEXT_TO_VOICE_ESTIMATE: '/api/ai/text-to-voice/estimate',
  TEXT_TO_VOICE_GENERATE: '/api/ai/text-to-voice/generate',
  VIDEO_START_AVATAR: '/api/video/start-avatar',
  VIDEO_START_LIPSYNC: '/api/video/start-lipsync',
  VIDEO_START_MOTION: '/api/video/start-motion-control',

  ESTIMATE_AVATAR: (qs: string) => `/api/video/estimate-avatar${qs}`,
  ESTIMATE_LIPSYNC: (qs: string) => `/api/video/estimate-lipsync${qs}`,
  ESTIMATE_MOTION_CONTROL: (qs: string) => `/api/video/estimate-motion-control${qs}`,
  ESTIMATE_VTT: '/api/ai/voice-to-text/estimate',
  ESTIMATE_TTS: '/api/ai/text-to-voice/estimate',

  VIDEO_STATUS: (taskId: string) => `/api/video/status/${taskId}`,
};
