import { Router } from "express";
import moduleRouter from "./modules/moduleRouter.js";

const router = Router();
router.use(moduleRouter);

export default router;
