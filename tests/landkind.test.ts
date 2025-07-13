import { test, expect } from '@playwright/test';
import { sendToSlack} from '../utils/slack';
import { sendToTelegram } from '../utils/telegram';
import { escapeMarkdown } from '../utils/telegram';
import mf from '../helpers/qaHelpers ';
import Class from '../pages/basePage';
import LoginPage from '../pages/loginPage';
import landKindLinks from '../pages/landkindMain';



                                    // 1 login
test.skip('Test 1: log in ', async ({ page }) => {

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
test('Smoke test for landkind.de links 200', async ({ request }) => {
  await mf.linkArrayStatus200(request, landKindLinks.linksToTest);
});










