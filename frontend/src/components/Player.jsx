import { useContext, useRef } from 'react';
import { assets } from '../assets/frontend-assets/assets.js';
import styles from './Player.module.css'; // Import the CSS module
import { SongContext } from '../context/SongContext';


function Player() {
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const { audioRef, currentSong, isPlaying, togglePlayPause, playNext, playPrevious,time,setTime } = useContext(SongContext);
    const handleSeek = (event) => {
        const seekTime = event.target.value;
        audioRef.current.currentTime = seekTime;
        setTime({ ...time, currentTime: seekTime });
      };
    return (
        <div className={styles.player}>
            <div className={styles.playerInfo}>
                <img src='' alt='' className={styles.playerImage} />
                <div className={styles.playerDetails}>
                    <p className={styles.songName}>Song name</p>
                    <p className={styles.songDescription}>Song description</p>
                </div>
            </div>
            <div className={styles.midbar}>
            <div className={styles.playerControls}>
                <img src={assets.shuffle_icon} alt='' className={styles.controlIcon} />
                <img src={assets.prev_icon} alt='' className={styles.controlIcon} onClick={playPrevious}/>
                <img src={isPlaying?assets.pause_icon:assets.play_icon} onClick={togglePlayPause} alt='' className={`${styles.controlIcon} ${styles.playPause}`} />
                <img src={assets.next_icon} onClick={playNext} alt='' className={styles.controlIcon} />
                <img src={assets.loop_icon} onClick={playPrevious} alt='' className={styles.controlIcon} />
            </div>
            <div className={styles.playerProgress}>
                <p className={styles.currentTime}>{formatTime(time.currentTime)}</p>
                <div className={styles.progressBar}>
                        <input 
                            type="range" 
                            min="0" 
                            max={time.totalTime || 0} 
                            value={time.currentTime} 
                            onChange={handleSeek} 
                            className={styles.progress}
                        />
                    </div>
                <p className={styles.duration}>{formatTime(time.totalTime)}</p>
            </div>
            </div>
            <div className={styles.playerInfo}>
                <img src='' alt='' className={styles.playerImage} />
                <div className={styles.playerDetails}>
                    <p className={styles.songName}>{currentSong?.name}</p>
                    <p className={styles.songDescription}>{currentSong?.description}</p>
                </div>
            </div>
            <audio ref={audioRef} src={currentSong?.file || ''} className={styles.audio}>
          Your browser does not support the audio element.
        </audio>
        </div>
        
    );
}

export default Player;

