import { Router } from "express";
import {
  getLogs,
  getLogsById,
  deleteLogsDefault,
  deleteLogsByFilter,
  getLogsVolume,
} from "./logs.controller.js";

const router = Router();

router.get("/volume/:scale", getLogsVolume);
router.get("/", getLogs);
router.get("/id/:id", getLogsById);
router.delete("/all", deleteLogsDefault);
router.delete("/", deleteLogsByFilter);

export default router;
