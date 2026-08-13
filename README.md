# automatize — hot tours → VK publisher

TypeScript/Express backend that fetches (or mocks) tour deals, validates filters with Zod, formats posts, and publishes them to a VK community wall.

Useful as a small **automation / integrations** portfolio piece next to the larger TravelHub stack.

## Features

- `GET /health` — liveness
- `GET /tours` — list/filter tours (`minPrice`, `maxPrice`, `country`, `city`)
- Publish flow → VK `wall.post`
- Auth header modes for upstream tour APIs: `bearer` | `token` | `x-api-key` | `raw`
- Mock tours fallback when the upstream API is empty/unavailable
- Request logging + centralized error handler

## Stack

- Node.js 18+
- Express + TypeScript
- Axios · Zod · dotenv · CORS

## Quick start

```bash
cp .env.example .env
npm install
npm run dev
```

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/tours?maxPrice=80000&country=Turkey"
```

## Environment

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default `3000`) |
| `TOUR_API_URL` | Upstream tours API |
| `TOUR_API_TOKEN` | Optional API token |
| `TOUR_API_TOKEN_MODE` | `bearer` / `token` / `x-api-key` / `raw` |
| `VK_TOKEN` | VK access token |
| `VK_GROUP_ID` | Group id (e.g. `-123456789`) |

Never commit `.env`.

## Project layout

```text
src/
  index.ts                 # app bootstrap
  routes/                  # /tours, publish
  controllers/
  services/                # tourService, vkService
  validation/              # Zod schemas
  data/mockTours.ts
```

## Scripts

```bash
npm run dev      # ts-node-dev
npm run build    # tsc → dist/
npm start        # node dist/index.js
```

## Related

Part of the TravelHub ecosystem: [`travelhub-v2`](https://github.com/s1kata/travelhub-v2) · [`app`](https://github.com/s1kata/app) · [`microservice`](https://github.com/s1kata/microservice)
