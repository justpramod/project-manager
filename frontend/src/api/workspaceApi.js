import axiosClient from "./axiosClient";

const getWorkspace = async (params = {}) => {
    const res = await axiosClient.get('/workspace', { params });
    return res.data;
}

const getAWorkspace = async (workspaceId) => {
    const res = await axiosClient.get(`/workspace/${workspaceId}`);
    return res.data;
}

const getProjects = async (params = {},workspaceId) => {
    const res = await axiosClient.get(`/workspace/${workspaceId}/projects`, { params });
    return res.data;
}

const createWorkspace = async ( name ) => {
    const res = await axiosClient.post('/workspace', name);
    return res.data;
}

const addMember = async({email, role,  workspaceId})=>{

    const res = await axiosClient.post(`/workspace/${workspaceId}/members`, {email: email, role: role});
    return res;

}

export { getWorkspace, getAWorkspace, getProjects, createWorkspace, addMember };