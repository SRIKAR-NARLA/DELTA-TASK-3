import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import styles from './RegisterScreen.module.css';
import Navbar from '../components/Navbar';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (JSON.parse(localStorage.getItem('userInfo'))) {
      navigate('/profile');
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/users', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar/>
      <div className={styles.registerContainer}>
        <form className={styles.registerForm} onSubmit={submitHandler}>
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Register</button>
          <Link to="/login" className={styles.loginLink}>
            Already registered? Login
          </Link>
        </form>
      </div>
    </>
  );
};

export default RegisterScreen;
