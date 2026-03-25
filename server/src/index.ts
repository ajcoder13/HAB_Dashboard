import dotenv from "dotenv";
import app from "./app.js";
import { startMetricsScheduler } from "./modules/metrics/metrics.scheduler.js";
import { setupRealtimeSystem } from "./lib/connection.js";

dotenv.config({ quiet: true });

startMetricsScheduler();

const PORT = process.env.PORT || 3000;

await setupRealtimeSystem();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
