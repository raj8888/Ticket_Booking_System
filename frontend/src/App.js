
import './App.css';
import '../src/components/navbar.css';
import React, { useState } from 'react';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import AdminPage from './components/AdminPage';
import UserPage from './components/UserPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('register');
  const [userRole, setUserRole] = useState('');

  const handleRegistrationSuccess = () => {
    setCurrentPage('login');
  };

  const handleLogin = (role) => {
    setUserRole(role);
    setCurrentPage('loggedIn');
  };

  const handleLogout = () => {
    setCurrentPage('login');
    setUserRole('');
  };

  return (
    <div className='App'>
      {currentPage === 'register' && (
        <RegistrationForm handleRegistrationSuccess={handleRegistrationSuccess} handleLogin={handleLogin} />
      )}
      {currentPage === 'login' && <LoginForm handleLogin={handleLogin} />}

      {currentPage === 'loggedIn' && userRole === 'admin' &&  <AdminPage handleLogout={handleLogout} />}
      {currentPage === 'loggedIn' && userRole === 'user' && <UserPage handleLogout={handleLogout} />}
    </div>
  );
};

export default App;
