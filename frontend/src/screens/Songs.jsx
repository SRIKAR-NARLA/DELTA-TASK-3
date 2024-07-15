import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Songs.module.css';

function Songs() {
    const [filteredSongs, setFilteredSongs] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [searchGenre, setSearchGenre] = useState('');
    const [searchArtist, setSearchArtist] = useState('');
    const [searchLanguage, setSearchLanguage] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await axios.get('/api/songs/list');
                setFilteredSongs(response.data);
            } catch (error) {
                console.error('Failed to fetch songs', error);
            }
        };
        fetchSongs();
    }, []);

    useEffect(() => {
        const filterSongs = () => {
            const filtered = filteredSongs.filter(song =>
                (searchName === '' || song.name.toLowerCase().includes(searchName.toLowerCase())) &&
                (searchGenre === '' || song.genre.toLowerCase().includes(searchGenre.toLowerCase())) &&
                (searchArtist === '' || song.artist.toLowerCase().includes(searchArtist.toLowerCase())) &&
                (searchLanguage === '' || song.language.toLowerCase().includes(searchLanguage.toLowerCase()))
            );
            setFilteredSongs(filtered);
        };
        filterSongs();
    }, [searchName, searchGenre, searchArtist, searchLanguage]);

    return (
        <div className={styles.container}>
            <h2>All Songs</h2>
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchName}
                    onChange={e => setSearchName(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={searchGenre}
                    onChange={e => setSearchGenre(e.target.value)}
                    className={styles.searchSelect}
                >
                    <option value="">Select Genre</option>
                    <option value="pop">Pop</option>
                    <option value="rock">Rock</option>
                    <option value="jazz">Jazz</option>
                    <option value="classical">Classical</option>
                    <option value="hiphop">Hip-Hop</option>
                </select>
                <input
                    type="text"
                    placeholder="Search by artist"
                    value={searchArtist}
                    onChange={e => setSearchArtist(e.target.value)}
                    className={styles.searchInput}
                />
                <select
                    value={searchLanguage}
                    onChange={e => setSearchLanguage(e.target.value)}
                    className={styles.searchSelect}
                >
                    <option value="">Select Language</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="telugu">Telugu</option>
                    <option value="tamil">Tamil</option>
                    <option value="malayalam">Malayalam</option>
                </select>
            </div>
            <div className={styles.songList}>
                {filteredSongs.map(song => (
                    <div onClick={()=>navigate(`/song/${song._id}`)} key={song._id} className={styles.song}>
                        <img src={song.image} alt={song.name} className={styles.songImage} />
                        <div className={styles.songDetails}>
                            <p>{song.name}</p>
                            <p>{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Songs;
