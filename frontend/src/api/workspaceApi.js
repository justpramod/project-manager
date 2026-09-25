import axiosClient from "./axiosClient";

export const getWorkspace = async()=>{

    const res = await axiosClient.get('/workspace');
    return res.data;
} 

export const createWorkspace = async(name)=>{
    const res = await axiosClient.post('/workspace', name);
    return res.data;

}