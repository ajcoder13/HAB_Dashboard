import dotenv from "dotenv";
import app from "./app.js";
import { startMetricsScheduler } from "./modules/metrics/metrics.scheduler.js";

dotenv.config({ quiet: true });

startMetricsScheduler();

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
