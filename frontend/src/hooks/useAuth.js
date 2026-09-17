import { useContext } from 'react';
import { authContext } from '../contexts/AuthContext';

export const useAuth = ()=> useContext(authContext);