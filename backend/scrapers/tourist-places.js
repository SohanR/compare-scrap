const puppeteer = require('puppeteer');

async function setupBrowser() {
  return await puppeteer.launch({
    headless: 'new',
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-sandbox',
      '--disable-setuid-sandbox'
    ],
    defaultViewport: { width: 1920, height: 1080 }
  });
}

async function scrapeTouristPlaces(location) {
  // const places = [];
  // const browser = await setupBrowser();
  // const page = await browser.newPage();

  // try {
  //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
  //   await page.goto(`https://www.tripadvisor.com/Search?q=${encodeURIComponent(location)}+attractions`, 
  //     { waitUntil: 'networkidle0', timeout: 10000 });
    
  //   await page.waitForSelector('.location-meta-block', { timeout: 5000 });
    
  //   const results = await page.evaluate(() => {
  //     const items = document.querySelectorAll('.location-meta-block');
  //     return Array.from(items).map(item => ({
  //       name: item.querySelector('.result-title')?.innerText?.trim() || 'Unknown',
  //       description: item.querySelector('.location-description')?.innerText?.trim() || 'No description available',
  //       rating: item.querySelector('.ui_bubble_rating')?.getAttribute('alt')?.split(' ')[0] || 'Not rated',
  //       reviewCount: item.querySelector('.review-count')?.innerText?.trim() || '0 reviews',
  //       category: item.querySelector('.category-name')?.innerText?.trim() || 'Tourist Attraction',
  //       imageUrl: item.querySelector('img')?.src || null
  //     }));
  //   });

  //   if (results.length > 0) {
  //     places.push(...results.filter(place => place.name !== 'Unknown'));
  //   }
  // } catch (error) {
  //   console.error('Tourist places scraping error:', error);
  // }

  // await browser.close();
  
  // const uniquePlaces = Array.from(new Map(places.map(place => [place.name, place])).values());
  // return uniquePlaces.sort((a, b) => {
  //   const ratingA = parseFloat(a.rating) || 0;
  //   const ratingB = parseFloat(b.rating) || 0;
  //   return ratingB - ratingA;
  // });

  // Return empty array for now
  return [];
}

module.exports = {
  scrapeTouristPlaces
};
