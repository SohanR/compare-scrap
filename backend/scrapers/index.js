const { scrapeBookingDotCom } = require("./booking");
const { scrapeAgodaHotels } = require("./agoda");
const { scrapeMakeMyTripHotels } = require("./makemytrip");

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
