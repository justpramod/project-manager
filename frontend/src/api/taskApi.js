import axiosClient from "./axiosClient";

const createTask = async({title, description, status, priority, assignee, projectId})=>{

    const res = await axiosClient.post(`/projects/${projectId}/tasks`, 
        {
            title: title, description, status, priority, assignee,
        });
    return res;
}

const updateTask = async (taskId, fields) => {
    return axiosClient.put(`/tasks/${taskId}`, fields);
}

export { createTask, updateTask };