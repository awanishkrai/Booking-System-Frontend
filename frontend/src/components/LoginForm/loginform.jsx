import { useState } from 'react';
import api from '../../api/axios';
import { login } from '../../api/axios';
import './login.css'
import roomImage from '../../assets/ChatGPT Image Sep 9, 2026, 11_07_47 PM.png'
import Error from '../error';
import { Link } from 'react-router-dom';

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        try {
            const response = await login(username, password);
            const { token } = response.data;
            localStorage.setItem("token", token);
        }
        catch (err) {
            setError(err.message);
        }
    }
    return (
        <>

            <div id="outerBox">
                <div id="imageBox">
                    <h1>Find Your Perfect Room</h1>
                    <h3>
                        Comfortable Stays, great locations and unforgettable experiences
                    </h3>

                    <img src={roomImage} alt="Room Image" />
                </div>

                <div id="formContainer">
                    <div id="topText">
                        <h1>Welcome Back</h1>
                        <p>Don't have an account? <Link to="/register">Register</Link></p>
                    </div>

                    {error && <Error message={error} />}

                    <form onSubmit={handleLogin}>

                        <label htmlFor="username">
                            UserName
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button type="submit">
                            Login
                        </button>

                    </form>

                </div>

            </div>
        </>
    )
}