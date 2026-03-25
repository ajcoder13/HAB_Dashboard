import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

const pgListener = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

export async function setupRealtimeSystem() {
  try {
    await pgListener.connect();
    console.log('Dedicated PostgreSQL client connected for LISTEN/NOTIFY');

    await pgListener.query('LISTEN db_updates');

    pgListener.on('notification', (msg) => {
      if (msg.channel === 'db_updates') {
        const payload = JSON.parse(msg.payload || '{}');
        console.log('Database update detected:', payload);

        io.emit('db_updated', payload);
      }
    });

  } catch (error) {
    console.error('Failed to setup real-time system:', error);
  }
}

io.on('connection', (socket) => {
  console.log(`Frontend client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Frontend client disconnected: ${socket.id}`);
  });
});