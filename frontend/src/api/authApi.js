import axiosClient from "./axiosClient";

export const registerUser = async (userData)=>{

    const res = await axiosClient.post('auth/register', userData);
    return res.data;
};

export const loginUser = async (Credential)=>{
    const res = await axiosClient.post('auth/login', Credential);
    return res.data;
};

export const getMe = async ()=>{
    const res = await axiosClient.get('auth/me');
    return res.data;
};