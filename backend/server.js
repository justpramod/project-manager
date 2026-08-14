require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
app.use(express.json());

connectDB();

app.listen(PORT, ()=> console.log(`Server running on http://localhost: ${PORT}`));
