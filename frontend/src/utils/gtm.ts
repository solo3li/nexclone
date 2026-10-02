// Google Tag Manager & Analytics DataLayer Utilities for NexMedia

declare global {
  interface Window {
    dataLayer?: any[];
  }
}

export const pushDataLayer = (data: Record<string, any>) => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      ...data,
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Tracks virtual page view on client-side route changes in Next.js
 */
export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window === "undefined") return;
  pushDataLayer({
    event: "page_view",
    page_location: window.location.href,
    page_path: pagePath,
    page_title: pageTitle || (typeof document !== "undefined" ? document.title : ""),
  });
};

/**
 * Tracks user authentication events
 */
export const trackUserLogin = (userId: string | number, method: string = "credentials") => {
  pushDataLayer({
    event: "login",
    method,
    user_id: String(userId),
  });
};

export const trackUserSignUp = (userId: string | number, method: string = "credentials") => {
  pushDataLayer({
    event: "sign_up",
    method,
    user_id: String(userId),
  });
};

/**
 * Tracks Tool view and model selection
 */
export const trackToolView = (toolId: string, toolName: string) => {
  pushDataLayer({
    event: "tool_view",
    tool_id: toolId,
    tool_name: toolName,
  });
};

export const trackToolModelChange = (toolId: string, modelId: string, modelName?: string) => {
  pushDataLayer({
    event: "tool_model_change",
    tool_id: toolId,
    model_id: modelId,
    model_name: modelName || modelId,
  });
};

/**
 * Tracks Tool Generation Lifecycle
 */
export interface ToolGenerateStartParams {
  toolId: string;
  modelId?: string;
  resolution?: string;
  aspectRatio?: string;
  duration?: number;
  estimatedCredits?: number;
}

export const trackToolGenerateStart = (params: ToolGenerateStartParams) => {
  pushDataLayer({
    event: "tool_generate_start",
    tool_id: params.toolId,
    model_id: params.modelId,
    resolution: params.resolution,
    aspect_ratio: params.aspectRatio,
    duration: params.duration,
    estimated_credits: params.estimatedCredits,
  });
};

export interface ToolGenerateSuccessParams {
  toolId: string;
  modelId?: string;
  taskId?: string;
  durationSeconds?: number;
}

export const trackToolGenerateSuccess = (params: ToolGenerateSuccessParams) => {
  pushDataLayer({
    event: "tool_generate_success",
    tool_id: params.toolId,
    model_id: params.modelId,
    task_id: params.taskId,
    duration_seconds: params.durationSeconds,
  });
};

export interface ToolGenerateErrorParams {
  toolId: string;
  modelId?: string;
  errorMessage?: string;
}

export const trackToolGenerateError = (params: ToolGenerateErrorParams) => {
  pushDataLayer({
    event: "tool_generate_error",
    tool_id: params.toolId,
    model_id: params.modelId,
    error_message: params.errorMessage,
  });
};

export const trackToolDownload = (params: { toolId: string; format?: string; resolution?: string }) => {
  pushDataLayer({
    event: "tool_result_download",
    tool_id: params.toolId,
    format: params.format,
    resolution: params.resolution,
  });
};

export const trackInsufficientCredits = (params: { toolId: string; requiredCredits?: number; currentBalance?: number }) => {
  pushDataLayer({
    event: "insufficient_credits",
    tool_id: params.toolId,
    required_credits: params.requiredCredits,
    current_balance: params.currentBalance,
  });
};

/**
 * Tracks E-commerce and Subscriptions
 */
export const trackViewPricing = (source: string = "direct") => {
  pushDataLayer({
    event: "view_pricing",
    source,
  });
};

export interface BeginCheckoutParams {
  planId: string;
  planName: string;
  price: number;
  currency?: string;
  billingCycle?: "monthly" | "yearly" | string;
}

export const trackBeginCheckout = (params: BeginCheckoutParams) => {
  pushDataLayer({
    event: "begin_checkout",
    ecommerce: {
      currency: params.currency || "USD",
      value: params.price,
      items: [
        {
          item_id: params.planId,
          item_name: params.planName,
          price: params.price,
          item_category: "subscription",
          item_variant: params.billingCycle || "monthly",
          quantity: 1,
        },
      ],
    },
    plan_id: params.planId,
    plan_name: params.planName,
    price: params.price,
    billing_cycle: params.billingCycle,
  });
};

export interface PurchaseParams {
  transactionId?: string;
  value: number;
  currency?: string;
  planName?: string;
  creditsAdded?: number;
}

export const trackPurchase = (params: PurchaseParams) => {
  pushDataLayer({
    event: "purchase",
    ecommerce: {
      transaction_id: params.transactionId || `tx_${Date.now()}`,
      currency: params.currency || "USD",
      value: params.value,
      items: [
        {
          item_name: params.planName || "Subscription Plan",
          price: params.value,
          item_category: "subscription",
          quantity: 1,
        },
      ],
    },
    transaction_id: params.transactionId,
    value: params.value,
    plan_name: params.planName,
    credits_added: params.creditsAdded,
  });
};

/**
 * Tracks prominent CTA clicks
 */
export const trackCtaClick = (location: string, text: string) => {
  pushDataLayer({
    event: "cta_click",
    cta_location: location,
    cta_text: text,
  });
};
