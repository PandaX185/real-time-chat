import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import messageRoutes from './routes/message';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('sendMessage', async ({ content, sender, receiver }) => {
    console.log('sendMessage event received:', { content, sender, receiver });
    try {
      const message = await prisma.message.create({
        data: { content, sender, receiver },
      });
      console.log('Message saved:', message);

      io.emit('receiveMessage', message);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
