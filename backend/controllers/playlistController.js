import {v2 as cloudinary} from 'cloudinary'
import asyncHandler from '../middleware/asyncHandler.js'
import Playlist from '../models/PlaylistModel.js'
import AppError from '../middleware/appError.js';

const addPlaylist = asyncHandler(async (req, res) => {
    try {
        const { name, description, owner, ownership } = req.body;
        const imageFile = req.files.image ? req.files.image[0] : null; // Check if image file is provided

        // Upload image file to Cloudinary if provided
        let imageUpload;
        if (imageFile) {
            imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        }

        // Set a default image URL if no image is provided
        const imageUrl = imageUpload ? imageUpload.secure_url :null; // Replace with your default image URL

        const duration = 0; // Calculate or set the duration as needed

        const playListData = {
            name,
            description,
            owner,
            image: imageUrl,
            duration,
            songs:[],
            ownership
        };

        const playlist = await Playlist.create(playListData);
        res.json(playlist);
    } catch (error) {
        throw new AppError(error.message, 500);
    }
});

const listPlaylist = asyncHandler(async(req,res)=>{
    try {
        const userId = req.user._id; // Assuming the user ID is available in the request
    
        const playlists = await Playlist.find({
          $or: [
            { ownership: 'public' },
            { owner: userId }
          ]
        });
    
        res.status(200).json(playlists);
      } catch (error) {
        throw new AppError(error.message, 500);
      }
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params;
        const playlist = await Playlist.findById(id);
        res.status(200).json(playlist);
    }catch (error) {
        throw new AppError(error.message, 500);
      }
})

const removeSongToPlaylist = asyncHandler(async(req,res)=>{
    
})

export {addPlaylist,listPlaylist,getPlaylistById}