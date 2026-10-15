import axiosClient from './axiosClient';

const createProject = async({ projectName, description, workspaceId })=>{
    const res = await axiosClient.post(`/workspace/${workspaceId}/projects`, {
        name: projectName,
        description,
    });
    return res;
}

const getProject = async(projectId) => {

    const res = await axiosClient.get(`/projects/${projectId}`)
    return res.data;
}

const getTasks = async(params = {}, projectId) => {

    const res = await axiosClient.get(`/projects/${projectId}/tasks`, { params });
    return res.data;
}

export { createProject, getProject, getTasks };