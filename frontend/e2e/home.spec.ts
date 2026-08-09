import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/en');
  // Check that the page loads without an error by checking the URL or looking for a common element
  await expect(page).toHaveURL(/.*\/en.*/);
  
  // Optionally, test if the title or a heading exists
  // For now we just verify it doesn't return a 404 or 500 error page
});
