import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactTyped } from 'react-typed';

const Home: React.FC = () => {
    const navigate = useNavigate();

    const handleRegister = () => {
        navigate('/register');
    };

    const handleLogin = () => {
        navigate('/login');
    };

    const loginStyle = 'text-2xl text-white bg-gray-800 font-semibold hover:bg-teal-600 hover:text-gray-800 py-2 px-10 ease-in-out duration-300 rounded-sm';
    const registerStyle = 'text-2xl text-teal-800 font-semibold py-2 px-10 hover:text-gray-800 ease-in-out duration-300 rounded-sm';

    return (
        <div className='flex w-full justify-center space-y-3 flex-col items-center h-screen'>
            <ReactTyped className='font-bold text-green-800 text-4xl'
                strings={['Welcome']}
                typeSpeed={140}
                backSpeed={160}
                backDelay={1000}
                showCursor={true}
                loop
            />
            <button className={loginStyle}
                onClick={handleLogin}>Login</button>
            <button className={registerStyle}
                onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Home;
