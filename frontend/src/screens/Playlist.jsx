import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Playlist.module.css";
import SongItem from "../components/SongItem";

function Playlist() {
    const { id } = useParams();
    const [playlist, setPlaylist] = useState({});

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await axios.get(`/api/playlists/${id}`);
                setPlaylist(response.data);
            } catch (error) {
                console.log("Failed to fetch playlist details", error);
            }
        };
        fetchPlaylist();
    }, [id]);

    // if (!playlist) {
    //     return <div>Loading...</div>;
    // }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
            {playlist.image && <img src={playlist.image} alt={playlist.name} className={styles.image} />}
                <div className={styles.details}>
                    <h1 className={styles.title}>{playlist.name}</h1>
                    <p className={styles.description}>{playlist.description}</p>
                </div>
            </div>
            <div className={styles.songs}>
            <div className={styles.songs}>
                    {playlist.songs && playlist.songs.map((songId) => (
                        <SongItem key={songId} songId={songId}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Playlist;
