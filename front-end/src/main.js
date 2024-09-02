import React from 'react';
import './Main.css';
import {useNavigate} from 'react-router-dom';

const Main = () =>{
    const navigate = useNavigate();

    return (
        <div>
            <div className='main-icon'>&#128172;</div>
            <h2>Welcome to Pharma-Pal</h2>
            <button onClick={() => navigate('/Sign_Up')} className="button">Sign Up</button>
            <button onClick={() => navigate('/login')} className="button">Login</button>
        </div>
    );
};

export default Main;
