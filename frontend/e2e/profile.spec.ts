import { test, expect } from '@playwright/test';

test.describe('Profile Management Workflow', () => {
  test('User can update profile information', async ({ page }) => {
    // Navigate to profile (assuming user is logged in via state or mocking)
    await page.goto('/ar/profile');
    
    await expect(page.locator('text=الملف الشخصي')).toBeVisible();
    
    const nameInput = page.locator('input[name="name"]');
    await nameInput.fill('Updated Name');
    
    const saveButton = page.locator('button:has-text("حفظ التغييرات")');
    await saveButton.click();
    
    await expect(page.locator('text=تم تحديث الملف الشخصي بنجاح')).toBeVisible();
  });
});
