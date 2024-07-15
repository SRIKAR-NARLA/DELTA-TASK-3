import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FriendsPanel.module.css';
import { useNavigate } from 'react-router-dom';

const FriendsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const navigate = useNavigate();

  // Fetch pending friend requests and friends list on component mount
  useEffect(() => {
    const fetchFriendsData = async () => {
      try {
        // Fetch pending friend requests
        const pendingResponse = await axios.get('/api/users/friends/pending');
        setPendingRequests(pendingResponse.data);

        // Fetch friends list
        const friendsResponse = await axios.get('/api/users/friends');
        setFriendsList(friendsResponse.data);
      } catch (error) {
        console.error('Failed to fetch friends data', error);
      }
    };

    fetchFriendsData();
  }, []);

  // Handle search for users
  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/users/search?q=${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Failed to search for users', error);
    }
  };

  // Handle sending friend request
  const sendFriendRequest = async (friendId) => {
    try {
      const response = await axios.post('/api/friends/send', { friendId });
      console.log(response.data); // Handle success or display message
    } catch (error) {
      console.error('Failed to send friend request', error);
    }
  };

  // Handle accepting friend request
  const handleAcceptRequest = async (friendId) => {
    try {
      const response = await axios.put(`/api/users/acceptFR`, { friendId });
      console.log(response.data); // Handle success or display message
      // Refetch pending requests after acceptance
      const updatedRequests = pendingRequests.filter(request => request._id !== friendId);
      setPendingRequests(updatedRequests);
      const friendsResponse = await axios.get('/api/users/friends');
      setFriendsList(friendsResponse.data);
    } catch (error) {
      console.error('Failed to accept friend request', error);
    }
  };
  
  // Handle rejecting friend request
  const handleRejectRequest = async (friendId) => {
    try {
      console.log(friendId)
      const response = await axios.put(`/api/users/rejectFR`,{friendId});
      console.log(response.data); // Handle success or display message
      // Refetch pending requests after rejection
      const updatedRequests = pendingRequests.filter(request => request._id !== friendId);
      setPendingRequests(updatedRequests);
    } catch (error) {
      console.error('Failed to reject friend request', error);
    }
  };

  return (
    <div className={styles.friendsPanel}>
      <h2>Friends Panel</h2>
      {/* Search bar */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      
      {/* Search results */}
      {searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <h3>Search Results</h3>
          <ul>
            {searchResults.map(user => (
              <li key={user._id}>
                <span>{user.name}</span>
                <button onClick={() => sendFriendRequest(user._id)}>Send Request</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pending friend requests */}
      {pendingRequests.length > 0 && (
        <div className={styles.pendingRequests}>
          <h3>Pending Friend Requests</h3>
          <ul>
            {pendingRequests.map(request => (
              <li key={request._id} className={styles.pendingRequestItem}>
                <span>{request.name}</span>
                <div className={styles.requestOptions}>
                  <button onClick={() => handleAcceptRequest(request._id)}>Accept</button>
                  <button onClick={() => handleRejectRequest(request._id)}>Reject</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Friends list */}
      {friendsList.length > 0 && (
        <div className={styles.friendsList}>
          <h3>Friends</h3>
          <ul>
            {friendsList.map(friend => (
              <li key={friend._id} className={styles.friendItem} onClick={()=>navigate(`/friends/${friend._id}`)}>
                <span>{friend.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FriendsPanel;
