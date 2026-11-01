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

const deleteTask = async (taskId) => {
    return axiosClient.delete(`/tasks/${taskId}`);
}

const getAttachments = async (taskId) => {
    return axiosClient.get(`/tasks/${taskId}/attachments`);
};

const uploadAttachment = async (taskId, file) => {
    // Create a FormData object to hold the file data for the upload request. This allows us to send the file as multipart/form-data, which is necessary for file uploads.
    const formData = new FormData();
    formData.append('file', file);
    return axiosClient.post(`/tasks/${taskId}/attachments`, formData);
};

const deleteAttachment = async (taskId, attachmentId) => {
    return axiosClient.delete(`/tasks/${taskId}/attachments/${attachmentId}`);
};

export { createTask, updateTask, deleteTask, getAttachments, uploadAttachment, deleteAttachment };