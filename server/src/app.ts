import express, { type Request, type Response } from "express";
import cors from "cors";
import routes from "./routes.js";

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/health", (_: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/api", routes);

export default app;
