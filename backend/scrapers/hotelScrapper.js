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
    defaultViewport: { width: 1920, height: 1080 },
  });
}

async function scrapeBookingDotCom(location, checkInDate, checkOutDate) {
  const browser = await setupBrowser();
  const page = await browser.newPage();
  const hotels = [];

  try {
    await page.setUserAgent(randomUseragent.getRandom());

    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      location
    )}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=2&no_rooms=1&group_children=0`;

    console.log(`\x1b[34mNavigating to Booking.com URL:\x1b[0m ${url}`); // Blue log

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

    // Log the page content for debugging
    const pageContent = await page.content();
    console.log("\x1b[33mPage content loaded. First 500 characters:\x1b[0m");
    console.log(pageContent.substring(0, 500));

    // Wait for hotels to load
    try {
      await page.waitForSelector('[data-testid="property-card"]', {
        timeout: 20000,
      });
      console.log("\x1b[32mHotel cards found on the page.\x1b[0m"); // Green log
    } catch (error) {
      console.error(
        "\x1b[31mHotel cards not found on the page. Selector might be incorrect.\x1b[0m" // Red log
      );
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="property-card"]');
      console.log(`Number of property cards found: ${items.length}`);
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
        imageUrl: item.querySelector(
          '[data-testid="property-card-desktop-single-image"] img'
        )?.src,
        description: item
          .querySelector('[data-testid="description"]')
          ?.innerText?.trim(),
      }));
    });

    console.log(
      "\x1b[36mRaw results from page evaluation:\x1b[0m",
      JSON.stringify(results, null, 2)
    ); // Cyan log

    hotels.push(...results.filter((hotel) => hotel.name));
    // console.log(
    //   "\x1b[32mFiltered hotels with valid names and prices:\x1b[0m",
    //   JSON.stringify(hotels, null, 2)
    // ); // Green log
  } catch (error) {
    console.error("\x1b[31mError scraping Booking.com:\x1b[0m", error.message); // Red log
  } finally {
    await browser.close();
  }

  return hotels;
}

async function scrapeHotels(location, checkInDate, checkOutDate) {
  console.log(
    `\x1b[34mStarting hotel scraping for ${location} from ${checkInDate} to ${checkOutDate}\x1b[0m` // Blue log
  );

  try {
    const bookingResults = await scrapeBookingDotCom(
      location,
      checkInDate,
      checkOutDate
    ).catch((err) => {
      console.error("\x1b[31mBooking.com scraping error:\x1b[0m", err.message); // Red log
      return [];
    });

    // Remove duplicates based on hotel name
    const allHotels = Array.from(
      new Map(bookingResults.map((hotel) => [hotel.name, hotel])).values()
    );

    // Sort by price
    const sortedHotels = allHotels.sort((a, b) => a.price - b.price);

    console.log(`\x1b[32mFound ${sortedHotels.length} unique hotels\x1b[0m`); // Green log
    console.log(
      "\x1b[36mFinal sorted hotel results:\x1b[0m",
      JSON.stringify(sortedHotels, null, 2)
    ); // Cyan log
    return sortedHotels;
  } catch (error) {
    console.error("\x1b[31mError during hotel scraping:\x1b[0m", error.message); // Red log
    return [];
  }
}

module.exports = {
  scrapeHotels,
};
