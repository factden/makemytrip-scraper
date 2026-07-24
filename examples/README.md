# Examples

Sample input and real public review/hotel data collected with the actor.

- **`input.json`** — a ready-to-run actor input (one MakeMyTrip hotel + one Goibibo hotel, with `reviewSource: "auto"`).
- **`reviews-output.sample.json`** — real review rows showing the full field shape: a MakeMyTrip row (Caravela Beach
  Resort, with review `images` + AI scene-tags and a hotel `ownerResponse`) and a Goibibo row (Hard Rock Hotel Goa,
  with `reviewer.reviewsWritten` and no owner response). Shows the nested `reviewer` / `ownerResponse` objects and the
  `images` array.
- **`hotels-output.sample.json`** — the free **Hotels** summary row: star class, property type, address, PIN code,
  geo-coordinates, aggregate rating, tier label, total review count, and the clubbed `subRatings` array.

Run the actor for any hotel: **https://apify.com/factden/makemytrip-scraper?fpr=factden**
