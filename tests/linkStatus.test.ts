import { test, expect } from '@playwright/test';
import { LinkCheckerPage } from '../helpers/LinkCheckerPage';
import { sendToTelegram } from '../utils/telegram';
import  Class from '../pages/basePage';
import  LoginPage from '../pages/loginPage';



                                    // 1 Status 200 for the links
test('Test 1: log in ', async ({ page }) => {

  await page.goto(Class.mainUrlLoginPage);
  const loginPage = new LoginPage(page); // Declare the page we are working with specific page (page exemplar)

  await loginPage.login('username', '12345'); // calling method from this object

  try {
    await expect(loginPage.loginRedFlashAlert).toContainText('Your username is invalid!', { timeout: 10_000 });
    await sendToTelegram('Test passed ✅');
  } catch (error) {
    await sendToTelegram('Test failed ❌');
    throw error; // to force Playwright see error  
  }

});


                                    // 2 Status 200 for the links
test('Test 2: Check all links on the page and report to Telegram', async ({ page }) => {
  test.setTimeout(120000); // 2-minute timeout

  const linkChecker = new LinkCheckerPage(page);
  await linkChecker.goto(Class.mainUrl);

  const links = await linkChecker.getAllLinks();
  const failedLinks = await linkChecker.linksStatusArray(links);

  let report = `🔗 *Link Check Report for:* ${Class.mainUrl}\n\n`;
  report += failedLinks.length === 0
? '✅ All links are valid (status 200)'
    : failedLinks.join('\n');

  await sendToTelegram(report);

});

