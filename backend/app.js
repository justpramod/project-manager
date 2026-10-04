const cors = require('cors');
const express = require('express');
const app = express();

const authRouter = require('./routes/authRoutes');
const workspaceRouter = require('./routes/workspaceRouter');
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const notificationRouter = require('./routes/notificationRoutes');

app.use(cors({origin: process.env.CLIENT_URL})); 

app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/workspace',workspaceRouter); //includes workspace routes as well as nested project routes within it.
app.use('/api/projects', projectRouter); // includes project routes as well as nested task routes.
app.use('/api/tasks',taskRouter); // also handles coments CRUD
app.use('/uploads', express.static('uploads'));
app.use('/api/notifications',notificationRouter);

// Error handler for multer and upload validation errors
app.use((err, req, res, next) => {
	console.error(err);
	if (err && err.name === 'MulterError') {
		if (err.code === 'LIMIT_FILE_SIZE') {
			return res.status(400).json({ message: 'File too large. Max size is 2MB' });
		}
		return res.status(400).json({ message: err.message });
	}

	if (err && typeof err.message === 'string' && err.message.includes('Only .jpg')) {
		return res.status(400).json({ message: err.message });
	}

	if (res.headersSent) return next(err);
	res.status(500).json({ message: 'Internal server error' });
});

module.exports = app;