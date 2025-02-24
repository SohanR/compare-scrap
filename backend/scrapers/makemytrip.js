const axios = require("axios");
const cheerio = require("cheerio");
const randomUseragent = require("random-useragent");

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

module.exports = {
  scrapeMakeMyTripHotels,
};
