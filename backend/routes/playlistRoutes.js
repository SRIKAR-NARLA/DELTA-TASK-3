import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import upload from '../middleware/multer.js';
import { addPlaylist, listPlaylist ,getPlaylistById} from '../controllers/playlistController.js';

router.route('/add').post(upload.fields([{name:'image',maxCount:1}]),addPlaylist);
router.route('/list').get(protect,listPlaylist);
router.route('/:id').get(protect,getPlaylistById)

export default router;