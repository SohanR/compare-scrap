const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");

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
    defaultViewport: { width: 1366, height: 768 },
  });
}

async function scrapeKayakFlights(from, to, date, attempt = 1) {
  const url = `https://booking.kayak.com/flights/${from}-${to}/${date}?sort=price_a`;
  console.log(`   🌐 [NAV] ${url}`);

  const browser = await setupBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom());
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
    "upgrade-insecure-requests": "1",
  });

  const flights = [];

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
    console.log(`   ✓ [PAGE] Content loaded successfully`);

    // Scroll to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitForTimeout(1500);
    }

    // Wait for flight results container
    await page.waitForFunction(
      () => {
        const items = document.querySelectorAll("li.hJSA-item");
        return items.length > 0;
      },
      { timeout: 90000 }
    );
    console.log(`   ✓ [DATA] Flight results found on page`);

    // Dismiss popups if any
    try {
      const closeBtns = await page.$x(
        "//button[contains(@aria-label, 'Close') or contains(@aria-label, 'close')]"
      );
      for (const btn of closeBtns) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(500);
      }
    } catch (err) {}

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("li.hJSA-item");

      return Array.from(items).map((item, idx) => {
        try {
          // Time
          const timeContainer = item.querySelector(".VY2U .vmXl");
          let time = null;
          if (timeContainer) {
            const timeText = timeContainer.innerText?.trim() || "";
            time = timeText || null;
          }

          // Flight name
          const flightNameElem = item.querySelector(
            ".VY2U .c_cgF.c_cgF-mod-variant-default"
          );
          const flightName = flightNameElem?.innerText?.trim() || null;

          // Stops
          const stopsElem = item.querySelector(
            ".JWEO .vmXl.vmXl-mod-variant-default span"
          );
          const stops = stopsElem?.innerText?.trim() || null;

          // Duration
          const durationElem = item.querySelector(
            ".xdW8 .vmXl.vmXl-mod-variant-default"
          );
          const duration = durationElem?.innerText?.trim() || null;

          // Airport codes
          const airportInfos = item.querySelectorAll(".jLhY-airport-info span");
          const fromIata =
            airportInfos[0]?.innerText?.trim() ||
            airportInfos[0]?.textContent?.trim() ||
            null;
          const toIata =
            airportInfos[1]?.innerText?.trim() ||
            airportInfos[1]?.textContent?.trim() ||
            null;
          const airlinePath =
            fromIata && toIata ? `${fromIata} → ${toIata}` : null;

          // Airline logos
          const airlineLogoNodes = item.querySelectorAll(
            ".c5iUd-leg-carrier img"
          );
          const airlineLogos = Array.from(airlineLogoNodes).map(
            (img) => img.src
          );

          // Price and booking link are in SIBLING element
          let price = null;
          let bookingLink = null;
          let provider = null;

          let parentContainer = item.closest(".nrc6");
          if (!parentContainer) {
            parentContainer = item.closest("[data-resultid]");
          }
          if (!parentContainer) {
            parentContainer = item.parentElement?.parentElement?.parentElement;
          }

          if (parentContainer) {
            const priceSection = parentContainer.querySelector(
              ".nrc6-price-section"
            );
            if (priceSection) {
              const priceElem = priceSection.querySelector(".e2GB-price-text");
              if (priceElem) {
                price = priceElem.innerText?.trim() || null;
              }

              const bookingAnchor = priceSection.querySelector(".oVHK-fclink");
              if (bookingAnchor) {
                bookingLink = bookingAnchor.getAttribute("href") || null;
                if (bookingLink && bookingLink.startsWith("/")) {
                  bookingLink = `https://www.kayak.com${bookingLink}`;
                }
              }

              const providerElem = priceSection.querySelector(".DOum-name");
              provider = providerElem?.innerText?.trim() || flightName;
            }
          }

          // Fallback: try regex extraction if direct selectors fail
          if (!price && parentContainer) {
            const allText = parentContainer.innerText;
            const priceMatch = allText.match(/\$[\d,]+/);
            if (priceMatch) {
              price = priceMatch[0];
            }
          }

          return {
            time,
            flightName,
            stops,
            duration,
            price,
            provider,
            bookingLink,
            airlineLogos,
            airlinePath,
            fromIata,
            toIata,
          };
        } catch (e) {
          return null;
        }
      });
    });

    const filtered = results.filter(
      (f) =>
        f &&
        f.time &&
        f.flightName &&
        f.duration &&
        f.price &&
        f.fromIata &&
        f.toIata
    );

    flights.push(...filtered);
    console.log(`   ✅ [FINAL] Total flights: ${flights.length}`);
  } catch (error) {
    console.error(
      `   ❌ [ERROR] Kayak scraping failed (Attempt ${attempt}):`,
      error.message
    );
    if (attempt < 3) {
      console.log(`   🔄 [RETRY] Retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await browser.close();
      return scrapeKayakFlights(from, to, date, attempt + 1);
    }
  } finally {
    await browser.close();
  }

  return flights;
}

async function scrapeKayakFlightsTwoWay(
  from,
  to,
  departDate,
  returnDate,
  attempt = 1
) {
  const url = `https://booking.kayak.com/flights/${from}-${to}/${departDate}/${returnDate}?sort=price_a`;
  console.log(`   🌐 [NAV] ${url}`);

  const browser = await setupBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom());
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
    "upgrade-insecure-requests": "1",
  });

  const flights = [];

  try {
    await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 });
    console.log(`   ✓ [PAGE] Content loaded successfully`);

    // Scroll to trigger lazy loading
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
      });
      await page.waitForTimeout(1500);
    }

    // Wait for flight results
    await page.waitForFunction(
      () => {
        return document.querySelectorAll("li.hJSA-item").length > 0;
      },
      { timeout: 90000 }
    );
    console.log(`   ✓ [DATA] Flight results found on page`);

    try {
      const closeBtns = await page.$x(
        "//button[contains(@aria-label, 'Close') or contains(@aria-label, 'close')]"
      );
      for (const btn of closeBtns) {
        await btn.click().catch(() => {});
        await page.waitForTimeout(500);
      }
    } catch (err) {}

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("li.hJSA-item");

      return Array.from(items).map((item, idx) => {
        try {
          // Time
          const timeContainer = item.querySelector(".VY2U .vmXl");
          let time = null;
          if (timeContainer) {
            const timeText = timeContainer.innerText?.trim() || "";
            time = timeText || null;
          }

          // Flight name
          const flightNameElem = item.querySelector(
            ".VY2U .c_cgF.c_cgF-mod-variant-default"
          );
          const flightName = flightNameElem?.innerText?.trim() || null;

          // Stops
          const stopsElem = item.querySelector(
            ".JWEO .vmXl.vmXl-mod-variant-default span"
          );
          const stops = stopsElem?.innerText?.trim() || null;

          // Duration
          const durationElem = item.querySelector(
            ".xdW8 .vmXl.vmXl-mod-variant-default"
          );
          const duration = durationElem?.innerText?.trim() || null;

          // Airport codes
          const airportInfos = item.querySelectorAll(".jLhY-airport-info span");
          const fromIata =
            airportInfos[0]?.innerText?.trim() ||
            airportInfos[0]?.textContent?.trim() ||
            null;
          const toIata =
            airportInfos[1]?.innerText?.trim() ||
            airportInfos[1]?.textContent?.trim() ||
            null;
          const airlinePath =
            fromIata && toIata ? `${fromIata} → ${toIata}` : null;

          // Airline logos
          const airlineLogoNodes = item.querySelectorAll(
            ".c5iUd-leg-carrier img"
          );
          const airlineLogos = Array.from(airlineLogoNodes).map(
            (img) => img.src
          );

          // Price and booking link are in SIBLING element
          let price = null;
          let bookingLink = null;
          let provider = null;

          let parentContainer = item.closest(".nrc6");
          if (!parentContainer) {
            parentContainer = item.closest("[data-resultid]");
          }
          if (!parentContainer) {
            parentContainer = item.parentElement?.parentElement?.parentElement;
          }

          if (parentContainer) {
            const priceSection = parentContainer.querySelector(
              ".nrc6-price-section"
            );
            if (priceSection) {
              const priceElem = priceSection.querySelector(".e2GB-price-text");
              if (priceElem) {
                price = priceElem.innerText?.trim() || null;
              }

              const bookingAnchor = priceSection.querySelector(".oVHK-fclink");
              if (bookingAnchor) {
                bookingLink = bookingAnchor.getAttribute("href") || null;
                if (bookingLink && bookingLink.startsWith("/")) {
                  bookingLink = `https://www.kayak.com${bookingLink}`;
                }
              }

              const providerElem = priceSection.querySelector(".DOum-name");
              provider = providerElem?.innerText?.trim() || flightName;
            }
          }

          // Fallback: try regex extraction if direct selectors fail
          if (!price && parentContainer) {
            const allText = parentContainer.innerText;
            const priceMatch = allText.match(/\$[\d,]+/);
            if (priceMatch) {
              price = priceMatch[0];
            }
          }

          return {
            time,
            flightName,
            stops,
            duration,
            price,
            provider,
            bookingLink,
            airlineLogos,
            airlinePath,
            fromIata,
            toIata,
          };
        } catch (e) {
          return null;
        }
      });
    });

    const filtered = results.filter(
      (f) =>
        f &&
        f.time &&
        f.flightName &&
        f.duration &&
        f.price &&
        f.fromIata &&
        f.toIata
    );

    flights.push(...filtered);
    console.log(`   ✅ [FINAL] Total flights: ${flights.length}`);
  } catch (error) {
    console.error(
      `   ❌ [ERROR] Kayak two-way scraping failed (Attempt ${attempt}):`,
      error.message
    );
    if (attempt < 3) {
      console.log(`   🔄 [RETRY] Retrying in 5 seconds...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await browser.close();
      return scrapeKayakFlightsTwoWay(
        from,
        to,
        departDate,
        returnDate,
        attempt + 1
      );
    }
  } finally {
    await browser.close();
  }

  return flights;
}

module.exports = {
  scrapeKayakFlights,
  scrapeKayakFlightsTwoWay,
};
