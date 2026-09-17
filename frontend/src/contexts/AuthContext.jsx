import { createContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe } from "../api/authApi";

export const authContext = createContext(); 

export const AuthProvider = ({children})=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{

        const checkAuth = async()=>{
            
            const token = localStorage.getItem('token');
            if(!token){
                setLoading(false)
                return 
            }
            try{
                    const currentUser = await getMe();
                    setUser(currentUser);
            }
            catch(e){
                    localStorage.removeItem('token');
            }
            finally{
                setLoading(false);
            }

        };
       checkAuth(); 
    }, [])



 const login = async(credentials)=>{

    const data = await loginUser(credentials);
    localStorage.setItem('token', data.token);
    setUser(data);
};

 const register = async(userData)=>{

    const data = await registerUser(userData);
    localStorage.setItem('token', data.token);
    setUser(data);
};

 const logout = async()=>{

    localStorage.removeItem('token');
    setUser(null);
};


return (
    <authContext.Provider value={{user, loading, login, register, logout}} >
        {children}
    </authContext.Provider>
)
};