require('./setup');
const request = require('supertest');
const app = require('../app');
const { registerAndLogin } = require('./helpers');

describe('workspace', () => {

    test('create workspace', async () => {

        const { token } = await registerAndLogin();
        const res = await request(app)
            .post('/api/workspace')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Workspace'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Workspace created/i);
        expect(res.body.workspace.members[0].role).toBe('owner');

    });

    test('owner can add a member by email', async () => {
    const owner = await registerAndLogin();
    const secondUser = await registerAndLogin();

    const createRes = await request(app)
        .post('/api/workspace')
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ name: 'Team Workspace' });
    
    const workspaceId = createRes.body.workspace._id;

    const addRes = await request(app)
        .post(`/api/workspace/${workspaceId}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({ email: secondUser.email });

    expect(addRes.statusCode).toBe(200);

    const addedMember = addRes.body.workspace.members.find(m => m.user === secondUser.userId);
    expect(addedMember).toBeDefined();
    expect(addedMember.role).toBe('member');
});

test('non-onwer tries to delete workspace', async()=>{

const owner = await registerAndLogin();
const nonOwner = await  registerAndLogin();

const createRes = await request(app)
    .post('/api/workspace')
    .set('Authorization', `Bearer ${owner.token}`)
    .send({name: 'test workspace'});

const workspaceId = createRes.body.workspace._id;

 await request(app)
    .post(`/api/workspace/${workspaceId}/members`)
    .set('Authorization', `Bearer ${owner.token}`)
    .send({ email: nonOwner.email});


const deleteRes = await request(app)
    .delete(`/api/workspace/${workspaceId}`)
    .set('Authorization', `Bearer ${nonOwner.token}`);
expect(deleteRes.statusCode).toBe(403);
expect(deleteRes.body.message).toMatch(/Only the owner is allowed to do this!/i);

});

test('non member tries to get', async()=>{

    const owner = await registerAndLogin();
    const nonMember = await registerAndLogin();

    const createRes = await request(app)
    .post('/api/workspace')
    .set('Authorization', `Bearer ${owner.token}`)
    .send({name: 'new Workspace'});

    const workspaceId = createRes.body.workspace._id;

    const getRes = await request(app)
    .get(`/api/workspace/${workspaceId}`)
    .set('Authorization', `Bearer ${nonMember.token}`);

    expect(getRes.statusCode).toBe(403);
    expect(getRes.body.message).toMatch(/not a member of this workspace/i);

    
});
});