import { test, expect } from '@playwright/test';

test.describe('AI Tools Workflow', () => {
  test('User can access and use AI Tools', async ({ page }) => {
    await page.goto('/ar/ai-tools');
    
    await expect(page.locator('text=أدوات الذكاء الاصطناعي')).toBeVisible();
    
    // Select a tool, for example Text to Speech
    const ttsTool = page.locator('a:has-text("تحويل النص إلى صوت")');
    await ttsTool.click();
    
    await expect(page).toHaveURL(/.*text-to-speech.*/);
    
    const textInput = page.locator('textarea[name="text"]');
    await textInput.fill('مرحبا بك في تطبيقنا');
    
    const generateButton = page.locator('button:has-text("توليد")');
    await generateButton.click();
    
    // Wait for output audio player
    await expect(page.locator('audio')).toBeVisible({ timeout: 10000 });
  });
});
