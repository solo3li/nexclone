import { test, expect } from '@playwright/test';

test.describe('Billing & Pricing Workflow', () => {
  test('User can view pricing plans and select a plan', async ({ page }) => {
    await page.goto('/ar/pricing');
    
    await expect(page.locator('text=خطط الأسعار')).toBeVisible();
    
    const proPlanButton = page.locator('button:has-text("الاشتراك في برو")');
    await expect(proPlanButton).toBeVisible();
    
    await proPlanButton.click();
    
    // Verify checkout page
    await expect(page).toHaveURL(/.*checkout.*/);
  });
});
