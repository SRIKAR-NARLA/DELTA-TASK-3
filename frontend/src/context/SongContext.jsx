import React, { createContext, useEffect, useRef, useState } from 'react';
import axios from 'axios'

export const SongContext = createContext();

const SongProvider = ({ children }) => {
  const audioRef = useRef();
  const [songs,setSongs] = useState([])
  const [currentSong, setCurrentSong] = useState({}); // Object containing current song details
  const [isPlaying, setIsPlaying] = useState(false);
  const [time,setTime] = useState({
    currentTime:0,totalTime:0
  })
  
  useEffect(() => {
    // Fetch songs when the component mounts
    const fetchSongs = async () => {
      try {
        const response = await axios.get('/api/songs/list');
        setSongs(response.data); 

        // Set the first song as the current song
        if (response.data.length > 0) {
          setCurrentSong(response.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch songs', error);
      }
    };

    fetchSongs();
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev); // Toggle between play and pause states
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause(); // If currently playing, pause the audio
      } else {
        audioRef.current.play(); // If currently paused, play the audio
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      const handleTimeUpdate = () => {
        setTime({
          currentTime: audioRef.current.currentTime,
          totalTime: audioRef.current.duration,
        });
      };

      const handleSongEnd = () => {
        playNext();
      };

      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', handleTimeUpdate);
      audioRef.current.addEventListener('ended', handleSongEnd);

      // Cleanup event listeners on component unmount
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
          audioRef.current.removeEventListener('loadedmetadata', handleTimeUpdate);
          audioRef.current.removeEventListener('ended', handleSongEnd);
        }
      };
    }
  }, [currentSong]); // Add currentSong as dependency to reset listeners when the song changes

  const playNext = () => {
    const currentIndex = songs.findIndex(song => song._id === currentSong._id);
    const nextIndex = (currentIndex + 1) % songs.length;
    const nextSong = songs[nextIndex];
    setSongAndPlay(nextSong);
  };

  const playPrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    const previousSong = songs[previousIndex];
    setSongAndPlay(previousSong);
  };

  const setSongAndPlay = (song) => {
    setCurrentSong(song);
    if (audioRef.current) {
      audioRef.current.src = song.file;
      audioRef.current.load(); 

      const handleCanPlay = () => {
        audioRef.current.play();
        setIsPlaying(true);
      };

      audioRef.current.addEventListener('canplay', handleCanPlay);

      return () => {
        audioRef.current.removeEventListener('canplay', handleCanPlay);
      };
    }
  };

  return (
    <SongContext.Provider
      value={{
        audioRef,
        currentSong,
        isPlaying,
        togglePlayPause,
        playNext,
        playPrevious,
        setSongAndPlay,
        time,
        setTime,
        songs,
        setSongs,
        setCurrentSong
      }}
    >
      {children}
    </SongContext.Provider>
  );
};

export { SongProvider };
