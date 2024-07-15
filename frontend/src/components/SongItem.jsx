import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './SongItem.module.css';
import { useNavigate } from 'react-router-dom';

function SongItem({ songId }) {
    const [song, setSong] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await axios.get(`/api/songs/${songId}`);
                setSong(response.data);
            } catch (error) {
                console.error('Failed to fetch song details', error);
            }
        };
        fetchSong();
    }, [songId]);

    return (
        <div className={styles.song}>
            <img src={song.image} alt={song.name} className={styles.songImage} />
            <div className={styles.songDetails}>
                <h2 className={styles.songName} onClick={()=>navigate(`/song/${songId}`)}>{song.name}</h2>
                <p className={styles.songDescription}>{song.description}</p>
            </div>
        </div>
    );
}

export default SongItem;
