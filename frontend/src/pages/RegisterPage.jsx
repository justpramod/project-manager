import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import BrandingPannel from "../components/BrandingPannel";
import AuthCard from "../components/AuthCard";
import InputField from "../components/ui/InputField";

function RegisterPage() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await register({ username, email, password });
            navigate('/dashboard');
        }
        catch (err) {
            setError(err.response?.data?.message || 'Register Failed!');
        }
        finally {
            setSubmitting(false);
        }

    };

    return (

        <div className='flex h-screen w-full font-sans'>

            <BrandingPannel />

            <div className='w-2/3 grid place-content-center h-screen'>
                <AuthCard>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account </h2>
                        <p className="text-gray-500">Get started with ProjectHub today</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <InputField label= "Username" type= "text" placeholder= "example_01" value={username} onChange={(e)=> setUsername(e.target.value)}/>        
                        <InputField label="Email Address" type="email" placeholder="example@gmail.com" value={email} onChange={(e)=> setEmail(e.target.value)}  />
                        <InputField label="Password" type="password" placeholder="Strong password"  value={password} onChange={(e)=> setPassword(e.target.value)}/>

                        <button type='submit' disabled = {submitting} className="w-full bg-[#4338CA] text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition mt-6">
                           {submitting ? 'Registering' : "Register"} 
                        </button>
                    </form>
                    <div className="mt-8 text-center text-sm text-gray-600">
                        Already have an account? <Link to="/login" className="text-[#4338CA] font-semibold hover:underline">SignIn here</Link>
                    </div>
                </AuthCard>
            </div>

        </div>
    )

};

export default RegisterPage;