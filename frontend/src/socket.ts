import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const initiateSocket = () => {
    if (!socket) {
        socket = io('http://localhost:4000');
        console.log('Socket connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    }
};

export const getSocket = () => {
    return socket;
};
