import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try{
            const response =  await axios.post('http://localhost:4000/api/auth/register', {username,password});
            localStorage.setItem('token', response.data.token);
            toast.success('Registration successful!');
            nav('/chat');
        }catch(err){
            toast.error(`Registration failed: ${err}`); 
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
