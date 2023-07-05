import React, { useState } from 'react';
import axios from 'axios';
import RegistrationForm from './RegistrationForm';

const LoginForm = ({ handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterRequested, setIsRegisterRequested] = useState(false);

  const handleUserLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/users/login', {
        email,
        password,
      });

      if (response.status === 201) {
        alert(response.data.message);
        localStorage.setItem('TicketBookingToken', response.data.TicketBookingToken);
        handleLogin(response.data.userRole);
      }else{
        alert(response.data.message);
      }
    } catch (error) {
        console.log(error.message)
        alert("Server Error");
    }
  };

  const handleRegisterRequest = () => {
    setIsRegisterRequested(true);
  };

  if (isRegisterRequested) {
    return <RegistrationForm />;
  }

  return (
    <div>
      <h2>Login Form</h2>
      <form onSubmit={handleUserLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Not registered yet?{' '}
        <span onClick={handleRegisterRequest} style={{ cursor: 'pointer', color: 'blue' }}>
          Click here to register
        </span>
      </p>
    </div>
  );
};

export default LoginForm;

