import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const nav = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', { username, password });
            localStorage.setItem('token', response.data.token);
            nav('/chat', {
                replace: true
            });
        } catch (error) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className='flex w-full h-screen bg-gray-200 items-center justify-center'>
            <div className=''>
                <form className='bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 hover:rounded-4xl hover:px-14 hover:py-20 duration-500 ease-in-out'
                    onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input className="shadow appearance-none border  rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            type="password" placeholder="**************" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className='bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline duration-300 ease-in-out'
                        type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
