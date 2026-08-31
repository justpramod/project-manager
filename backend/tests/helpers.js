const request = require('supertest');
const app = require('../app');

const registerAndLogin = async (overrides={})=>{
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random()*10000)}`;
    const userData = {
        username: `testuser${uniqueSuffix}`,
        email: `test${uniqueSuffix}@gmail.com`,
        password: 'password123',
        ...overrides
    };
    const res= await request(app)
    .post('/api/auth/register')
    .send(userData);

    return {
        token:  res.body.token,
        userId: res.body._id,
        email: userData.email
    };

};
module.exports = {registerAndLogin};