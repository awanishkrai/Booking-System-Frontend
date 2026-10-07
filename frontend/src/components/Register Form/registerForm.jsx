import React from 'react';
import { register } from '../../api/axios';
import './registerForm.css';
import roomImage from '../../assets/ChatGPT Image Sep 9, 2026, 11_07_47 PM.png';
import Error from '../error';
import { Link, useNavigate } from 'react-router-dom';
export default function RegisterForm() {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleRegister = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    try {
      const response = await register(username, email, password);
      console.log(response.data);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      let msg = data?.message || data?.detail || err.message || 'Registration failed';
      if (typeof msg === 'object') {
        msg = Object.entries(msg)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
      }
      setError(msg);
    }
  }

  return (
    <>
      <div id="outerBox">
        <div id="imageBox">
          <h1>Find Your Perfect Room</h1>
          <h3>Comfortable Stays, great locations and unforgettable experiences</h3>
          <img src={roomImage} alt="Room Image" />
        </div>

        <div id="registerFormContainer">
          <div id="topText">
            <h1>Register</h1>
            <p>Already have an account? <Link to="/">Login</Link></p>
          </div>

          {error && <Error message={error} />}

          <form onSubmit={handleRegister}>
            <label htmlFor="username">Username</label>
            <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label htmlFor="email">Email</label>
            <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />

            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

            <button type="submit">Register</button>
          </form>
        </div>
      </div>
    </>
  )
};