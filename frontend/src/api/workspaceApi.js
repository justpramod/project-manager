import axiosClient from "./axiosClient";

const getWorkspace = async (params = {}) => {
    const res = await axiosClient.get('/workspace', { params });
    return res.data;
}

const getAWorkspace = async (workspaceId) => {
    const res = await axiosClient.get(`/workspace/${workspaceId}`);
    return res.data;
}

const getProjects = async (workspaceId) => {
    const res = await axiosClient.get(`/workspace/${workspaceId}/projects`);
    return res.data;
}

const createWorkspace = async ({ name }) => {
    const res = await axiosClient.post('/workspace', { name });
    return res.data;
}

export { getWorkspace, getAWorkspace, getProjects, createWorkspace };