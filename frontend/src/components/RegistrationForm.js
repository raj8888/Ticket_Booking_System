import React, { useState } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import mainAPI from './DeployedLink';
import './RegistrationForm.css'

const RegistrationForm = ({ handleRegistrationSuccess, handleLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [isLoginRequested, setIsLoginRequested] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${mainAPI}/users/register`, {
        name,
        email,
        mobile,
        password,
      });

      if (response.status === 201) {
        alert(response.data.message);
        handleRegistrationSuccess();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.log(error.message, error)
      alert("Server Error");
    }
  };

  const handleLoginRequest = () => {
    setIsLoginRequested(true);
  };

  if (isLoginRequested) {
    return <LoginForm handleLogin={handleLogin} />;
  }

  return (
    <div className="registration-form">
      <h2>Ticket Booking System</h2>
      <h2>Registration Form</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
      <p>
        Already registered?{' '}
        <span onClick={handleLoginRequest} style={{ cursor: 'pointer', color: 'blue' }} className="login-link">
          Click here to log in
        </span>
      </p>
    </div>
  );
};

export default RegistrationForm;
