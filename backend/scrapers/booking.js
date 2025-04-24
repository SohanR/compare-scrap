/*
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");

puppeteer.use(StealthPlugin());

async function scrapeFromBookingDotCom(location, checkInDate, checkOutDate) {
  const browser = await puppeteer.launch({
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
  const page = await browser.newPage();
  const hotels = [];

  try {
    await page.setUserAgent(randomUseragent.getRandom());

    console.log("Setting up Booking.com search URL");
    

    const url = "https://www.booking.com/searchresults.html?ss=Cox%27s+Bazar%2C+Bangladesh&selected_currency=usd";

    console.log(`Navigating to URL: ${url}`); // Log the URL

    let navigationSuccessful = false;
    let attempts = 0;
    const maxAttempts = 3;
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    while (!navigationSuccessful && attempts < maxAttempts) {
      try {
        await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
        navigationSuccessful = true;
      } catch (error) {
        attempts++;
        console.error(`Navigation attempt ${attempts} failed:`, error.message);
        if (attempts < maxAttempts) {
          await delay(5000); // Wait for 5 seconds before retrying
        } else {
          throw error;
        }
      }
    }

    // Log the HTML content of the page
    const pageContent = await page.content();
    console.log(`Page content after navigation: ${pageContent.substring(0, 500)}...`);

    // Wait for hotels to load
    await page.waitForSelector('[data-testid="property-card"]', {
      timeout: 20000,
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
    console.log("Hotel booking Results:", results);
    console.log("From Booking.com Hotels:", hotels);
  } catch (error) {
    console.error("Booking.com scraping error:", error.message);
  } finally {
    await browser.close();
  }

  return hotels;
}

module.exports = {
  scrapeFromBookingDotCom,
};
*/
