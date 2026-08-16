require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const authRouter = require('./routes/authRoutes');
app.use(express.json());

connectDB();

app.use('/api/auth', authRouter);

app.listen(PORT, ()=> console.log(`Server running on http://localhost: ${PORT}`));
