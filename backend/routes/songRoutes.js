import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js';
import {addSong,listSongs,getSongById,likeSong,dislikeSong,addSongToPlaylist,removeSongFromPlaylist} from '../controllers/songsController.js';

router.route('/add').post(upload.fields([{name:'image',maxCount:1},{name:'audio',maxCount:1}]),addSong);
router.route('/list').get(listSongs);
router.route('/:id').get(getSongById)
router.route('/:id/like').post(protect,likeSong)
router.route('/:id/dislike').post(protect,dislikeSong)
router.route('/:id/addToPlaylist').post(protect, addSongToPlaylist);
router.route('/:id/removeFromPlaylist').post(protect, removeSongFromPlaylist);

export default router;