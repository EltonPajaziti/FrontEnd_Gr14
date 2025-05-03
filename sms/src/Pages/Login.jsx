import React, { useState } from 'react';

import './Login.css';

function Login() {


  
  return (

    <div className="login-container">
      <h2>Log In </h2>
      <form>
        <input
          type="email"
          placeholder="Email-i"
          required
        />
        <input
          type="password"
          placeholder="Fjalëkalimi"
          required
        />
        <button type="submit">Log In </button>
      </form>
    </div>

  );
}

export default Login;