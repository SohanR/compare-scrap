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

async function scrapeBuses(from, to, date) {
  // const buses = [];
  // const browser = await setupBrowser();
  // const page = await browser.newPage();

  // try {
  //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
  //   await page.goto(`https://www.shohoz.com/bus/search?fromCity=${encodeURIComponent(from)}&toCity=${encodeURIComponent(to)}&doj=${date}`, 
  //     { waitUntil: 'networkidle0', timeout: 10000 });
    
  //   await page.waitForSelector('.bus-list-item', { timeout: 5000 });
    
  //   const results = await page.evaluate(() => {
  //     const items = document.querySelectorAll('.bus-list-item');
  //     return Array.from(items).map(item => ({
  //       type: 'bus',
  //       name: item.querySelector('.operator-name')?.innerText?.trim() || 'Unknown',
  //       provider: item.querySelector('.operator-name')?.innerText?.trim() || 'Unknown',
  //       price: parseFloat(item.querySelector('.fare')?.innerText?.replace(/[^0-9.]/g, '') || '0'),
  //       duration: item.querySelector('.duration')?.innerText?.trim() || 'Unknown',
  //       departureTime: item.querySelector('.departure-time')?.innerText?.trim() || 'Unknown',
  //       arrivalTime: item.querySelector('.arrival-time')?.innerText?.trim() || 'Unknown',
  //       rating: item.querySelector('.rating')?.innerText?.trim() || 'Unknown',
  //       imageUrl: item.querySelector('.image')?.getAttribute('src') || 'Unknown',
  //       description: item.querySelector('.description')?.innerText?.trim() || 'Unknown',
  //       bookingLink: item.querySelector('.booking-link')?.getAttribute('href') || 'Unknown'
  //     }));
  //   });

  //   if (results.length > 0) {
  //     buses.push(...results.filter(bus => bus.price > 0));
  //   }
  // } catch (error) {
  //   console.error('Bus scraping error:', error);
  // }

  // await browser.close();
  // return buses;

  // Return empty array for now
  return [];
}

async function scrapeFlights(from, to, date) {
  // const flights = [];
  // const browser = await setupBrowser();
  // const page = await browser.newPage();

  // try {
  //   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
  //   await page.goto(`https://www.biman-airlines.com/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`, 
  //     { waitUntil: 'networkidle0', timeout: 10000 });
    
  //   await page.waitForSelector('.flight-item', { timeout: 5000 });
    
  //   const results = await page.evaluate(() => {
  //     const items = document.querySelectorAll('.flight-item');
  //     return Array.from(items).map(item => ({
  //       type: 'flight',
  //       name: item.querySelector('.airline-name')?.innerText?.trim() || 'Unknown',
  //       provider: item.querySelector('.airline-name')?.innerText?.trim() || 'Unknown',
  //       price: parseFloat(item.querySelector('.price')?.innerText?.replace(/[^0-9.]/g, '') || '0'),
  //       duration: item.querySelector('.duration')?.innerText?.trim() || 'Unknown',
  //       departureTime: item.querySelector('.departure-time')?.innerText?.trim() || 'Unknown',
  //       arrivalTime: item.querySelector('.arrival-time')?.innerText?.trim() || 'Unknown',
  //       rating: item.querySelector('.rating')?.innerText?.trim() || 'Unknown',
  //       imageUrl: item.querySelector('.image')?.getAttribute('src') || 'Unknown',
  //       description: item.querySelector('.description')?.innerText?.trim() || 'Unknown',
  //       bookingLink: item.querySelector('.booking-link')?.getAttribute('href') || 'Unknown'
  //     }));
  //   });

  //   if (results.length > 0) {
  //     flights.push(...results.filter(flight => flight.price > 0));
  //   }
  // } catch (error) {
  //   console.error('Flight scraping error:', error);
  // }

  // await browser.close();
  // return flights;

  // Return empty array for now
  return [];
}

async function getAllTransportation(from, to, date) {
  // try {
  //   const [buses, flights] = await Promise.all([
  //     scrapeBuses(from, to, date),
  //     scrapeFlights(from, to, date)
  //   ]);

  //   const allTransportation = [...buses, ...flights];
  //   return allTransportation.sort((a, b) => a.price - b.price);
  // } catch (error) {
  //   console.error('Transportation scraping error:', error);
  //   return [];
  // }

  // Return empty array for now
  return [];
}

module.exports = {
  getAllTransportation
};
