import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token); // ruaj tokenin
        navigate('/'); // ridrejto
      } else {
        const text = await response.text();
        setError(text || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Server error. Try again later.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="icon">🎓</div>
        <h2>Login to System</h2>
        <p>Enter your credentials to access your account</p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <label>Email Address</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <a href="#" className="forgot-password">Forgot password?</a>

        <button type="submit">Login</button>

        <div className="demo">
          <p>Demo accounts: admin@example.com, prof@example.com, student@example.com</p>
          <p>(use any password)</p>
        </div>
      </form>
    </div>
  );
};

export default Login;