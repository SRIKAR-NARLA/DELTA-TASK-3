import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './LoginScreen.module.css';

const LoginScreen = () => {
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
      const { data } = await axios.post('/api/users/auth', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.loginContainer}>
        <form className={styles.loginForm} onSubmit={submitHandler}>
          <h2>Login</h2>
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
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default LoginScreen;
