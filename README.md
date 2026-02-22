# HAB_Dashboard

## Server setup

1. Create `.env` in `/server`

```env
PORT=3004
```

2. Run server

```
cd server
npm install
npm run dev
```

## API Endpoints:

### GET /api/metrics/:scale

`:scale` can be `1h`, `6h`, `24h`, `7d` or `30d`.
Get system metrics for the last `:scale` time scale.
