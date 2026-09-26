import axiosClient from "./axiosClient";

export const getWorkspace = async (params = {}) => {
    const res = await axiosClient.get('/workspace', { params });
    return res.data;
} 

export const createWorkspace = async({name})=>{
    const res = await axiosClient.post('/workspace', {name});
    return res.data;

}