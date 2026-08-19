#!/usr/bin/env bash
# Run the MakeMyTrip & Goibibo Reviews Scraper on Apify with curl, then fetch the dataset.
# Docs: https://apify.com/factden/makemytrip-scraper

TOKEN="<YOUR_APIFY_TOKEN>"   # https://console.apify.com/settings/integrations

# Run the actor synchronously and get dataset items back in one call
curl -s -X POST \
  "https://api.apify.com/v2/acts/factden~makemytrip-scraper/run-sync-get-dataset-items?token=${TOKEN}" \
  -H 'Content-Type: application/json' \
  -d '{
    "startUrls": [
      "https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN",
      "https://www.goibibo.com/hotels/hard-rock-goa-hotel-in-goa-6204281054243107966/"
    ],
    "maxReviews": 100,
    "sortBy": "mostRecent"
  }'
