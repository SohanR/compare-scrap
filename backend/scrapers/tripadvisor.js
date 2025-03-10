const axios = require("axios");
const cheerio = require("cheerio");
const randomUseragent = require("random-useragent");

async function scrapeTripAdvisorPlaces(location) {
  try {
    const url = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(
      location
    )}&searchSessionId=&searchNearby=false&geo=1&pid=3826&ssrc=e`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent": randomUseragent.getRandom(),
        Accept: "text/html",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(response.data);
    const places = [];

    $(".result-title").each((_, element) => {
      const place = {
        name: $(element).text().trim(),
        description: $(element).next(".result-description").text().trim(),
        rating: $(element).next(".result-rating").text().trim(),
        link: "https://www.tripadvisor.com" + $(element).attr("href"),
      };

      if (place.name) {
        places.push(place);
      }
    });

    console.log("TripAdvisor Places:", places);
    return places;
  } catch (error) {
    console.error("TripAdvisor scraping error:", error.message);
    return [];
  }
}

module.exports = {
  scrapeTripAdvisorPlaces,
};
