# MakeMyTrip & Goibibo Hotels & Reviews Scraper

> Extract public **hotel reviews and full hotel details from both MakeMyTrip and Goibibo in a single run** — with
> review **photos + AI scene-tags**, **hotel owner responses**, per-hotel **sub-ratings**, and an **LLM-ready markdown
> field** for direct RAG ingestion. Runs on [Apify](https://apify.com/factden/makemytrip-scraper?fpr=factden).

[![Run on Apify](https://img.shields.io/badge/Run%20on-Apify-00b04f?logo=apify&logoColor=white)](https://apify.com/factden/makemytrip-scraper?fpr=factden)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

This repo is the **developer entry point** for the MakeMyTrip & Goibibo Reviews Scraper actor: the output shape,
copy-paste API snippets, a full [field dictionary](./FIELDS.md), and a short [how-to](./HOWTO.md). The actor itself
runs on Apify — no login, proxy, or anti-bot setup required.

**▶ [Run it on Apify →](https://apify.com/factden/makemytrip-scraper?fpr=factden)**

---

## What it extracts

Give it **MakeMyTrip** hotel URLs, **Goibibo** hotel URLs, raw **hotel IDs**, or a mix of all three — MakeMyTrip and
Goibibo share one hotel identity, so both brands' guest-review feeds resolve for the same property — and get two clean,
structured datasets:

- **Reviews** — one row per guest review: overall rating, title, body, travel type, room, stay month, submission date,
  the reviewer (name / anonymity / lifetime review count on Goibibo), review **photos with AI scene-tags**, the hotel's
  **owner response**, and an LLM-ready `markdownContent` block.
- **Hotels (free)** — one summary row per property: star class, property type, address, PIN code, geo-coordinates,
  aggregate rating, tier label, total review count, and the clubbed sub-ratings (Location, Cleanliness, Facilities,
  Food, Room, Value for Money, Child-friendliness).

Every row carries a `source` field — `makemytrip` or `goibibo` — so you always know which platform it came from.

### Two things you won't find here (yet)

This actor reads **reviews and hotel details**. Two adjacent capabilities are deliberately **out of scope** for now and
deferred to a future release:

- 🚫 **Live room rates / prices.** This actor does not return nightly prices, room-rate ladders, or availability. For
  live hotel pricing across OTAs, see our [Google Hotels Scraper](https://apify.com/factden/google-hotels-scraper?fpr=factden).
- 🚫 **Keyword / city discovery search.** There is no "search Goa hotels" mode — you supply the specific hotel URLs or
  hotel IDs you want. Discovery-by-city is on the roadmap.

Everything else — dual-brand reviews, free hotel profiles, photos, owner responses, RAG markdown — is here today.

---

## Quick start (API)

```python
from apify_client import ApifyClient

client = ApifyClient("<YOUR_APIFY_TOKEN>")
run = client.actor("factden/makemytrip-scraper").call(run_input={
    "startUrls": [
        "https://www.makemytrip.com/hotels/hotel-details/?hotelId=200703241029455940&city=CTGOI&country=IN",
        "https://www.goibibo.com/hotels/hard-rock-goa-hotel-in-goa-6204281054243107966/",
    ],
    "reviewSource": "auto",
    "maxReviewsPerHotel": 100,
    "sortBy": "mostRecent",
})
for row in client.dataset(run["defaultDatasetId"]).iterate_items():
    print(row["overallRating"], row["hotelName"], "—", row["source"])
```

More: **[Python](./snippets/run_actor.py)** · **[Node](./snippets/run_actor.js)** · **[curl](./snippets/run_actor.sh)**

---

## Output

Sample input and output live in **[`examples/`](./examples)**:

- [`examples/input.json`](./examples/input.json) — a ready-to-run input (one MakeMyTrip hotel + one Goibibo hotel)
- [`examples/reviews-output.sample.json`](./examples/reviews-output.sample.json) — real review rows (MakeMyTrip +
  Goibibo) showing the full output shape incl. the nested `reviewer` / `ownerResponse` objects and the `images` array
- [`examples/hotels-output.sample.json`](./examples/hotels-output.sample.json) — the free **Hotels** summary row: star
  class, geo-coordinates, tier label, and the clubbed `subRatings` array

Every field is documented in **[`FIELDS.md`](./FIELDS.md)**. From Apify you can download results as **JSON, CSV, Excel,
or HTML** — and switch the Output-tab dropdown between the **Reviews** and **Hotels** datasets.

---

## Use cases

- **Hospitality competitive intelligence** — track guest sentiment, sub-ratings, and owner-response rates across
  competitor hotels on both MakeMyTrip and Goibibo.
- **Reputation / guest-experience monitoring** — pull new reviews on a schedule and watch rating trends per property.
- **OTA & market analysis** — compare the same hotel's MakeMyTrip audience vs its Goibibo audience in one dataset.
- **AI / RAG pipelines** — drop `markdownContent` straight into a vector DB; it is chunk-ready.

---

## How much does it cost?

Pay-per-event on Apify: **$0.0025 per review ($2.50 per 1,000), hotel details free, no per-run start fee** (down to
$2.00 per 1,000 on higher plans). New Apify accounts get **$5 in free credit** — enough for ~2,000 reviews. See the
[actor page](https://apify.com/factden/makemytrip-scraper?fpr=factden) for current pricing.

---

## FAQ

**Is scraping MakeMyTrip / Goibibo reviews legal?** The actor collects only **publicly available** review data. As with
any scraping, review the platforms' Terms of Service and your local regulations (GDPR, India's DPDP Act, etc.), and use
the data responsibly.

**Do I need a MakeMyTrip / Goibibo account or proxies?** No. Everything runs inside the actor on Apify's
infrastructure; the built-in datacenter proxy is bundled.

**Can I mix MakeMyTrip and Goibibo URLs?** Yes — that's the point. Put both in `startUrls` (or set
`reviewSource: "both"` to pull both brands' reviews for the same hotel). The `source` field on every row tells you
which platform it came from.

**Found a bug or want a field added?** Open an issue here, or use the **Issues** tab on the
[Apify actor page](https://apify.com/factden/makemytrip-scraper?fpr=factden).

---

## Other scrapers by FactDen

- [Trip.com & Ctrip Reviews Scraper](https://apify.com/factden/ctrip-trip-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/ctrip-trip-reviews-scraper))
- [Google Hotels Scraper](https://apify.com/factden/google-hotels-scraper?fpr=factden)
  ([docs](https://github.com/factden/google-hotels-scraper))
- [Expedia Hotel Reviews Scraper](https://apify.com/factden/expedia-hotel-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/expedia-hotel-reviews-scraper))
- [Hotels.com Reviews Scraper](https://apify.com/factden/hotels-com-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/hotels-com-reviews-scraper))
- [G2 Reviews Scraper](https://apify.com/factden/g2-reviews-scraper?fpr=factden)
  ([docs](https://github.com/factden/g2-reviews-scraper))
- [Indeed Jobs Scraper](https://apify.com/factden/indeed-jobs-scraper?fpr=factden)
  ([docs](https://github.com/factden/indeed-jobs-scraper))
- [All FactDen actors →](https://apify.com/factden?fpr=factden)

---

_The `examples/` files are real public review data collected with the actor, provided for documentation/evaluation.
Run the actor on Apify to pull live data for any hotel, at any scale._

_Found this useful? A star on this repo helps other people find it._
