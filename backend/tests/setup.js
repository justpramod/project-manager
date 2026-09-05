require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { initSocket } = require('../utils/socket');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);

    const dummyServer = http.createServer();
    initSocket(dummyServer);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});