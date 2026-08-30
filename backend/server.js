require("dotenv").config();
const http = require('http');
const app = require('./app');

const PORT = process.env.PORT || 3000;
const connectDB = require('./config/db');
const { initSocket } = require('./utils/socket');

connectDB();

const server = http.createServer(app);
initSocket(server);

server.listen(PORT, ()=> console.log(`Server running on http://localhost: ${PORT}`));