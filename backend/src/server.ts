import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import messageRoutes from './routes/message';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());
app.use('/api',authRoutes);
app.use('/api',userRoutes);
app.use('/api',messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on('connection', (socket) => {
  console.log('Connected');

    socket.on('sendMessage', async ({ content, senderId, receiverId }) => {
        const message = await prisma.message.create({
            data: { content, senderId,receiverId },
        });

        io.emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Disconnected');
    });
});

const PORT = process.env.SERVER_PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
