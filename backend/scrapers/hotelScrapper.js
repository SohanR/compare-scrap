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

async function scrapeBookingDotCom(to, checkInDate, checkOutDate) {
  console.log(`   [SCRAPER] Starting Booking.com scraper`);

  // Adjust checkOutDate if it is the same as checkInDate
  if (checkInDate === checkOutDate) {
    const checkIn = new Date(checkInDate);
    checkIn.setDate(checkIn.getDate() + 1);
    checkOutDate = checkIn.toISOString().split("T")[0];
  }

  const browser = await setupBrowser();
  const page = await browser.newPage();
  const hotels = [];
  const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1501117716987-c8e1ecb210af?auto=format&fit=crop&w=1200&q=80";

  try {
    await page.setUserAgent(randomUseragent.getRandom());

    const url = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(
      to
    )}&ssne=${encodeURIComponent(to)}&ssne_untouched=${encodeURIComponent(
      to
    )}&checkin=${checkInDate}&checkout=${checkOutDate}&group_adults=2&no_rooms=1&group_children=0&selected_currency=usd`;

    console.log(`   [NAV] ${url}`);

    await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });
    console.log(`   [PAGE] Content loaded successfully`);

    // Trigger lazy-loaded assets (images) by scrolling down/up
    await page.evaluate(async () => {
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      window.scrollTo(0, 0);
    });
    // Give images a moment to hydrate
    await page.waitForTimeout(1200);
    await page.waitForSelector('[data-testid="property-card"] img', {
      timeout: 5000,
    }).catch(() => {});

    // Wait for hotels to load
    try {
      await page.waitForSelector('[data-testid="property-card"]', {
        timeout: 20000,
      });
      console.log(`   [DATA] Hotel cards found on page`);
    } catch (error) {
      console.error(`   [ERROR] Hotel cards not found on page`);
      throw error;
    }

    const results = await page.evaluate(() => {
      const items = document.querySelectorAll('[data-testid="property-card"]');
      return Array.from(items).map((item) => ({
        name: item.querySelector('[data-testid="title"]')?.innerText?.trim(),
        price:
          parseFloat(
            item
              .querySelector('[data-testid="price-and-discounted-price"]')
              ?.textContent?.match(/[\d,]+(\.\d+)?/g)?.[0]
              ?.replace(/,/g, "")
          ) || null,
        currency: "USD",
        rating:
          item
            .querySelector('[data-testid="review-score"] .f63b14ab7a')
            ?.innerText?.trim() || null,
        location: item.querySelector('[data-testid="address"]')?.innerText?.trim(),
        bookingLink: item.querySelector("a")?.href,
        amenities: Array.from(
          item.querySelectorAll('[data-testid="facility-icons"] span'),
          (span) => span.innerText?.trim()
        ),
        imageUrl: (() => {
          const primary =
            item.querySelector('[data-testid="property-card-desktop-single-image"] img') ||
            item.querySelector('[data-testid="image"] img') ||
            item.querySelector('[data-testid="image"]') ||
            item.querySelector("img");
          if (!primary) return null;
          const srcset = primary.getAttribute("srcset");
          const fallbackSrcset = srcset
            ? srcset
                .split(",")
                .map((s) => s.trim().split(" ")[0])
                .find((s) => s && s.startsWith("http"))
            : null;
          return (
            primary.getAttribute("src") ||
            primary.getAttribute("data-src") ||
            primary.getAttribute("data-lazy") ||
            primary.getAttribute("data-lazy-src") ||
            fallbackSrcset
          );
        })() || FALLBACK_IMAGE,
        description: item.querySelector('[data-testid="description"]')?.innerText?.trim(),
      }));
    });

    hotels.push(...results.filter((hotel) => hotel.name));
  } catch (error) {
    console.error(`   [ERROR] Booking.com scraping failed:`, error.message);
  } finally {
    await browser.close();
  }

  return hotels;
}

async function scrapeHotels(location, checkInDate, checkOutDate) {
  console.log(`   [PROCESS] Starting hotel scraping process`);

  try {
    const bookingResults = await scrapeBookingDotCom(
      location,
      checkInDate,
      checkOutDate
    ).catch((err) => {
      console.error(`   [ERROR] Booking.com scraping error:`, err.message);
      return [];
    });

    // Remove duplicates based on hotel name
    const allHotels = Array.from(
      new Map(bookingResults.map((hotel) => [hotel.name, hotel])).values()
    );

    // Sort by price
    const sortedHotels = allHotels.sort((a, b) => a.price - b.price);

    console.log(`   [FINAL] Total unique hotels: ${sortedHotels.length}`);
    return sortedHotels;
  } catch (error) {
    console.error(`   [ERROR] Hotel scraping process failed:`, error.message);
    return [];
  }
}

module.exports = {
  scrapeHotels,
};
