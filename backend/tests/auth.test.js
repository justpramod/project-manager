require('./setup');
const request = require('supertest');
const app = require('../app');

describe('Auth', () => {
    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
    });
    test('Prohibit registering new user with already registered email', async() =>{
        const res = await request(app)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/already exists/i);
    });

    test('should logged in the user', async()=>{
        const res = await request(app).post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'password123'
                });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.email).toBe('test@example.com');
    });

    test('Incorrect password', async()=>{
        const res = await request(app).post('/api/auth/login')
                .send({
                    email: 'test@example.com',
                    password: 'pass123'
                });
        expect(res.statusCode).toBe(401);
        expect(res.body.message).toMatch(/Invalid Credentials/i);
    });
});