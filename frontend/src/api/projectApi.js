import axiosClient from './axiosClient';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

export const getProject = async () => {

    const { worksapceId } = useParams();

    const res = axiosClient.get(`/workspace/${worksapceId}`)
    return res.data;

}

export const addMember = async(params = {})=>{

    const res = await axiosClient.put('/workspace/{')
}
