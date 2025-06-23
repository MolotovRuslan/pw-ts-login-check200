import { expect, Page, /* request */ } from '@playwright/test';
import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
import { TOKEN, CHAT_ID } from '../utils/telegram';







// ✅ Checks that the element has the expected font-family
export async function checkFontStyle(page: Page, selector: string, expectedFont: string) {
  const font = await page.locator(selector).evaluate(el => getComputedStyle(el).fontFamily);
  console.log(`CSS Font: ${font}`);
  expect(font).toContain(expectedFont);
}

// ✅ Checks that the sum of element's height and width is between expectedSum and expectedSum * 1.1
export async function checkElementSize(page: Page, selector: string, expectedSum: number) {
  const box = await page.locator(selector).boundingBox();
  expect(box).not.toBeNull();
  const actualSum = (box?.height || 0) + (box?.width || 0);
  console.log(`Element Size: ${actualSum}`);
  expect(actualSum).toBeGreaterThanOrEqual(expectedSum);
  expect(actualSum).toBeLessThanOrEqual(expectedSum * 1.1);
}

// ✅ Checks that the sum of height and width is exactly equal to the specified value
export async function checkElementSizeExact(page: Page, selector: string, exactSum: number) {
  const box = await page.locator(selector).boundingBox();
  const actualSum = (box?.height || 0) + (box?.width || 0);
  expect(actualSum).toBe(exactSum);
}

// ✅ Checks that the height of the element is within ±10% of the expected value
export async function checkElementHeightInRange(page: Page, selector: string, expected: number) {
  const box = await page.locator(selector).boundingBox();
  const height = box?.height || 0;
  expect(height).toBeGreaterThanOrEqual(expected);
  expect(height).toBeLessThanOrEqual(expected * 1.1);
}

// ✅ Checks that the height of the element is exactly equal to the expected value
export async function checkElementHeightExact(page: Page, selector: string, expected: number) {
  const box = await page.locator(selector).boundingBox();
  const height = box?.height || 0;
  expect(height).toBe(expected);
}

// ✅ Checks that the element is visible on the page
export async function expectToBeVisible(page: Page, selector: string) {
  await expect(page.locator(selector)).toBeVisible();
}

// ✅ Scrolls to the specified element
export async function scrollTo(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
}

// ✅ Checks that the element contains the exact expected text
export async function expectToHaveText(page: Page, selector: string, expectedText: string) {
  const text = await page.locator(selector).innerText();
  expect(text).toBe(expectedText);
}

// ✅ Checks that the number of matched elements is exactly as expected
export async function expectElementCount(page: Page, selector: string, expectedCount: number) {
  const count = await page.locator(selector).count();
  expect(count).toBe(expectedCount);
}

// ✅ Checks that the number of matched elements is within a given range
export async function expectElementCountInRange(page: Page, selector: string, min: number, max: number) {
  const count = await page.locator(selector).count();
  console.log(`Found elements: ${count}`);
  expect(count).toBeGreaterThanOrEqual(min);
  expect(count).toBeLessThanOrEqual(max);
}

// ✅ Checks that a given text does not exist in the HTML content at a specific URL
export async function notExistInHtml(url: string, text: string) {
  const res = await fetch(url);
  const html = await res.text();
  expect(html.includes(text)).toBeFalsy();
}

// ✅ Clicks on the specified element
export async function clickElement(page: Page, selector: string) {
  await page.locator(selector).click();
}

// ✅ Fills an input field with the specified value
export async function fillInput(page: Page, selector: string, value: string) {
  await page.locator(selector).fill(value);
}

// ✅ Waits until the element becomes visible (default timeout: 25s)
export async function waitForVisible(page: Page, selector: string, timeout = 25000) {
  await page.locator(selector).waitFor({ state: 'visible', timeout });
}

// ✅ Scrolls the browser window by the given X and Y coordinates
export async function scrollXY(page: Page, x: number, y: number) {
  await page.evaluate(([x, y]) => window.scrollTo(x, y), [x, y]);
}

// ✅ Smoke test for the page: checks SEO elements, DOM structure, and images
export async function globalSmoke(page: Page, url: string) {
  await page.goto(url);
  await expect(page.locator('head title')).toBeVisible();
  await expect(page.locator("meta[name='description']")).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  await expect(page.locator('header, div header')).toBeVisible();
  await expect(page.locator('div.logo, .header_logo')).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
  const images = page.locator('img');
  console.log(`Images: ${await images.count()}`);
  // Add assertions for image states if needed
}

// ✅ Requests PageSpeed metrics and sends them to Telegram

interface PageSpeedResponse {
  lighthouseResult: {
    categories: {
      performance: {
        score: number;
      };
    };
    audits: {
      'first-contentful-paint': { displayValue: string };
      'largest-contentful-paint': { displayValue: string };
      'cumulative-layout-shift': { displayValue: string };
    };
  };
}

export async function checkPageSpeed(
  url: string,
  name: string,
  pageLink: string,
  allureLink: string
) {
  const response = await fetch(
    `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${url}&key=AIzaSyA_VaYEFHz4MywivC55-v5FXvFnuiURXuE&strategy=mobile`
  );
  const data = (await response.json()) as PageSpeedResponse;

  const mobScore = Math.round(data.lighthouseResult.categories.performance.score * 100);
  const fcp = data.lighthouseResult.audits['first-contentful-paint'].displayValue;
  const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
  const cls = data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;

  const message = `PageSpeed: ${name}\n${pageLink}\nMob Score: ${mobScore}\nFCP: ${fcp}\nLCP: ${lcp}\nCLS: ${cls}\nAllure: ${allureLink}`;
  console.log(message);

  const bot = new TelegramBot(TOKEN, { polling: true });
  await bot.sendMessage(CHAT_ID, message);
}

export async function checkLinksStatus(array: string[]) {
  const bot = new TelegramBot(TOKEN, { polling: true });

  for (const url of array) {
    const res = await fetch(url);
    console.log(`URL: ${url} - Status: ${res.status}`);

    if (res.status !== 200) {
      const msg = `Site ${url} returned status ${res.status}`;
      await bot.sendMessage(CHAT_ID, msg);
      expect(res.status).toBe(200);
    }
  }
}

