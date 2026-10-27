import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');

export const socket = io(socketUrl, {
    autoConnect: false,        // we connect manually, when a page needs it
    withCredentials: true,     // or pass auth: { token } — depends on your auth
});

socket.on('connect_error', (error) => {
    console.error('Socket connection failed:', error.message);
});
