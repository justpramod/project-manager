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
        // <div className="grid place-content-center h-screen ">
        //     <h2 className="text-3xl text-center">Register</h2>
        //     <form className="bg-white rounded-lg shadow-xl text-sm text-gray-500 border-gray-200 p-8 py-12 w-100"  onSubmit={handleSubmit}>

        //         {error && <p style={{ color: 'red' }}>{error}</p>}

        //         <div className="mt-4">
        //              <label htmlFor="username" className="block mt-4">Username</label>
        //         <input
        //             id="username"
        //             type="text"
        //             placeholder="eg: User123"
        //             value={username}
        //             onChange={(e)=> setUsername(e.target.value)}
        //             required
        //             className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
        //          />

        //         <label htmlFor="email" className="mt-4 block">Email</label>
        //         <input
        //             id="email"
        //             type="email"
        //             placeholder=" eg: example@gmail.com"
        //             value={email}
        //             onChange={(e) => setEmail(e.target.value)}
        //             required
        //             className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
        //         />

        //         <label htmlFor="password" className="mt-4 block">Password</label>
        //         <input 
        //             id="password"
        //             type="password"
        //             placeholder="eg: #!@@%pass@#$"
        //             value={password}
        //             onChange={(e)=> setPassword(e.target.value)}
        //             required
        //             className="border-gray-200 border rounded w-full p-2 mt-1 outline-indigo-500"
        //          />

        //         <button type="submit" disabled = {submitting} 
        //         className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md mt-4 cursor-pointer">
        //             {submitting ? 'Registering..': 'Register'}
        //         </button>
        //         <p className="mt-4">Already have an account? <Link to= "/login" className="text-indigo-500">Login</Link></p>

        //         </div>

        //     </form>

        // </div>

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
                        Already have an account? <Link to="/register" className="text-[#4338CA] font-semibold hover:underline">SignIn here</Link>
                    </div>
                </AuthCard>
            </div>

        </div>
    )

};

export default RegisterPage;