require('./setup');
const request = require('supertest');
const app = require('../app');
const { registerAndLogin, createWorkspaceAndProject } = require('./helpers');

describe('tasks', () => {
    test('workspace member can create a task', async () => {
        const owner = await registerAndLogin();
        const { projectId, workspaceId } = await createWorkspaceAndProject(owner.token);
        const member = await registerAndLogin();

        const addRes = await request(app)
        .post(`/api/workspace/${workspaceId}/members`)
        .set('Authorization', `Bearer ${owner.token}`)
        .send({email: member.email});
        expect(addRes.statusCode).toBe(200);

        const res = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({ title: 'Some task', description: 'something here', assignee: member.email, status: 'todo', priority: 'high' });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/Task created/i);
    });

    test('non-member cannot access a task in the workspace', async () => {
        const owner = await registerAndLogin();
        const { projectId } = await createWorkspaceAndProject(owner.token);

        const taskRes = await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({ title: 'Private task' });

        const taskId = taskRes.body.task._id;

        const outsider = await registerAndLogin();

        const getRes = await request(app)
            .get(`/api/tasks/${taskId}`)
            .set('Authorization', `Bearer ${outsider.token}`);

        expect(getRes.statusCode).toBe(403);
    });

    test('member can sort tasks by a supported field', async () => {
        const owner = await registerAndLogin();
        const { projectId } = await createWorkspaceAndProject(owner.token);

        await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({ title: 'Zebra task' });
        await request(app)
            .post(`/api/projects/${projectId}/tasks`)
            .set('Authorization', `Bearer ${owner.token}`)
            .send({ title: 'Alpha task' });

        const res = await request(app)
            .get(`/api/projects/${projectId}/tasks`)
            .query({ sortBy: 'title', order: 'asc' })
            .set('Authorization', `Bearer ${owner.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.tasks.map(task => task.title)).toEqual(['Alpha task', 'Zebra task']);
    });
});