const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const randomUseragent = require("random-useragent");
const axios = require("axios");
const cheerio = require("cheerio");

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

async function scrapeAgodaHotels(location, checkInDate) {
  try {
    const url = `https://www.agoda.com/search?city=${encodeURIComponent(
      location
    )}&checkIn=${checkInDate}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": randomUseragent.getRandom(),
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);
    const hotels = [];

    $(".hotel-card").each((_, element) => {
      const hotel = {
        name: $(element).find(".hotel-name").text().trim(),
        price: parseFloat(
          $(element)
            .find(".price")
            .text()
            .replace(/[^0-9.]/g, "")
        ),
        rating: $(element).find(".rating").text().trim(),
        location: $(element).find(".location").text().trim(),
        bookingLink:
          "https://www.agoda.com" + $(element).find("a").attr("href"),
        amenities: $(element)
          .find(".amenities span")
          .map((_, el) => $(el).text().trim())
          .get(),
        imageUrl: $(element).find(".hotel-image img").attr("src"),
        description: $(element).find(".description").text().trim(),
      };

      if (hotel.name && hotel.price > 0) {
        hotels.push(hotel);
      }
    });

    console.log("Agoda Hotels:", hotels);
    return hotels;
  } catch (error) {
    console.error("Agoda scraping error:", error.message);
    return [];
  }
}

async function scrapeMakeMyTripHotels(location, checkInDate) {
  try {
    const url = `https://www.makemytrip.com/hotels/hotel-listing/?checkin=${checkInDate}&city=${encodeURIComponent(
      location
    )}`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": randomUseragent.getRandom(),
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);
    const hotels = [];

    $(".hotelCardListing").each((_, element) => {
      const hotel = {
        name: $(element).find(".hotelName").text().trim(),
        price: parseFloat(
          $(element)
            .find(".price")
            .text()
            .replace(/[^0-9.]/g, "")
        ),
        rating: $(element).find(".rating").text().trim(),
        location: $(element).find(".areaName").text().trim(),
        bookingLink:
          "https://www.makemytrip.com" + $(element).find("a").attr("href"),
        amenities: $(element)
          .find(".amenityList span")
          .map((_, el) => $(el).text().trim())
          .get(),
        imageUrl: $(element).find(".hotelImage img").attr("src"),
        description: $(element).find(".hotelDesc").text().trim(),
      };

      if (hotel.name && hotel.price > 0) {
        hotels.push(hotel);
      }
    });

    console.log("MakeMyTrip Hotels:", hotels);
    return hotels;
  } catch (error) {
    console.error("MakeMyTrip scraping error:", error.message);
    return [];
  }
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
    console.log("Booking.com Hotels:", hotels);
  } catch (error) {
    console.error("Booking.com scraping error:", error.message);
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
    // Try multiple sources in parallel
    const [bookingResults, agodaResults, mmtResults] = await Promise.all([
      scrapeBookingDotCom(location, checkInDate, checkOutDate).catch((err) => {
        console.error("Booking.com error:", err.message);
        return [];
      }),
      scrapeAgodaHotels(location, checkInDate).catch((err) => {
        console.error("Agoda error:", err.message);
        return [];
      }),
      scrapeMakeMyTripHotels(location, checkInDate).catch((err) => {
        console.error("MakeMyTrip error:", err.message);
        return [];
      }),
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
