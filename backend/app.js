const express = require('express');
const app = express();

const authRouter = require('./routes/authRoutes');
const workspaceRouter = require('./routes/workspaceRouter');
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const notificationRouter = require('./routes/notificationRoutes');

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workspace',workspaceRouter); //includes workspace routes as well as nested project routes within it.
app.use('/api/projects', projectRouter); // includes project routes as well as nested task routes.
app.use('/api/tasks',taskRouter); // also handles coments CRUD
app.use('/uploads', express.static('uploads'));
app.use('/api/notifications',notificationRouter);

module.exports = app;