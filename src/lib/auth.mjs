import puppeteer from 'puppeteer-core';
import env from './env.mjs';

export async function getCookies () {
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
