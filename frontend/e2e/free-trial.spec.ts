import { test, expect } from '@playwright/test';

test.describe('Free Trial Workflow', () => {
  test('User can start a free trial', async ({ page }) => {
    await page.goto('/ar/pricing');
    
    const startTrialButton = page.locator('button:has-text("ابدأ التجربة المجانية")');
    await expect(startTrialButton).toBeVisible();
    
    await startTrialButton.click();
    
    // Verify redirection to trial signup or dashboard
    await expect(page).toHaveURL(/.*trial.*/);
  });
});
