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

async function scrapeLonelyPlanetThingsToDo(destination) {
  console.log(
    `\x1b[34mStarting Lonely Planet scraping for Things to Do: ${destination}\x1b[0m`
  );

  const browser = await setupBrowser();
  const page = await browser.newPage();
  const thingsToDo = [];

  try {
    const url = `https://www.lonelyplanet.com/search?q=${encodeURIComponent(
      destination
    )}&sortBy=pois`;
    console.log(`\x1b[34mNavigating to URL:\x1b[0m ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    // Log the page content for debugging
    const pageContent = await page.content();
    console.log("\x1b[33mPage content loaded. First 500 characters:\x1b[0m");
    // console.log(pageContent.substring(0, 500));

    // Wait for the target elements to load
    try {
      await page.waitForSelector("article.relative.flex.items-center", {
        timeout: 20000,
      });
      console.log("\x1b[32mTarget elements found on the page.\x1b[0m");
    } catch (error) {
      console.error(
        "\x1b[31mTarget elements not found. Selector might be incorrect.\x1b[0m"
      );
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll(
        "article.relative.flex.items-center"
      );
      return Array.from(items).map((item) => ({
        name: item.querySelector("a.card-link span")?.innerText?.trim() || null,
        description:
          item.querySelector("p.text-black-400 span")?.innerText?.trim() ||
          null,
        imageUrl: item.querySelector("img")?.src || null,
        link: item.querySelector("a.card-link")?.href
          ? `https://www.lonelyplanet.com${item
              .querySelector("a.card-link")
              .getAttribute("href")}`
          : null,
      }));
    });

    // console.log(
    //   "\x1b[36mRaw results from page evaluation:\x1b[0m",
    //   JSON.stringify(results, null, 2)
    // );

    thingsToDo.push(
      ...results.filter(
        (item) => item.name && item.description && item.imageUrl && item.link
      )
    );
    //console.log(`\x1b[32mFiltered ${thingsToDo.length} valid items.\x1b[0m`);
  } catch (error) {
    console.error(
      "\x1b[31mError scraping Lonely Planet:\x1b[0m",
      error.message
    );
  } finally {
    await browser.close();
  }

  return thingsToDo;
}

async function scrapeLonelyPlanetTipsAndStories(destination) {
  console.log(
    `\x1b[34mStarting Lonely Planet scraping for tips and stories: ${destination}\x1b[0m`
  );

  const browser = await setupBrowser();
  const page = await browser.newPage();
  const tipsAndStories = [];

  try {
    const url = `https://www.lonelyplanet.com/search?q=${encodeURIComponent(
      destination
    )}&sortBy=articles`;
    console.log(`\x1b[34mNavigating to URL:\x1b[0m ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    // Log the page content for debugging
    const pageContent = await page.content();
    console.log("\x1b[33mPage content loaded. First 500 characters:\x1b[0m");
    console.log(pageContent.substring(0, 500));

    // Wait for the target elements to load
    try {
      await page.waitForSelector("article.relative.flex.items-center", {
        timeout: 20000,
      });
      console.log("\x1b[32mTarget elements found on the page.\x1b[0m");
    } catch (error) {
      console.error(
        "\x1b[31mTarget elements not found. Selector might be incorrect.\x1b[0m"
      );
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll(
        "article.relative.flex.items-center"
      );
      return Array.from(items).map((item) => ({
        name: item.querySelector("a.card-link span")?.innerText?.trim() || null,
        description:
          item.querySelector("p.line-clamp-2 span")?.innerText?.trim() || null,
        imageUrl: item.querySelector("img")?.src || null,
        link: item.querySelector("a.card-link")?.href
          ? `https://www.lonelyplanet.com${item
              .querySelector("a.card-link")
              .getAttribute("href")}`
          : null,
      }));
    });

    console.log(
      "\x1b[36mRaw results from page evaluation:\x1b[0m",
      JSON.stringify(results, null, 2)
    );

    tipsAndStories.push(
      ...results.filter(
        (item) => item.name && item.description && item.imageUrl && item.link
      )
    );
    console.log(
      `\x1b[32mFiltered ${tipsAndStories.length} valid items.\x1b[0m`
    );
  } catch (error) {
    console.error(
      "\x1b[31mError scraping Lonely Planet tips and stories:\x1b[0m",
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
