import { test, expect } from '@playwright/test';

test.describe('Authentication Workflow', () => {
  test('Login form validation works correctly', async ({ page }) => {
    // Navigate to the login page (Arabic locale by default)
    await page.goto('/ar/login');

    // Verify page has loaded
    await expect(page.locator('text=تسجيل الدخول')).toBeVisible();

    // Find the email and password inputs
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    // Find the submit button
    const submitButton = page.locator('button:has-text("تسجيل الدخول")');

    // Click submit without entering anything to trigger validation
    await submitButton.click();

    // Check if error messages appear
    await expect(page.locator('text=البريد الإلكتروني مطلوب')).toBeVisible();
    await expect(page.locator('text=كلمة المرور مطلوبة')).toBeVisible();

    // Enter invalid email
    await emailInput.fill('invalidemail');
    await emailInput.blur();
    await expect(page.locator('text=البريد الإلكتروني غير صالح')).toBeVisible();

    // Enter valid email and short password
    await emailInput.fill('test@example.com');
    await passwordInput.fill('123');
    await passwordInput.blur();
    
    // Check short password error
    await expect(page.locator('text=كلمة المرور قصيرة جداً')).toBeVisible();
  });
});
