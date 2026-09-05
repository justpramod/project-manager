const request = require('supertest');
const app = require('../app');

const registerAndLogin = async (overrides = {}) => {
    const uniqueSuffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const userData = {
        username: `testuser${uniqueSuffix}`,
        email: `test${uniqueSuffix}@gmail.com`,
        password: 'password123',
        ...overrides
    };
    const res = await request(app).post('/api/auth/register').send(userData);
    return {
        token: res.body.token,
        userId: res.body._id,
        email: userData.email
    };
};

const createWorkspaceAndProject = async (token) => {
    
    const wsRes = await request(app)
        .post('/api/workspace')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Check_check' });
    console.log('workspace create:', wsRes.statusCode, wsRes.body);
    const workspaceId = wsRes.body.workspace._id;

    const projRes = await request(app)
        .post(`/api/workspace/${workspaceId}/projects`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'testProject', description: 'Just in case description' });

    return { workspaceId, projectId: projRes.body.project._id };
};

module.exports = { registerAndLogin, createWorkspaceAndProject };