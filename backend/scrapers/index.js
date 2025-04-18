
// const { scrapeAgodaHotels } = require("./agoda");
// const { scrapeMakeMyTripHotels } = require("./makemytrip");
// const { scrapeTripAdvisorPlaces } = require("./tripadvisor");

async function scrapeHotels(location, checkInDate, checkOutDate) {
  console.log(
    `Scraping hotels for ${location} from ${checkInDate} to ${checkOutDate}`
  );

  try {
    // Only use Booking.com scraper
    const bookingResults = await scrapeBookingDotCom(location, checkInDate, checkOutDate).catch((err) => {
      console.error("Booking.com error:", err.message);
      return [];
    });

    let allHotels = [...bookingResults];

    console.log("booking results", bookingResults);
    

    // Remove duplicates based on hotel name
    allHotels = Array.from(
      new Map(allHotels.map((hotel) => [hotel.name, hotel])).values()
    );

    // Sort by price
    allHotels = allHotels.sort((a, b) => a.price - b.price);

    console.log(`Found ${allHotels.length} unique hotels`);
    return allHotels;
  } catch (error) {
    console.error("Hotel scraping error:", error);
    return [];
  }
}

async function scrapeTouristPlaces(location) {
  console.log(`Scraping tourist places for ${location}`);

  // Return empty array for now
  return [];
}

module.exports = {
  scrapeHotels,
  scrapeTouristPlaces,
};
