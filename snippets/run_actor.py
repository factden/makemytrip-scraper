"""Run the MakeMyTrip & Goibibo Reviews Scraper on Apify and print the results.

Install:  pip install apify-client
Docs:     https://apify.com/factden/makemytrip-scraper
"""

from apify_client import ApifyClient

# Get your token from https://console.apify.com/settings/integrations
client = ApifyClient("<YOUR_APIFY_TOKEN>")

run_input = {
    "startUrls": [
        "https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN",  # MakeMyTrip
        "https://www.goibibo.com/hotels/hard-rock-goa-hotel-in-goa-6204281054243107966/",  # Goibibo
    ],
    "maxReviews": 100,
    "sortBy": "mostRecent",
}

# Start the actor and wait for it to finish
run = client.actor("factden/makemytrip-scraper").call(run_input=run_input)

# Iterate the resulting dataset
for row in client.dataset(run["defaultDatasetId"]).iterate_items():
    rating = row.get("overallRating")
    print(f"{rating}  [{row.get('source')}]  {row.get('hotelName')}")
    if row.get("ownerResponse"):
        print("   ↳ hotel responded")
