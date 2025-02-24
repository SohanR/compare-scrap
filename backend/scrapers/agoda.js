const axios = require("axios");
const cheerio = require("cheerio");
const randomUseragent = require("random-useragent");

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

module.exports = {
  scrapeAgodaHotels,
};
