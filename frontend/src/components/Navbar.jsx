import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/users/logout');
      localStorage.removeItem('userInfo'); // Remove user info from local storage
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
      // Handle error, e.g., show error message
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarBrand}>DTunes</div>
      <div className={styles.navbarMenu}>
        <Link className={styles.navbarItem} to='/dashboard'>Home</Link>
        <Link className={styles.navbarItem} to='/genre'>Genre</Link>
        <Link className={styles.navbarItem} to='/playlists'>Playlists</Link>
        {!localStorage.getItem('userInfo')?
        <div className={styles.navbarItem} onClick={()=>navigate('/register')}>Regsiter</div>:
        <div className={styles.navbarDropdown} onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          Account
          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <div className={styles.dropdownItem} onClick={handleProfile}>Profile</div>
              <div className={styles.dropdownItem} onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
        }
      </div>
    </nav>
  );
};

export default Navbar;
