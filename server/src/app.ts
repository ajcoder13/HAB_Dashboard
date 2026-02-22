import express, { type Request, type Response } from "express";
import routes from "./routes.js";

const app = express();

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

export default app;
