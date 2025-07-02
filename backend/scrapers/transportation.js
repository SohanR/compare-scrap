// const puppeteer = require("puppeteer-extra");
// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
// const randomUseragent = require("random-useragent");

// puppeteer.use(StealthPlugin());

// async function setupBrowser() {
//   return await puppeteer.launch({
//     headless: true,
//     args: [
//       "--disable-web-security",
//       "--disable-features=IsolateOrigins,site-per-process",
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-blink-features=AutomationControlled",
//     ],
//     defaultViewport: { width: 1920, height: 1080 },
//   });
// }

// async function scrapeKayakFlights(from, to, date) {
//   // from, to: IATA codes (e.g. DAC, KUL), date: YYYY-MM-DD
//   const url = `https://booking.kayak.com/flights/${from}-${to}/${date}?sort=price_a`;
//   console.log(`\x1b[34mNavigating to Kayak URL:\x1b[0m ${url}`);

//   const browser = await setupBrowser();
//   const page = await browser.newPage();
//   await page.setUserAgent(randomUseragent.getRandom());
//   const flights = [];

//   try {
//     await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

//     // Wait for flight list to load
//     await page.waitForSelector("ol.hJSA-list > li.hJSA-item", {
//       timeout: 30000,
//     });

//     const results = await page.evaluate(() => {
//       const items = document.querySelectorAll("ol.hJSA-list > li.hJSA-item");
//       return Array.from(items).map((item) => {
//         // Time
//         const timeBlock = item.querySelector(".vmXl-mod-variant-large");
//         let time = null;
//         if (timeBlock) {
//           const spans = timeBlock.querySelectorAll("span");
//           time = Array.from(spans)
//             .map((s) => s.innerText)
//             .join(" ");
//         }

//         // Flight names (carriers)
//         const carrierBlock = item.querySelector(
//           ".c_cgF.c_cgF-mod-variant-default"
//         );
//         let flightName = null;
//         if (carrierBlock) {
//           flightName = carrierBlock.innerText;
//         }

//         // Stops
//         const stopsBlock = item.querySelector(".JWEO-stops-text");
//         let stops = stopsBlock ? stopsBlock.innerText : null;

//         // Duration
//         const durationBlock = item.querySelector(
//           ".xdW8 .vmXl-mod-variant-default"
//         );
//         let duration = durationBlock ? durationBlock.innerText : null;

//         // Price
//         // Price
//         let price = null;
//         const priceBlock = item.querySelector("[data-price]");
//         if (priceBlock) {
//           price = priceBlock.getAttribute("data-price");
//         } else {
//           // Try fallback: look for price text
//           const priceText = item.innerText.match(/\$\d[\d,]*/);
//           price = priceText ? priceText[0] : null;
//         }

//         // Provider name
//         let provider = null;
//         const providerBlock = item.querySelector(
//           ".provider-name, .booking-link"
//         );
//         if (providerBlock) {
//           provider = providerBlock.innerText;
//         }

//         // Booking link
//         let bookingLink = null;
//         const linkBlock = item.querySelector("a.booking-link");
//         if (linkBlock) {
//           bookingLink = linkBlock.href;
//         }

//         // Fallback: try to find any link with "booking" in class
//         if (!bookingLink) {
//           const altLink = item.querySelector("a[href*='booking']");
//           if (altLink) bookingLink = altLink.href;
//         }
//         return {
//           time,
//           flightName,
//           stops,
//           duration,
//           price,
//           provider,
//           bookingLink,
//         };
//       });
//     });

//     flights.push(
//       ...results.filter((f) => f.time && f.flightName && f.duration)
//     );
//     console.log(`\x1b[32mFound ${flights.length} flights\x1b[0m`);
//     console.log("flights:", flights);
//   } catch (error) {
//     console.error(
//       "\x1b[31mError scraping Kayak flights:\x1b[0m",
//       error.message
//     );
//   } finally {
//     await browser.close();
//   }

//   return flights;
// }

// module.exports = {
//   scrapeKayakFlights,
// };

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

async function scrapeKayakFlights(from, to, date) {
  const url = `https://booking.kayak.com/flights/${from}-${to}/${date}?sort=price_a`;
  console.log(`\x1b[34mNavigating to Kayak URL:\x1b[0m ${url}`);

  const browser = await setupBrowser();
  const page = await browser.newPage();
  await page.setUserAgent(randomUseragent.getRandom());

  const flights = [];

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Optional: dismiss modal or popups if any
    try {
      await page.waitForTimeout(3000);
      const closeBtn = await page.$("button[aria-label='Close']");
      if (closeBtn) {
        await closeBtn.click();
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
      { timeout: 60000 }
    );

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll("ol.hJSA-list li.hJSA-item");

      return Array.from(items).map((item) => {
        const timeElem = item.querySelector(".vmXl-mod-variant-large");
        const time = timeElem
          ? Array.from(timeElem.querySelectorAll("span"))
              .map((s) => s.innerText)
              .join(" ")
          : null;

        const flightNameElem = item.querySelector(
          ".c_cgF.c_cgF-mod-variant-default"
        );
        const flightName = flightNameElem ? flightNameElem.innerText : null;

        const stopsElem = item.querySelector(".JWEO-stops-text");
        const stops = stopsElem ? stopsElem.innerText.trim() : null;

        const durationElem = item.querySelector(
          ".xdW8 .vmXl-mod-variant-default"
        );
        const duration = durationElem ? durationElem.innerText.trim() : null;

        const priceTextElem = item.querySelector(".e2GB-price-text");
        const price = priceTextElem
          ? priceTextElem.innerText.replace(/\s/g, "")
          : null;

        const providerElem = item.querySelector(".M_JD-provider-name");
        const provider = providerElem ? providerElem.innerText : null;

        const bookingAnchor = item.querySelector("a.oVHK-fclink");
        const bookingLink = bookingAnchor ? bookingAnchor.href : null;

        return {
          time,
          flightName,
          stops,
          duration,
          price,
          provider,
          bookingLink,
        };
      });
    });

    const filtered = results.filter(
      (f) => f.time && f.flightName && f.duration
    );
    flights.push(...filtered);
    console.log(`\x1b[32mFound ${flights.length} flights\x1b[0m`);
    console.log(flights);
  } catch (error) {
    console.error(
      "\x1b[31mError scraping Kayak flights:\x1b[0m",
      error.message
    );
  } finally {
    await browser.close();
  }

  return flights;
}

module.exports = {
  scrapeKayakFlights,
};
