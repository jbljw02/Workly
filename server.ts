import { Server } from '@hocuspocus/server'

const server = Server.configure({
    port: 1234,
    onConnect: async (data) => {
        console.log('Client connected:', data);
    },
    onDisconnect: async (data) => {
        console.log('Client disconnected:', data);
    },
});

server.listen()