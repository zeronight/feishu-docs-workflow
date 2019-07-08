const puppeteer = require('puppeteer-core');
const env = require('./env');

async function getCookies () {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    executablePath: env.browserPath,
  });
  const pages = await browser.pages();
  const page = pages[0] || await browser.newPage();
  await page.goto(env.authPage);
  await page.waitForNavigation();
  const cookies = await page.cookies();
  await browser.close();
  return cookies;
}

module.exports = getCookies;
