import {v2 as cloudinary} from 'cloudinary'
import asyncHandler from '../middleware/asyncHandler.js'
import Song from '../models/songModel.js'
import Playlist from '../models/PlaylistModel.js';
import AppError from '../middleware/appError.js';

const addSong = asyncHandler(async(req,res)=>{
    try{
        const {name,description,language,genre,artist} = req.body;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        const audioUpload = await cloudinary.uploader.upload(audioFile.path,{resource_type:'video'})
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
        const duration = audioUpload.duration
        
        const songData = {
            name,
            description,
            language,
            genre,
            artist,
            image:imageUpload.secure_url,
            file:audioUpload.secure_url,
            duration,
            beatDuration:duration,
            likedBy:[],
            dislikedBy:[]
        }
        const song = await Song.create(songData);
        res.json(song)
    }catch(error){
        throw new AppError(error.message,500);
    }
})

const listSongs = asyncHandler(async(req,res)=>{
    const songs = await Song.find({});
    res.json(songs)
})

const getSongById = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        const playlist = await Song.findById(id);
        res.status(200).json(playlist);
    }catch (error) {
        throw new AppError(error.message, 500);
      }
})

const likeSong = asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user._id;

    const song = await Song.findById(songId);
    if (song) {
        if (song.likedBy.includes(userId) || song.dislikedBy.includes(userId)) {
            res.status(400);
            throw new Error('You have already liked or disliked this song');
        }

        // Update the song's likedBy array and increment likes count
        song.likedBy.push(userId);
        song.likes += 1;

        // Save the updated song
        await song.save();

        // Find or create the "Liked Songs" playlist for the user
        let likedSongsPlaylist = await Playlist.findOne({ owner: userId, name: 'Liked Songs', ownership: 'private' });

        if (!likedSongsPlaylist) {
            likedSongsPlaylist = new Playlist({
                name: 'Liked Songs',
                owner: userId,
                isPrivate: true,
                songs: [],
            });
        }

        // Add the song to the liked songs playlist if it's not already there
        if (!likedSongsPlaylist.songs.includes(songId)) {
            likedSongsPlaylist.songs.push(songId);
            likedSongsPlaylist.duration+=song.duration;
            await likedSongsPlaylist.save();
        }

        res.json({ message: 'Song liked successfully and added to Liked Songs playlist', likes: song.likes });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});


const dislikeSong = asyncHandler(async (req, res) => {
    const songId = req.params.id;
    const userId = req.user._id;

    const song = await Song.findById(songId);
    if (song) {
        if (song.likedBy.includes(userId) || song.dislikedBy.includes(userId)) {
            res.status(400);
            throw new Error('You have already liked this song');
        }

        // Update the song's likedBy array and increment likes count
        song.dislikedBy.push(userId);
        song.dislikes += 1;

        // Save the updated song
        await song.save();

        res.json({ message: 'Song disliked successfully', likes: song.likes });
    } else {
        res.status(404);
        throw new Error('Song not found');
    }
});

const addSongToPlaylist = asyncHandler(async(req,res)=>{
    const { id } = req.params;
    const { playlistId } = req.body;

    // Validate the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError('Playlist not found', 404);
    }

    // Validate the song
    const song = await Song.findById(id);
    if (!song) {
        throw new AppError('Song not found', 404);
    }

    // Add song to playlist if it's not already added
    if (playlist.songs.includes(id)) {
        throw new AppError('Song is already in the playlist', 400);
    }

    playlist.songs.push(id);
    playlist.duration+=song.duration;
    await playlist.save();

    res.status(200).json({
        message: 'Song added to playlist successfully',
        playlist,
    });
})

const removeSongFromPlaylist = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { playlistId } = req.body;

    // Validate the playlist
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new AppError('Playlist not found', 404);
    }

    // Validate the song
    const song = await Song.findById(id);
    if (!song) {
        throw new AppError('Song not found', 404);
    }

    // Remove song from playlist if it exists
    const songIndex = playlist.songs.indexOf(id);
    if (songIndex === -1) {
        throw new AppError('Song is not in the playlist', 400);
    }

    playlist.songs.splice(songIndex, 1);
    playlist.duration-=song.duration;
    await playlist.save();

    res.status(200).json({
        message: 'Song removed from playlist successfully',
        playlist,
    });
});


export {addSong,listSongs,getSongById,likeSong,dislikeSong,addSongToPlaylist,removeSongFromPlaylist}