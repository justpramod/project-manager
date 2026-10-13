import axiosClient from './axiosClient';

const createProject = async({ projectName, description, workspaceId })=>{
    const res = await axiosClient.post(`/workspace/${workspaceId}/projects`, {
        name: projectName,
        description,
    });
    return res;
}

export { createProject };