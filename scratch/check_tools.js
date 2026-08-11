const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error')
      console.log(`PAGE LOG: ${msg.text()}`);
  });
  page.on('pageerror', error => {
    console.log(`PAGE ERROR: ${error.message}`);
  });

  await page.goto('http://localhost:3000/en/tools');
  await page.waitForTimeout(3000);
  
  await browser.close();
})();
