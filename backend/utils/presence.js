const presence = new Map();

const addPresence = (workspaceId, userId) => {
    if (!presence.has(workspaceId)) presence.set(workspaceId, new Map());

    const users = presence.get(workspaceId);
    const count = users.get(userId) || 0;
    users.set(userId, count + 1);

    return count === 0;
};

const removePresence = (workspaceId, userId) => {
    const users = presence.get(workspaceId);
    const count = users?.get(userId) || 0;

    if (count === 0) return false;
    if (count === 1) {
        users.delete(userId);
        if (users.size === 0) presence.delete(workspaceId);
        return true;
    }

    users.set(userId, count - 1);
    return false;
};

const onlineIds = (workspaceId) => [
    ...(presence.get(workspaceId)?.keys() || [])
];

module.exports = { addPresence, removePresence, onlineIds };