# MiMo Baby 👶

A friendly, "baby-words" re-skin of the official **MiMo v2.6 RL training dashboard**
([mimo.xiaomi.com/rl](https://mimo.xiaomi.com/rl/)).

It shows how Xiaomi's `mimo-v2.6-pro` and `mimo-v2.6-flash` reinforcement-learning
runs are going, in plain English and Indonesian — practice rounds, test scores,
the homework books, and how much the learning has cost so far (converted to
rupiah at a fixed 1 USD = 17,800 IDR).

## Live

- **https://mimo-baby-ten.vercel.app**

## Features

- Auto-refresh every 10 seconds, no backend of its own
- EN / ID language toggle
- Live score trend per run (SVG, no chart lib)
- DeepSWE benchmark scores + team notices from Xiaomi
- All data fetched through a server-side relay
  (`app/api/mimo/[...path]`) because `mimo.xiaomi.com` does not send CORS headers

## Upstream API (read-only, public)

| Endpoint                       | Data                                |
| ------------------------------ | ----------------------------------- |
| `GET /rl/api/runs`             | list of runs + pinned metric tags   |
| `GET /rl/api/status?run=<k>`   | run meta, cost, step events         |
| `GET /rl/api/live?run=<k>`     | live snapshot (passrate, datasets)  |
| `GET /rl/api/benchmarks`       | DeepSWE results per step            |
| `GET /rl/api/notices`          | team notes / restart announcements   |

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npx vercel --prod
```

## Stack

Next.js 15 (App Router) · React 19 · plain CSS (dark pastel) · Plus Jakarta Sans

Not affiliated with Xiaomi or MiMo. We are not Xiaomi.
