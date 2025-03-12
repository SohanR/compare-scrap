const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");

puppeteer.use(StealthPlugin());

async function scrapeBookingDotCom(location, checkInDate, checkOutDate) {
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

    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      location
    )}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=2&no_rooms=1&group_children=0&selected_currency=USD`;

    console.log(`Navigating to URL: ${url}`);

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
    console.log("Booking.com Hotels:", hotels);
  } catch (error) {
    console.error("Booking.com scraping error:", error.message);
  } finally {
    await browser.close();
  }

  return hotels;
}

module.exports = {
  scrapeBookingDotCom,
};
