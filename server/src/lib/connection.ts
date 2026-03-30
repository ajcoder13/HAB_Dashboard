import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Client } from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

const pgListener = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

export async function setupRealtimeSystem(io: Server) {
  try {
    await pgListener.connect();
    console.log("PostgreSQL LISTEN client connected");

    await pgListener.query("LISTEN db_updates");

    pgListener.on("notification", (msg) => {
      if (msg.channel === "db_updates") {
        const payload = JSON.parse(msg.payload || "{}");
        console.log("DB update:", payload);

        const emitPayload = {
          table: payload.table,
          action: payload.action,
          record: payload.data,
        };

        io.emit("db_updated", emitPayload);
      }
    });
  } catch (error) {
    console.error("Realtime setup failed:", error);
  }
}
