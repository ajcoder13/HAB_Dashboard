import dotenv from "dotenv";
import app from "./app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { startMetricsScheduler } from "./modules/metrics/metrics.scheduler.js";
import { setupRealtimeSystem } from "./lib/connection.js";
import { initMetricsTable } from "./modules/metrics/metrics.init.js";

dotenv.config({ quiet: true });

await initMetricsTable();

startMetricsScheduler();

const PORT = process.env.PORT || 3004;

const server = createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(`Frontend client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Frontend client disconnected: ${socket.id}`);
  });
});

await setupRealtimeSystem(io);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
