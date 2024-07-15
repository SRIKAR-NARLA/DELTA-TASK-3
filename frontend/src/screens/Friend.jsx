import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import styles from './Friend.module.css'

const FriendDetails = ({ match }) => {
    const {id} = useParams();
    const [friend, setFriend] = useState(null);

  useEffect(() => {
    const fetchFriendDetails = async () => {
      try {
        const response = await axios.get(`/api/users/friends/${id}`);
        setFriend(response.data);
      } catch (error) {
        console.error('Failed to fetch friend details', error);
      }
    };

    fetchFriendDetails();
  }, [id]);

  if (!friend) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.friendDetails}>
      <h1>Friend Details</h1>
      <div className={styles.friendInfo}>
        <div>
          <strong>Name:</strong> {friend.name}
        </div>
        <div>
          <strong>Email:</strong> {friend.email}
        </div>
        <div>
          <strong>Role:</strong> {friend.role}
        </div>
      </div>
    </div>
  );
};

export default FriendDetails;
