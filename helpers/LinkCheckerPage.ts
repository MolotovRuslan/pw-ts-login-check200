import { sendToTelegram } from '../utils/telegram';
import { Page } from '@playwright/test';


export class LinkCheckerPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async getAllLinks(): Promise<string[]> {
    const links = await this.page.$$eval('a', anchors =>
      anchors.map(a => (a as HTMLAnchorElement).href).filter(href => href.startsWith('http'))
    );
    return [...new Set(links)];
  }

  // Your requested method
  async linksStatusArray(links: string[]): Promise<string[]> {
    console.log(`Total amount of links: ${links.length}`);
    const failures: string[] = [];

    for (const link of links) {
      try {
        const response = await fetch(link);
        console.log(`Link: ${response.url} Status: ${response.status} ✅`);
        await sendToTelegram(`Link: ${response.url} Status: ${response.status} ✅`);

        if (response.status !== 200) {
          console.log(`❌ Link failed: ${response.url} Status: ${response.status}`);
          failures.push(`❌ [${link}](${link}) - Status: ${response.status}`);
        }
      } catch (err: any) {
        console.log(`❌ Link error: ${link} - ${err.message}`);
        failures.push(`❌ [${link}](${link}) - Error: ${err.message}`);
      }
    }

    return failures;
  }
}
