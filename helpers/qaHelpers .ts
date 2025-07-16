import { expect, Page, APIRequestContext /* request */ } from '@playwright/test';
import { fetch } from 'undici';

import { sendToSlack } from '../utils/slack';
import { sendToTelegram } from '../utils/telegram';
import { escapeMarkdown } from '../utils/telegram';



class mf {



  // ✅ 1: Checks that the element has the expected font-family
  async checkFontStyle(page: Page, selector: string, expectedFont: string) {
    const font = await page.locator(selector).evaluate(el => getComputedStyle(el).fontFamily);
    console.log(`CSS Font: ${font}`);
    expect(font).toContain(expectedFont);
  }

  // ✅ 2: Checks that the sum of element's height and width is between expectedSum and expectedSum * 1.1
    async checkElementSize(page: Page, selector: string, expectedSum: number) {
    const box = await page.locator(selector).boundingBox();
    expect(box).not.toBeNull();
    const actualSum = (box?.height || 0) + (box?.width || 0);
    console.log(`Element Size: ${actualSum}`);
    expect(actualSum).toBeGreaterThanOrEqual(expectedSum);
    expect(actualSum).toBeLessThanOrEqual(expectedSum * 1.1);
  }

  // ✅ 3: Checks that the sum of height and width is exactly equal to the specified value
    async checkElementSizeExact(page: Page, selector: string, exactSum: number) {
    const box = await page.locator(selector).boundingBox();
    const actualSum = (box?.height || 0) + (box?.width || 0);
    expect(actualSum).toBe(exactSum);
  }

  // ✅ 4: Checks that the height of the element is within ±10% of the expected value
    async  checkElementHeightInRange(page: Page, selector: string, expected: number) {
    const box = await page.locator(selector).boundingBox();
    const height = box?.height || 0;
    expect(height).toBeGreaterThanOrEqual(expected);
    expect(height).toBeLessThanOrEqual(expected * 1.1);
  }

  // ✅ 5: Checks that the height of the element is exactly equal to the expected value
    async checkElementHeightExact(page: Page, selector: string, expected: number) {
    const box = await page.locator(selector).boundingBox();
    const height = box?.height || 0;
    expect(height).toBe(expected);
  }

  // ✅ 6: Checks that the element is visible on the page
    async expectToBeVisible(page: Page, selector: string) {
    await expect(page.locator(selector)).toBeVisible();
  }

  // ✅ 7: Scrolls to the specified element
    async scrollTo(page: Page, selector: string) {
    await page.locator(selector).scrollIntoViewIfNeeded();
  }

  // ✅ 8: Checks that the element contains the exact expected text
    async expectToHaveText(page: Page, selector: string, expectedText: string) {
    const text = await page.locator(selector).innerText();
    expect(text).toBe(expectedText);
  }

  // ✅ 9: Checks that the number of matched elements is exactly as expected
    async expectElementCount(page: Page, selector: string, expectedCount: number) {
    const count = await page.locator(selector).count();
    expect(count).toBe(expectedCount);
  }

  // ✅ 10: Checks that the number of matched elements is within a given range
    async expectElementCountInRange(page: Page, selector: string, min: number, max: number) {
    const count = await page.locator(selector).count();
    console.log(`Found elements: ${count}`);
    expect(count).toBeGreaterThanOrEqual(min);
    expect(count).toBeLessThanOrEqual(max);
  }

  // ✅ 11: Checks that a given text does not exist in the HTML content at a specific URL
  async notExistInHtml(url: string, text: string) {
    const res = await fetch(url);
    const html = await res.text();
    expect(html.includes(text)).toBeFalsy();
  }

  // ✅ 12: Clicks on the specified element
    async clickElement(page: Page, selector: string) {
    await page.locator(selector).click();
  }

  // ✅ 13: Fills an input field with the specified value
    async fillInput(page: Page, selector: string, value: string) {
    await page.locator(selector).fill(value);
  }

  // ✅ 14: Waits until the element becomes visible (default timeout: 25s)
    async waitForVisible(page: Page, selector: string, timeout = 25000) {
    await page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  // ✅ 15: Scrolls the browser window by the given X and Y coordinates
    async scrollXY(page: Page, x: number, y: number) {
    await page.evaluate(([x, y]) => window.scrollTo(x, y), [x, y]);
  }

  // ✅ 16: Smoke test for the page: checks SEO elements, DOM structure, and images
    async globalSmoke(page: Page, url: string) {
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

  // ✅ 17: Array links status 200
  async linkArrayStatus200(request: APIRequestContext, links: { name: string; url: string }[]) {
    const failedLinks: string[] = [];

    for (const { name, url } of links) {
      try {
        const response = await request.get(url);
        const status = response.status();
        console.log(`${name} - ${status}`);

        if (status !== 200) {
          const msgRaw = `❌ *${await escapeMarkdown(name)}* ${url}\nStatus code: *${status}*`;
          failedLinks.push(msgRaw);
          await sendToTelegram(msgRaw);
          await sendToSlack(msgRaw);
        }

      } catch (error) {
        const errorMessage = await escapeMarkdown((error as Error).message);
        const errMsgRaw = `⛔ *${await escapeMarkdown(name)}* ${url}\nRequest failed: ${errorMessage}`;
        failedLinks.push(errMsgRaw);
        await sendToTelegram(errMsgRaw);
        await sendToSlack(errMsgRaw);
      }
    }

    if (failedLinks.length === 0) {
      await sendToTelegram('✅ All links for landkind.de Status: 200');
      await sendToSlack('✅ All links for landkind.de Status: 200');
    }

  }


  // ✅ 18: Requests PageSpeed metrics and sends them to Telegram
  async checkPageSpeed(
    url: string,
    name: string,
    pageLink: string,
    allureLink: string
  ) {
    const response = await fetch(
      `https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
        url
      )}&key=YOUR_API_KEY&strategy=mobile`
    );

    if (!response.ok) {
      throw new Error(`PageSpeed API returned status ${response.status}`);
    }

    const data = await response.json() as any;

    const mobScore = Math.round(data.lighthouseResult.categories.performance.score * 100);
    const fcp = data.lighthouseResult.audits['first-contentful-paint'].displayValue;
    const lcp = data.lighthouseResult.audits['largest-contentful-paint'].displayValue;
    const cls = data.lighthouseResult.audits['cumulative-layout-shift'].displayValue;

    console.log(`Mobile Score: ${mobScore}`);

    const msg = `PageSpeed Report: ${name}\n${pageLink}\n\n` +
      `📱 Mobile Score: ${mobScore}\n` +
      `⏱️ FCP: ${fcp}\n` +
      `🖼️ LCP: ${lcp}\n` +
      `⚖️ CLS: ${cls}\n\n` +
      `Allure Report: ${allureLink}`;

    console.log(msg);

    await sendToTelegram(await escapeMarkdown(msg));
  }

}

export default new mf();