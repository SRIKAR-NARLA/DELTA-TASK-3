import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import styles from './ProfileScreen.module.css'; // Import CSS module

const Profile = () => {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data } = await axios.get('/api/users/profile', { withCredentials: true });
        setUser(data);
        setName(data.name);
        setEmail(data.email);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        // Handle error, e.g., show error message
      }
    };

    if (!localStorage.getItem('userInfo')) {
      navigate('/login');
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/users/profile', { name, email, currentPassword, newPassword });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.profileContainer}>
        <div className={styles.profileContent}>
          <h1>Profile</h1>
          {editing ? (
            <form onSubmit={handleSave} className={styles.editForm}>
              <div className={styles.profileRow}>
                <div className={styles.profileCell}>
                  <span className={styles.profileLabel}>Name</span>
                </div>
                <div className={styles.profileCell}>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.profileRow}>
                <div className={styles.profileCell}>
                  <span className={styles.profileLabel}>Email</span>
                </div>
                <div className={styles.profileCell}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className={styles.profileRow}>
                <div className={styles.profileCell}>
                  <span className={styles.profileLabel}>Current Password</span>
                </div>
                <div className={styles.profileCell}>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
              </div>
              <div className={styles.profileRow}>
                <div className={styles.profileCell}>
                  <span className={styles.profileLabel}>New Password</span>
                </div>
                <div className={styles.profileCell}>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              <button type="submit" className={styles.saveButton}>Save</button>
            </form>
          ) : (
            <>
              <div className={styles.profileTable}>
                <div className={styles.profileRow}>
                  <div className={styles.profileCell}>
                    <span className={styles.profileLabel}>Name</span>
                  </div>
                  <div className={styles.profileCell}>
                    <span className={styles.profileData}>{user.name}</span>
                  </div>
                </div>
                <div className={styles.profileRow}>
                  <div className={styles.profileCell}>
                    <span className={styles.profileLabel}>Email</span>
                  </div>
                  <div className={styles.profileCell}>
                    <span className={styles.profileData}>{user.email}</span>
                  </div>
                </div>
                <div className={styles.profileRow}>
                  <div className={styles.profileCell}>
                    <span className={styles.profileLabel}>Number of Playlists</span>
                  </div>
                  <div className={styles.profileCell}>
                    <span className={styles.profileData}>{user.playlists}</span>
                  </div>
                </div>
                <div className={styles.profileRow}>
                  <div className={styles.profileCell}>
                    <span className={styles.profileLabel}>Account Type</span>
                  </div>
                  <div className={styles.profileCell}>
                    <span className={styles.profileData}>{user.role}</span>
                  </div>
                </div>
                <div className={styles.profileRow}>
                  <div className={styles.profileCell}>
                    <span className={styles.profileLabel}>Number of Friends</span>
                  </div>
                  <div className={styles.profileCell}>
                    <span className={styles.profileData}>{user.number_friends}</span>
                  </div>
                </div>
              </div>
              <button className={styles.editButton} onClick={handleEdit}>Edit</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
