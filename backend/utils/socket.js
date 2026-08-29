const { Server } = require('socket.io');
let io;

// initSocket sets the module-level io variable once.
function initSocket(server) {
    io = new Server(server, {
        cors: { origin: '*' }
    });

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);

        socket.on('joinUser', (userId)=>{
            socket.join(userId);
            console.log(`Socket ${socket.id} joined user room ${userId}`);
        });

        socket.on('joinTask', (taskId)=>{
            socket.join(taskId);
            console.log(`Socket ${socket.id} joined task room ${taskId}`);
        });

        socket.on('joinProject',(projectId)=>{
            socket.join(projectId);
            console.log(`Socket ${socket.id} joined Project room ${projectId}`);
        });
        
        socket.on('joinWorkspace',(workspaceId)=>{
            socket.join(workspaceId);
            console.log(`Socket ${socket.id} joined Workspace room ${workspaceId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconected: ', socket.id);
        });
    });
    return io;
}

// controllers will later call getIO() at request time (not at import time).
function getIO() {
    if (!io) throw new Error('Socket.io not initialized yet');
    return io;
}

module.exports = { initSocket, getIO };