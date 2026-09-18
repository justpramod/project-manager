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
        <form onSubmit={handleSubmit}>
                <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Logging in...' : 'Login'}
            </button>
            <p>No account? <Link to="/register">Register</Link></p>
        </form>
    )
};

export default LoginPage;
