# How to scrape MakeMyTrip and Goibibo hotel reviews (the easy way)

Scraping MakeMyTrip and Goibibo directly is painful: anti-bot defenses, session requirements, rotating proxies, and a
shared hotel identity that splits the same property's reviews across two brands. This guide skips all of that by using
the [MakeMyTrip &amp; Goibibo Reviews Scraper](https://apify.com/factden/makemytrip-scraper?fpr=factden) actor on
Apify — no login, no proxy setup, no anti-bot tuning.

## 1. Get an Apify token

Create a free [Apify](https://console.apify.com/sign-up?fpr=factden) account and copy your API token from
**Settings → Integrations**. New accounts include $5 of free credit (about 2,000 reviews).

## 2. Run it from the Console (no code)

1. Open the [actor page](https://apify.com/factden/makemytrip-scraper?fpr=factden) and click **Try for free**.
2. The input is pre-filled with two example hotels — one MakeMyTrip URL and one Goibibo URL. Leave them or replace with
   your own hotel URLs (or raw hotel IDs).
3. Click **Start**. A small run finishes in well under a minute.
4. Download results from the **Output** tab as JSON, CSV, or Excel — switch the dropdown between **Reviews** and
   **Hotels**.

## 3. Or run it from code

### Python

```python
from apify_client import ApifyClient

client = ApifyClient("<YOUR_APIFY_TOKEN>")
run = client.actor("factden/makemytrip-scraper").call(run_input={
    "startUrls": ["https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN"],
    "maxReviews": 200,
})
items = list(client.dataset(run["defaultDatasetId"]).iterate_items())
print(f"Got {len(items)} reviews")
```

See [`snippets/`](./snippets) for Node and curl versions.

## 4. Mix MakeMyTrip and Goibibo freely

Put both URL types in `startUrls`, or drop raw hotel IDs into `hotelIds`. Each link returns its own site's reviews
(a MakeMyTrip link -> MakeMyTrip reviews, a Goibibo link -> Goibibo reviews). The two brands share one hotel identity,
so adding both links for the same property gives you both feeds. The `source` field on every row (`makemytrip` /
`goibibo`) tells you which platform it came from, so you can split or merge the two corpora downstream.

```json
{
  "startUrls": [
    "https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN",
    "https://www.goibibo.com/hotels/hard-rock-goa-hotel-in-goa-6204281054243107966/"
  ]
}
```

## 5. Useful input options

| Option | What it does |
|---|---|
| `hotelIds` | Raw hotel IDs (18-digit = MakeMyTrip, 19-digit = Goibibo) instead of full URLs. |
| `maxReviews` | Max reviews per hotel (10–20,000). Each hotel bills a minimum of 10, the most recent. |
| `sortBy` | `mostRelevant`, `mostRecent`, `helpful`, `positive`, `negative`. |
| `fromDate` | Return only reviews on or after this date (`YYYY-MM-DD`). Applied after retrieval, not a fetch/bill limit. |

Full field reference: [`FIELDS.md`](./FIELDS.md). Full input format: [`examples/input.json`](./examples/input.json).

## 6. Get hotel details for free

Every run also emits a **Hotels** dataset — star class, property type, address, PIN code, geo-coordinates, aggregate
rating, tier label, and the clubbed sub-ratings — at no extra charge, on every run alongside the reviews.

## 7. Feed it to an LLM

Each review includes a ready-to-use `markdownContent` field — no formatting needed:

```python
docs = [row["markdownContent"] for row in items]
# embed `docs` into your vector DB / RAG pipeline
```

---

**▶ [Run the MakeMyTrip &amp; Goibibo Reviews Scraper on Apify →](https://apify.com/factden/makemytrip-scraper?fpr=factden)**
