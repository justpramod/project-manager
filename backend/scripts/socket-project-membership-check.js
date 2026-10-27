const { io } = require('socket.io-client');

const baseUrl = process.env.BASE_URL || 'http://localhost:5050';
const projectId = process.env.PROJECT_ID;
const taskTitle = process.env.TASK_TITLE || `Socket membership check ${Date.now()}`;

const required = [
    'OUTSIDER_EMAIL',
    'OUTSIDER_PASSWORD',
    'MEMBER_EMAIL',
    'MEMBER_PASSWORD',
    'PROJECT_ID',
];

for (const name of required) {
    if (!process.env[name]) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
}

async function login(email, password) {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const body = await response.json();
    if (!response.ok || !body.token) {
        throw new Error(`Login failed for ${email}: ${response.status} ${JSON.stringify(body)}`);
    }

    return body;
}

function waitForConnection(socket) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Socket connection timed out')), 5000);
        socket.once('connect', () => {
            clearTimeout(timeout);
            resolve();
        });
        socket.once('connect_error', (error) => {
            clearTimeout(timeout);
            reject(error);
        });
    });
}

function joinProject(socket, id) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('joinProject ack timed out')), 5000);
        socket.emit('joinProject', id, (result) => {
            clearTimeout(timeout);
            resolve(result);
        });
    });
}

async function createTask(token, id) {
    const response = await fetch(`${baseUrl}/api/projects/${id}/tasks`, {
        method: 'POST',
        headers: {
            authorization: `Bearer ${token}`,
            'content-type': 'application/json',
        },
        body: JSON.stringify({ title: taskTitle }),
    });

    const body = await response.json();
    if (!response.ok) {
        throw new Error(`Task creation failed: ${response.status} ${JSON.stringify(body)}`);
    }

    return body;
}

async function main() {
    const outsider = await login(process.env.OUTSIDER_EMAIL, process.env.OUTSIDER_PASSWORD);
    const member = await login(process.env.MEMBER_EMAIL, process.env.MEMBER_PASSWORD);

    console.log(`Outsider token: ${outsider.token}`);

    const socket = io(baseUrl, { auth: { token: outsider.token } });
    let receivedNewTask = false;
    socket.on('newTask', (task) => {
        receivedNewTask = true;
        console.error('Unexpected newTask received by outsider:', task);
    });

    try {
        await waitForConnection(socket);

        const joinResult = await joinProject(socket, projectId);
        console.log('joinProject ack:', joinResult);
        if (!joinResult || joinResult.ok !== false) {
            throw new Error('Expected outsider joinProject ack to contain { ok: false }');
        }

        const taskResult = await createTask(member.token, projectId);
        console.log('Created task as real member:', taskResult.task?._id || taskResult);

        await new Promise((resolve) => setTimeout(resolve, 500));
        if (receivedNewTask) {
            throw new Error('Outsider received newTask after the member created a task');
        }

        console.log('PASS: outsider was denied project access and received no newTask event.');
    } finally {
        socket.disconnect();
    }
}

main().catch((error) => {
    console.error('FAIL:', error.message);
    process.exitCode = 1;
});