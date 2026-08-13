import { test, expect } from '@playwright/test';
import { previews } from './preview.config';
import fs from 'fs';
import path from 'path';

test.describe('Marketing Previews', () => {
  for (const preview of previews) {
    for (const theme of ['light', 'dark']) {
      test(`Capture ${preview.id} (${theme})`, async ({ page, context }) => {
        const ext = path.extname(preview.output);
        const base = preview.output.substring(0, preview.output.length - ext.length);
        const output = `${base}-${theme}${ext}`;

        const outputDir = path.dirname(output);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        await page.setViewportSize(preview.viewport);

        await page.addInitScript((themeArg) => {
          window.localStorage.setItem('theme', themeArg);
          window.localStorage.setItem('cookieConsent', 'true');
          
          const observer = new MutationObserver(() => {
            const portals = document.querySelectorAll('nextjs-portal, nextjs-dev-overlay, [data-nextjs-toast]');
            portals.forEach(p => p.remove());
          });
          observer.observe(document.documentElement, { childList: true, subtree: true });
        }, theme);

        await page.goto(`http://localhost:3000${preview.route}`, { waitUntil: 'networkidle' });
        
        await page.waitForTimeout(2000);

        await page.evaluate(() => {
          const style = document.createElement('style');
          style.innerHTML = `
            *, *::before, *::after {
              animation: none !important;
              transition: none !important;
            }
            nextjs-portal, #__next-build-watcher, [data-nextjs-toast] {
              display: none !important;
              opacity: 0 !important;
              visibility: hidden !important;
            }
          `;
          document.head.appendChild(style);
        });

        await page.screenshot({ path: output, fullPage: false });
        console.log(`Successfully captured ${preview.id} (${theme}) -> ${output}`);
      });
    }
  }
});
