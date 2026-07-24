// Run the MakeMyTrip & Goibibo Reviews Scraper on Apify and print the results.
//
// Install:  npm install apify-client
// Docs:     https://apify.com/factden/makemytrip-scraper

import { ApifyClient } from 'apify-client';

// Get your token from https://console.apify.com/settings/integrations
const client = new ApifyClient({ token: '<YOUR_APIFY_TOKEN>' });

const input = {
    startUrls: [
        'https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN', // MakeMyTrip
        'https://www.goibibo.com/hotels/hard-rock-goa-hotel-in-goa-6204281054243107966/', // Goibibo
    ],
    reviewSource: 'auto',
    maxReviewsPerHotel: 100,
    sortBy: 'mostRecent',
};

// Start the actor and wait for it to finish
const run = await client.actor('factden/makemytrip-scraper').call(input);

// Fetch the resulting dataset
const { items } = await client.dataset(run.defaultDatasetId).listItems();
for (const row of items) {
    console.log(`${row.overallRating}  [${row.source}]  ${row.hotelName}`);
    if (row.ownerResponse) {
        console.log('   ↳ hotel responded');
    }
}
