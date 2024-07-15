import React, { useEffect, useState, useContext  } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styles from './Song.module.css';
import { SongContext } from '../context/SongContext';


function Song() {
    const { id } = useParams();
    const [song, setSong] = useState({});
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0); 
    const [dislikesCount, setDislikesCount] = useState(0);
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylist, setSelectedPlaylist] = useState('');
    const { currentSong,setSongAndPlay } = useContext(SongContext);

    useEffect(() => {
        const fetchSong = async () => {
            try {
                const response = await axios.get(`/api/songs/${id}`);
                setSong(response.data);
                setLikesCount(response.data.likes);
                if (response.data.likedBy.includes(localStorage.getItem('userInfo')._id) || response.data.dislikedBy.includes(localStorage.getItem('userInfo')._id) ) {
                    setLiked(true);
                } else {
                    setLiked(false);
                }
            } catch (error) {
                console.error('Failed to fetch song details', error);
            }
        };
        fetchSong();
    }, [id]);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const response = await axios.get('/api/playlists/list');
                setPlaylists(response.data);
            } catch (error) {
                console.error('Failed to fetch playlists', error);
            }
        };
        fetchPlaylists();
    }, []);

    const handleLike = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
            const response = await axios.post(`/api/songs/${id}/like`, { userId });
            setLiked(true);
            setLikesCount(response.data.likes);
        } catch (error) {
            console.error('Failed to like song', error);
        }
    };
    
    const handleDislike = async () => {
        try {
            const userId = JSON.parse(localStorage.getItem('userInfo'))._id;
            const response = await axios.post(`/api/songs/${id}/dislike`, { userId });
            setLiked(true);
            setDislikesCount(response.data.dislikes);
            } catch (error) {
            console.error('Failed to dislike song', error);
        }
    };

    const handleAddToPlaylist = async () => {
        if (!selectedPlaylist) {
            alert('Please select a playlist');
            return;
        }
        try {
            const response = await axios.post(`/api/songs/${id}/addToPlaylist`, { playlistId: selectedPlaylist });
            alert('Song added to playlist successfully');
        } catch (error) {
            console.error('Failed to add song to playlist', error);
        }
    };

    const handlePlay = () => {
        setSongAndPlay(song);
      };

    return (
        <div className={styles.container}>
            <div className={styles.songDetails}>
                <div className={styles.imghead}>
                <img src={song.image} alt={song.name} className={styles.songImage} />
                <div className={styles.heading}>
                <h1>{song.name}</h1>
                </div>
                </div>
                <div className={styles.info}>
                    <table className={styles.songTable}>
                        <tbody>
                            <tr>
                                <td className={styles.tableLabel}>Artist:</td>
                                <td>{song.artist}</td>
                            </tr>
                            <tr>
                                <td className={styles.tableLabel}>Description:</td>
                                <td>{song.description}</td>
                            </tr>
                            <tr>
                                <td className={styles.tableLabel}>Genre:</td>
                                <td>{song.genre}</td>
                            </tr>
                            <tr>
                                <td className={styles.tableLabel}>Language:</td>
                                <td>{song.language}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={styles.likeButtons}>
                        <button className={styles.likeButton} onClick={handleLike}>
                            Like
                        </button>
                        <p className={styles.likesCount}>{likesCount} Likes</p>
                        <button className={styles.dislikeButton} onClick={handleDislike}>
                            Dislike
                        </button>
                        <p className={styles.likesCount}>{dislikesCount} Dislikes</p>
                    </div>
                    <div className={styles.playlistSection}>
                        <select 
                            className={styles.playlistDropdown} 
                            value={selectedPlaylist} 
                            onChange={(e) => setSelectedPlaylist(e.target.value)}
                        >
                            <option value="">Select Playlist</option>
                            {playlists.map(playlist => (
                                <option key={playlist._id} value={playlist._id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                        <button className={styles.addButton} onClick={handleAddToPlaylist}>
                            Add to Playlist
                        </button>
                    </div>
                    {currentSong!==song && <button className={styles.playButton} onClick={handlePlay}>
                        Play
                    </button>}
                </div>
            </div>
        </div>
    );
}

export default Song;
