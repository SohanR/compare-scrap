/*
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");
const axios = require("axios");
const cheerio = require("cheerio");
const { scrapeFromBookingDotCom } = require("./booking");

puppeteer.use(StealthPlugin());

async function setupBrowser() {
  return await puppeteer.launch({
    headless: "new",
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

async function scrapeBookingDotCom(location, checkInDate, checkOutDate) {
  const browser = await setupBrowser();
  const page = await browser.newPage();
  const hotels = [];

  try {
    await page.setUserAgent(randomUseragent.getRandom());

    console.log("Navigating to Booking.com...");
    const url = `https://www.booking.com/searchresults.html?ss=${location}`;
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for hotels to load
    await page.waitForSelector('[data-testid="property-card"]', {
      timeout: 10000,
    });

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="property-card"]');
      return Array.from(items).map((item) => ({
        name: item.querySelector('[data-testid="title"]')?.innerText?.trim(),
        price: parseFloat(
          item
            .querySelector('[data-testid="price-and-discounted-price"]')
            ?.innerText?.replace(/[^0-9.]/g, "")
        ),
        rating: item.querySelector(".b5cd09854e")?.innerText?.trim(),
        location: item
          .querySelector('[data-testid="address"]')
          ?.innerText?.trim(),
        bookingLink: item.querySelector("a")?.href,
        amenities: Array.from(
          item.querySelectorAll('[data-testid="facility-icons"] span'),
          (span) => span.innerText?.trim()
        ),
        imageUrl: item.querySelector("img")?.src,
        description: item
          .querySelector('[data-testid="description"]')
          ?.innerText?.trim(),
      }));
    });

    hotels.push(...results.filter((hotel) => hotel.name && hotel.price > 0));
    console.log("Hotels scrapped:", hotels);
  } catch (error) {
    console.error("hotel scraping error:", error.message);
  } finally {
    await browser.close();
  }

  return hotels;
}

async function scrapeHotels(location, checkInDate, checkOutDate) {
  console.log(
    `Scraping hotels for ${location} from ${checkInDate} to ${checkOutDate}`
  );

  try {
    const [bookingResults, agodaResults, mmtResults] = await Promise.all([
      scrapeFromBookingDotCom(location, checkInDate, checkOutDate).catch(
        (err) => {
          console.error("Booking.com error:", err.message);
          return [];
        }
      ),
    ]);

    let allHotels = [...bookingResults, ...agodaResults, ...mmtResults];

    // Remove duplicates based on hotel name
    allHotels = Array.from(
      new Map(allHotels.map((hotel) => [hotel.name, hotel])).values()
    );

    // Sort by price
    allHotels = allHotels.sort((a, b) => a.price - b.price);

    console.log(`Found ${allHotels.length} unique hotels`);
    console.log("All Hotels:", allHotels);
    return allHotels;
  } catch (error) {
    console.error("Hotel scraping error:", error);
    return [];
  }
}

module.exports = {
  scrapeHotels,
};
*/
