import axiosClient from './axiosClient';

const createProject = async(params = {}, {workspaceId})=>{
   
    const res = await axiosClient.post(`/workspace/${workspaceId}/projects`, {params});
    return res;
}

export { createProject };