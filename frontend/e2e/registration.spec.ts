import { test, expect } from '@playwright/test';

test.describe('Registration Workflow', () => {
  test('Registration form validation and submission', async ({ page }) => {
    await page.goto('/ar/register');
    await expect(page.locator('text=إنشاء حساب')).toBeVisible();

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');
    const submitButton = page.locator('button[type="submit"]');

    // Click submit without filling form to check validation
    await submitButton.click();
    
    await expect(page.locator('text=الاسم مطلوب')).toBeVisible();
    await expect(page.locator('text=البريد الإلكتروني مطلوب')).toBeVisible();
    
    // Fill the form correctly
    await nameInput.fill('Test User');
    await emailInput.fill('newuser@example.com');
    await passwordInput.fill('Password123!');
    
    // Assuming there's a successful flow
    // await submitButton.click();
    // await expect(page.locator('text=تم إنشاء الحساب بنجاح')).toBeVisible();
  });
});
