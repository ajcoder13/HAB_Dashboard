import { Router } from "express";
import metricsRoutes from "./metrics/metrics.routes.js";
import logsRoutes from "./logs/logs.routes.js";

const router = Router();

router.use("/metrics", metricsRoutes);
router.use("/logs", logsRoutes);

export default router;
