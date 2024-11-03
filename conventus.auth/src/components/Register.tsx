import React, { useState } from 'react';
import { register } from '../api/authApi';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            await register({ email, username, password });
            setSuccess(true);
            setError('');
        } catch (err) {
            setError('Username is already taken');
        }
    };

    if (success) {
        return <p>Registration successful! You can now <a href="/">login</a>.</p>;
    }

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username</label>
                </div>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    required
                />
                <br></br>
                <div>
                    <label>E-mail</label>
                </div>
                <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <br></br>
                <div>
                    <label>Password</label>
                </div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                />
                <br></br>
                <button type="submit">Login</button>
                <div>
                    <a href="/">Log in</a>
                </div>

                {error && <p>{error}</p>}
            </form>
        </div>
    );
};

export default Register;
