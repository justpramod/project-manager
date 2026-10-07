import axiosClient from "./axiosClient";

export const uploadAvatar = async(file)=>{

    const formData = new FormData();
    formData.append('file', file);

    const res = await axiosClient.patch('/auth/avatar', formData);
    return res.data.avatarUrl;

}