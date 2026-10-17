import axiosClient from "./axiosClient";

const createTask = async({title, description, status, priority, assignee, projectId})=>{

    const res = await axiosClient.post(`/projects/${projectId}/tasks`, 
        {
            title: title, description, status, priority, assignee,
        });
    return res;
}

export { createTask };