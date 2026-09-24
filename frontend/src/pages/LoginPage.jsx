import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import BrandingPannel from '../components/BrandingPannel';
import AuthCard from '../components/AuthCard';
import InputField from '../components/ui/InputField';

function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Login Failed!');
        }
        finally {
            setSubmitting(false);
        }
    }

    return (
        <div className='flex h-screen w-full font-sans'>

            <BrandingPannel />

            <div className='w-2/3 grid place-content-center h-screen'>
                <AuthCard>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
                        <p className="text-gray-500">Enter your credentials to access your workspaces</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <InputField label="Email Address" type="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)}  />
                        <InputField label="Password" type="password" placeholder="Strong password" isPassword={true} value={password} onChange={(e)=> setPassword(e.target.value)} /> 
                        

                        <button type='submit' disabled = {submitting} className="w-full bg-[#4338CA] text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition mt-6">
                           { submitting? "Signing In...": "Sign In"}
                        </button>
                    </form>
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Don't have an account? <Link to="/register" className="text-[#4338CA] font-semibold hover:underline">Register here</Link>
                    </div>
                </AuthCard>
            </div>
        </div>

    );
};

export default LoginPage;


<div>

</div>
