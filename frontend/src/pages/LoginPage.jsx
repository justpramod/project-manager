import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoginPage(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{

        e.preventDefault();
        setError('');
        setSubmitting(true);
        try{
            await login({email, password});
            navigate('/dashboard');
        }
        catch(err){
            setError(err.response?.data?.message || 'Login Failed!');
        }
        finally{
            setSubmitting(false);
        }
    }

    return (
    <div className='grid place-content-center h-screen'>
        <form className="bg-white rounded-lg shadow-xl text-sm text-gray-500 border border-gray-200 p-8 py-12 w-80 " onSubmit={handleSubmit}>
    <p class="text-2xl font-medium text-center">
        <span class="text-indigo-500">User</span> Login
    </p>

    <div class="mt-4">
        <label  htmlFor='email' className="block">Email</label>
        <input  id='email'
                type="email"
                placeholder="type here"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
                required
                className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"

        />
    </div>

    <div class="mt-4">
        <label htmlFor='password' className="block">Password</label>
        <input 
        type="password" 
        placeholder="type here" 
        value={password}
        onChange={(e)=> setPassword(e.target.value)}
        required
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"/>
    </div>

    <p class="mt-4">
        Create an account?
        <Link to= "/register" className="text-indigo-500">Click here </Link>
    </p>

    <button type="submit" className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md mt-4 cursor-pointer">
        Login
    </button>
</form>
    </div>
    );
};

export default LoginPage;
