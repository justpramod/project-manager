require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
const workspaceRouter = require('./routes/workspaceRouter');
const projectRouter = require('./routes/projectRoutes');
const taskRouter = require('./routes/taskRoutes');
const uploads = require('./config/multer');

app.use(express.json());

connectDB();

app.use('/api/auth', authRouter);

app.use('/api/workspace',workspaceRouter); //includes workspace routes as well as nested project routes within it.
app.use('/api/projects', projectRouter); // includes project routes as well as nested task routes.
app.use('/api/tasks',taskRouter); // also handles coments CRUD
 
app.use('/uploads', express.static('uploads'));

app.listen(PORT, ()=> console.log(`Server running on http://localhost: ${PORT}`));