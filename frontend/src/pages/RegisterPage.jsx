import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

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
        <div className="grid place-content-center h-screen ">
            <h2 className="text-3xl">Register</h2>
            <form action="" onSubmit={handleSubmit}>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="flex">
                     <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="eg: User123"
                    value={username}
                    onChange={(e)=> setUsername(e.target.value)}
                    required
                 />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    placeholder=" eg: example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    type="text"
                    placeholder="eg: #!@@%pass@#$"
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    required
                 />

                <button type="submit" disabled = {submitting}>
                    {submitting ? 'Registering..': 'Register'}
                </button>
                <p>Already have an account? <Link to= "/login">Login</Link></p>

                </div>

            </form>

        </div>
    )

};

export default RegisterPage;