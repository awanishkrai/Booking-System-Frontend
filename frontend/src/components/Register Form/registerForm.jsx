import React from 'react';
import './registerForm.css';
import api from '../../api/axios';
import Error from '../error';
export default function RegisterForm() {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const handleRegister = async(event) => {
        event.preventDefault();
        setError('');
        try {
            const response = await api.post('/register', { username, email, password, confirmPassword });
            console.log(response.data);
        } catch (err) {
            setError(err.message);
        }

    }
  return (
    <>
    if (error) {
        <Error message={error} />
    }
    <div id="registerFormContainer">
      <h1>Register</h1>
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
        </>
        )
    };