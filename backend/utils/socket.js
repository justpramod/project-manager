require('dotenv').config();
const mongoose = require('mongoose');
const { Server } = require('socket.io');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const Workspace = require('../models/Workspace');
const { verifyToken } = require('../middleware/authMiddleware');
const { addPresence, removePresence, onlineIds } = require('./presence');
let io;
// initSocket sets the module-level io variable once.
function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || origin === process.env.CLIENT_URL || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                    return callback(null, true);
                }
                return callback(new Error(`Socket origin not allowed: ${origin}`));
            },
            credentials: true,
        }
    });

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            const decoded = verifyToken(token);
            const user = await User.findById(decoded.id).select('-password');
            if (!user) return next(new Error('Unauthorized'));
            socket.user = user;
            next();
        } catch {
            next(new Error('Unauthorized'));
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected: ', socket.id);
        const userRoom = socket.user._id.toString();
        socket.workspaceIds = new Set();
        socket.join(userRoom);

        const emitPresence = (workspaceId) => {
            io.to(workspaceId).emit('presenceChanged', {
                workspaceId,
                onlineUserIds: onlineIds(workspaceId)
            });
        };

        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        socket.on('joinTask', async (taskId, acknowledge) => {
            try {
                if (!mongoose.isValidObjectId(taskId)) {
                    return acknowledge?.({ ok: false, message: 'Invalid task ID' });
                }

                const task = await Task.findById(taskId).select('project');
                const project = task && await Project.findById(task.project).select('workspace');
                const workspace = project && await Workspace.findById(project.workspace).select('members');
                const isMember = workspace?.members.some((member) => member.user.toString() === userRoom);

                if (!isMember) {
                    return acknowledge?.({ ok: false, message: 'Unauthorized' });
                }

                socket.join(taskId);
                console.log(`Socket ${socket.id} joined task room ${taskId}`);
                acknowledge?.({ ok: true });
            } catch (error) {
                console.error('Task room join failed:', error);
                acknowledge?.({ ok: false, message: 'Unable to join task room' });
            }
        });

        socket.on('leaveTask', (taskId, acknowledge) => {
            socket.leave(taskId);
            console.log(`Socket ${socket.id} left task room ${taskId}`);
            acknowledge?.({ ok: true });
        });

        socket.on('joinProject', async (projectId, acknowledge) => {
            try {
                if (!mongoose.isValidObjectId(projectId)) {
                    return acknowledge?.({ ok: false, message: 'Invalid project ID' });
                }

                const project = await Project.findById(projectId).select('workspace');
                const workspace = project && await Workspace.findById(project.workspace).select('members');
                const isMember = workspace?.members.some((member) => member.user.toString() === userRoom);
                if (!isMember) {
                    return acknowledge?.({ ok: false, message: 'Unauthorized' });
                }

                socket.join(projectId);
                console.log(`Socket ${socket.id} joined Project room ${projectId}`);
                acknowledge?.({ ok: true });
            } catch (error) {
                console.error('Project room join failed:', error);
                acknowledge?.({ ok: false, message: 'Unable to join project room' });
            }
        });

        socket.on('leaveProject', (projectId, acknowledge) => {
            socket.leave(projectId);
            console.log(`Socket ${socket.id} left Project room ${projectId}`);
            acknowledge?.({ ok: true });
        });

        socket.on('leaveWorkspace', (workspaceId, acknowledge) => {
            if (!socket.rooms.has(workspaceId)) {
                return acknowledge?.({ ok: true });
            }

            socket.leave(workspaceId);
            socket.workspaceIds.delete(workspaceId);
            if (removePresence(workspaceId, userRoom)) {
                socket.to(workspaceId).emit('presenceUpdate', {
                    userId: userRoom,
                    online: false
                });
            }
            console.log(`Socket ${socket.id} left Workspace room ${workspaceId}`);
            acknowledge?.({ ok: true });
        });
        
        socket.on('joinWorkspace', async (workspaceId, acknowledge) => {
            try {
                if (!mongoose.isValidObjectId(workspaceId)) {
                    return acknowledge?.({ ok: false, message: 'Invalid workspace ID' });
                }

                const workspace = await Workspace.findById(workspaceId).select('members');
                const isMember = workspace?.members.some((member) => member.user.toString() === userRoom);
                if (!isMember) {
                    return acknowledge?.({ ok: false, message: 'Unauthorized' });
                }
                const wasIn = socket.rooms.has(workspaceId);
                socket.join(workspaceId);

                if (!wasIn) {
                    socket.workspaceIds.add(workspaceId);
                    if (addPresence(workspaceId, userRoom)) {
                        socket.to(workspaceId).emit('presenceUpdate', { userId: userRoom, online: true });
                    }
                }
                acknowledge?.({ ok: true, onlineIds: onlineIds(workspaceId) });
                
                console.log(`Socket ${socket.id} joined Workspace room ${workspaceId}`);
                acknowledge?.({ ok: true });
            } catch (error) {
                console.error('Workspace room join failed:', error);
                acknowledge?.({ ok: false, message: 'Unable to join workspace room' });
            }
        });

        socket.on('disconnecting', () => {
            for (const workspaceId of socket.workspaceIds) {
                if (removePresence(workspaceId, userRoom)) {
                    socket.to(workspaceId).emit('presenceUpdate', {
                        userId: userRoom,
                        online: false
                    });
                }
            }
            socket.workspaceIds.clear();
        });

        socket.on('disconnect', () => {
            console.log('User disconected: ', socket.id);
        });
        //  socket.onAny((event, ...args) => console.log('socket event:', event, args));
       // log all events for debugging
    });
    io.engine.on('connection_error', (error) => {
        console.error('Socket connection error:', error.message);
    });
    
    return io;
}

// controllers will later call getIO() at request time (not at import time).
function getIO() {
    if (!io) throw new Error('Socket.io not initialized yet');
    return io;
}

module.exports = { initSocket, getIO };