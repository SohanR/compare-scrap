const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function setupBrowser() {
  return await puppeteer.launch({
    headless: true,
    args: [
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
    defaultViewport: { width: 1920, height: 1080 },
  });
}

async function scrapeLonelyPlanetThingsToDo(to) {
  console.log(`   🎯 [SCRAPER] Starting Things to Do scraper`);

  const browser = await setupBrowser();
  const page = await browser.newPage();
  const thingsToDo = [];

  try {
    const url = `https://www.lonelyplanet.com/search?q=${encodeURIComponent(
      to
    )}&sortBy=pois`;
    console.log(`   🌐 [NAV] ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    console.log(`   ✓ [PAGE] Content loaded successfully`);

    // Wait for the target elements to load
    try {
      await page.waitForSelector("article.card-hover", {
        timeout: 20000,
      });
      console.log(`   ✓ [DATA] Things to Do elements found on page`);
    } catch (error) {
      console.error(`   ❌ [ERROR] Things to Do elements not found on page`);
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("article.card-hover");
      return Array.from(items).map((item) => {
        const name =
          item.querySelector("a.card-link span")?.innerText?.trim() || null;
        const imageUrl = item.querySelector("img")?.src || null;
        const link = item.querySelector("a.card-link")?.getAttribute("href")
          ? `https://www.lonelyplanet.com/${item
              .querySelector("a.card-link")
              .getAttribute("href")}`
          : null;
        // For POIs, use the category as description fallback
        const description =
          item.querySelector("p.text-label.uppercase")?.innerText?.trim() ||
          null;
        return { name, description, imageUrl, link };
      });
    });

    thingsToDo.push(
      ...results.filter(
        (item) => item.name && item.description && item.imageUrl && item.link
      )
    );
  } catch (error) {
    console.error(
      `   ❌ [ERROR] Lonely Planet Things to Do scraping failed:`,
      error.message
    );
  } finally {
    await browser.close();
  }

  return thingsToDo;
}

async function scrapeLonelyPlanetTipsAndStories(destination) {
  console.log(`   📖 [SCRAPER] Starting Tips & Stories scraper`);

  const browser = await setupBrowser();
  const page = await browser.newPage();
  const tipsAndStories = [];

  try {
    const url = `https://www.lonelyplanet.com/search?q=${encodeURIComponent(
      destination
    )}&sortBy=articles`;
    console.log(`   🌐 [NAV] ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    console.log(`   ✓ [PAGE] Content loaded successfully`);

    // Wait for the target elements to load
    try {
      await page.waitForSelector("article.card-hover", {
        timeout: 20000,
      });
      console.log(`   ✓ [DATA] Tips & Stories elements found on page`);
    } catch (error) {
      console.error(`   ❌ [ERROR] Tips & Stories elements not found on page`);
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("article.card-hover");
      return Array.from(items).map((item) => {
        const name =
          item.querySelector("a.card-link span")?.innerText?.trim() || null;
        const imageUrl = item.querySelector("img")?.src || null;
        const link = item.querySelector("a.card-link")?.getAttribute("href")
          ? `https://www.lonelyplanet.com/${item
              .querySelector("a.card-link")
              .getAttribute("href")}`
          : null;
        // For POIs, use the category as description fallback
        const description =
          item.querySelector("p.text-label.uppercase")?.innerText?.trim() ||
          null;
        return { name, description, imageUrl, link };
      });
    });

    tipsAndStories.push(
      ...results.filter(
        (item) => item.name && item.description && item.imageUrl && item.link
      )
    );
  } catch (error) {
    console.error(
      `   ❌ [ERROR] Lonely Planet Tips & Stories scraping failed:`,
      error.message
    );
  } finally {
    await browser.close();
  }

  return tipsAndStories;
}

module.exports = {
  scrapeLonelyPlanetThingsToDo,
  scrapeLonelyPlanetTipsAndStories,
};
