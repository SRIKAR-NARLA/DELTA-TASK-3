import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Playlists.module.css";
import { useNavigate } from 'react-router-dom';

function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchOwner, setSearchOwner] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axios.get("/api/playlists/list");
        setPlaylists(response.data);
        setFilteredPlaylists(response.data); // Initialize filtered playlists
      } catch (error) {
        console.error("Failed to fetch playlists", error);
      }
    };
    fetchPlaylists();
  }, []);

  useEffect(() => {
    const filterPlaylists = () => {
      const filtered = playlists.filter(playlist =>
        (searchName === '' || playlist.name.toLowerCase().includes(searchName.toLowerCase())) &&
        (searchOwner === '' || playlist.owner.name.toLowerCase().includes(searchOwner.toLowerCase()))
      );
      setFilteredPlaylists(filtered);
    };

    filterPlaylists();
  }, [searchName, searchOwner, playlists]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Playlists</h1>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className={styles.searchInput}
        />
        <input
          type="text"
          placeholder="Search by owner"
          value={searchOwner}
          onChange={(e) => setSearchOwner(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      <div className={styles.playlists}>
        {filteredPlaylists.map((playlist) => (
          <div key={playlist._id} className={styles.playlist} onClick={() => navigate(`/playlist/${playlist._id}`)}>
            <img
              src={playlist.image}
              alt={playlist.name}
              className={styles.playlistImage}
            />
            <div className={styles.playlistDetails}>
              <h2 className={styles.playlistName}>{playlist.name}</h2>
              <p className={styles.playlistOwner}>by {playlist.owner.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Playlists;
