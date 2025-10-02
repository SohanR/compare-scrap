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
  console.log(
    `\x1b[34mNavigating to Kayak URL (Attempt ${attempt}):\x1b[0m ${url}`
  );

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

    // Dismiss all possible popups
    try {
      await page.waitForTimeout(4000);
      const closeBtns = await page.$x(
        "//button[contains(@aria-label, 'Close') or contains(@aria-label, 'close') or contains(text(), 'No thanks') or contains(text(), 'Dismiss')]"
      );
      for (const btn of closeBtns) {
        await btn.click();
        await page.waitForTimeout(1000);
      }
    } catch (err) {}

    // Wait for flight results to appear
    await page.waitForFunction(
      () => {
        return (
          document.querySelectorAll("ol.hJSA-list li.hJSA-item").length > 0
        );
      },
      { timeout: 90000 }
    );

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("ol.hJSA-list li.hJSA-item");
      return Array.from(items).map((item) => {
        // Airline logos (array)
        const airlineLogoNodes = item.querySelectorAll(
          ".c5iUd-leg-carrier img"
        );
        const airlineLogos = Array.from(airlineLogoNodes).map((img) => img.src);
        // From/To IATA
        const airportSpans = item.querySelectorAll(".jLhY-airport-info span");
        const fromIata = airportSpans[0]?.innerText || null;
        const toIata = airportSpans[1]?.innerText || null;
        const airlinePath =
          fromIata && toIata ? `${fromIata} → ${toIata}` : null;
        // Time
        const timeElem = item.querySelector(".vmXl.vmXl-mod-variant-large");
        const time = timeElem
          ? Array.from(timeElem.querySelectorAll("span"))
              .map((s) => s.innerText)
              .join(" ")
          : null;
        // Flight name (first .c_cgF after time block)
        const cgfElems = item.querySelectorAll(
          ".c_cgF.c_cgF-mod-variant-default.c_cgF-mod-theme-foreground-neutral"
        );
        const flightName = cgfElems[0]?.innerText || null;
        // Stops
        const stopsElem = item.querySelector(".JWEO-stops-text");
        const stops = stopsElem ? stopsElem.innerText.trim() : null;
        // Duration
        const durationElem = item.querySelector(
          ".xdW8 .vmXl.vmXl-mod-variant-default"
        );
        const duration = durationElem ? durationElem.innerText.trim() : null;
        // Price and booking link (robust)
        let price = null;
        let bookingLink = null;
        let provider = null;
        // Try main booking section first
        const bookingSection = item.querySelector(".oVHK");
        if (bookingSection) {
          const bookingAnchor = bookingSection.querySelector("a.oVHK-fclink");
          if (bookingAnchor) {
            bookingLink = bookingAnchor.getAttribute("href");
            if (bookingLink && bookingLink.startsWith("/")) {
              bookingLink = `https://www.kayak.com${bookingLink}`;
            }
            const priceElem = bookingAnchor.querySelector(".e2GB-price-text");
            price = priceElem ? priceElem.innerText.replace(/\s/g, "") : null;
            const providerElem = item.querySelector(".M_JD-provider-name");
            provider = providerElem ? providerElem.innerText : null;
          }
        }
        // Fallback: look for any .e2GB-price-text and get its closest <a>
        if (!price || !bookingLink) {
          const priceElem = item.querySelector(".e2GB-price-text");
          if (priceElem) {
            price = priceElem.innerText.replace(/\s/g, "");
            // Find closest <a> ancestor
            let parent = priceElem.parentElement;
            while (parent && parent.tagName !== "A") {
              parent = parent.parentElement;
            }
            if (parent && parent.tagName === "A") {
              bookingLink = parent.getAttribute("href");
              if (bookingLink && bookingLink.startsWith("/")) {
                bookingLink = `https://www.kayak.com${bookingLink}`;
              }
            }
          }
        }
        // Fallback: provider from booking button text
        if (!provider) {
          const providerElem = item.querySelector(".M_JD-provider-name");
          provider = providerElem ? providerElem.innerText : null;
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
      });
    });
    console.log("Kayak raw results:", results);

    const filtered = results.filter(
      (f) => f.time && f.flightName && f.duration
    );
    flights.push(...filtered);
    console.log(`\x1b[32mFound ${flights.length} flights\x1b[0m`);
    console.log(flights);
  } catch (error) {
    console.error(
      `\x1b[31mError scraping Kayak flights (Attempt ${attempt}):\x1b[0m`,
      error.message
    );
    if (attempt < 3) {
      // Retry up to 3 times with a delay
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await browser.close();
      return scrapeKayakFlights(from, to, date, attempt + 1);
    }
  } finally {
    await browser.close();
  }

  return flights;
}

module.exports = {
  scrapeKayakFlights,
};
