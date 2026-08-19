# Output fields

The MakeMyTrip &amp; Goibibo Reviews Scraper emits **two datasets**: **Reviews** (one row per public review) and
**Hotels** (one summary row per property, free). Related fields are clubbed for tidy JSON and CSV. The `source` field
(`makemytrip` / `goibibo`) tells you which platform each row came from. Fields that a given platform doesn't provide
are `null`.

## Reviews dataset

One row per guest review.

| Field | Type | Description |
|---|---|---|
| `reviewId` | string | Unique review identifier from the source. |
| `hotelId` | string | Shared 18-digit hotel identifier (common to MakeMyTrip and Goibibo). |
| `hotelName` | string | Hotel display name. |
| `hotelUrl` | string \| null | URL of the hotel page that produced this review (`null` when the input was a raw hotel ID; per-review permalinks are not available). |
| `source` | string | `makemytrip` (MakeMyTrip) or `goibibo` (Goibibo). |
| `submittedAt` | string \| null | Review submission date as `YYYY-MM-DD` (the source provides date precision only, no time). |
| `checkInMonth` | string \| null | Guest's stay month as `YYYY-MM` (the source stores month precision). |
| `reviewer` | object | Reviewer profile, clubbed: `{ name, isAnonymous, reviewsWritten }`. `name` is `null` when anonymous. `reviewsWritten` is the reviewer's lifetime review-count label (Goibibo rows only, e.g. `"2 Reviews Written"`), `null` otherwise. |
| `travelType` | string \| null | Travel type label (Business / Family / Friends / Solo / Couple / Other). |
| `roomName` | string \| null | Room type the guest booked. |
| `overallRating` | number \| null | Overall guest rating on a 0-5 scale. |
| `reviewText` | string \| null | Review body text. |
| `title` | string \| null | Review headline / title when present. |
| `usefulCount` | integer | Helpful (upvote) count on the review. |
| `imagesCount` | integer | Number of photos attached to the review. |
| `images` | array | Review photos, clubbed as `{ url, aiTags }` items. `aiTags` are the source's AI-generated scene tags (MakeMyTrip only; empty for Goibibo). |
| `ownerResponse` | object \| null | Hotel-management reply, clubbed: `{ text, date }`, or `null` when the hotel has not replied. `date` is the response date (naive local date). |
| `extractedAt` | string (ISO datetime) | When this row was scraped (UTC ISO 8601). |
| `markdownContent` | string \| null | **LLM-ready** self-contained markdown block for the review, drop straight into a RAG pipeline. |

## Hotels dataset (free)

One summary row per property. Not billed.

| Field | Type | Description |
|---|---|---|
| `hotelId` | string | Shared 18-digit hotel identifier (common to MakeMyTrip and Goibibo). |
| `hotelName` | string | Hotel display name. |
| `source` | string | `makemytrip` or `goibibo`, the platform the hotel details were read from. |
| `url` | string \| null | Hotel URL (`null` when the input was a raw hotel ID). |
| `hotelStars` | number \| null | Official star classification. |
| `propertyType` | string \| null | Property type label (e.g. Resort, Hotel, Homestay). |
| `hotelAddress` | string \| null | Street address. |
| `pinCode` | string \| null | Postal / PIN code. |
| `geoLat` | number \| null | Latitude. |
| `geoLong` | number \| null | Longitude. |
| `overallRating` | number \| null | Aggregate guest rating on a 0-5 scale. |
| `ratingLabel` | string \| null | Hotel-tier label (Excellent, Very Good, Good, ...). |
| `reviewsCount` | integer | Total reviews available on the platform for this hotel. |
| `subRatings` | array | Aggregate hotel sub-ratings clubbed into a labeled-string array (nulls omitted), e.g. `["Location: 4.5", "Cleanliness: 4.5", "Facilities: 4.3", "Food: 4.2", "Room: 4.2", "Value For Money: 4.1", "Child Friendliness: 4.3"]`. Renders as a single tidy cell in CSV. |
| `extractedAt` | string (ISO datetime) | When this hotel summary was written (UTC ISO 8601). |

## Dataset views

Both datasets are accessible via the **Output-tab dropdown** in the Apify Console. The **Reviews** dataset ships two
pre-built views you can switch between in the UI or request via the API:

- **Overview**, the columns most users want first (hotel, `source`, submitted date, reviewer, travel type, room,
  rating, review text, owner response, the `images` array).
- **AI ingest (LLM-ready)**, `markdownContent` plus the original text, rating, travel type, and source, optimized for
  vector-DB / RAG loading.
