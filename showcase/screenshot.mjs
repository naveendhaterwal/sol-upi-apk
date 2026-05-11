import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 }, // iPhone 13 dimensions
    deviceScaleFactor: 2,
  });
  
  // Wait for the Expo app to load
  console.log("Navigating to http://localhost:8081...");
  await page.goto('http://localhost:8081', { waitUntil: 'networkidle' });
  
  // Wait an extra second for animations/fonts
  await page.waitForTimeout(2000);
  
  // Take screenshot
  console.log("Taking screenshot...");
  await page.screenshot({ path: 'public/app-demo.png' });
  
  await browser.close();
  console.log("Saved to public/app-demo.png");
})();
