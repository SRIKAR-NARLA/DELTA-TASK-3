import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile,getFriendsProfile,getUsers,DeleteUser,updateUser,getUsersById,sendFriendRequest,acceptFriendRequest,rejectFriendRequest,getFriends,getPendingFriends,getFriend} from '../controllers/userController.js';

router.route('/').post(registerUser).get(protect,admin,getUsers);
router.route('/logout').post(logoutUser);
router.route('/auth').post(authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/sendFR').post(protect,sendFriendRequest)
router.route('/acceptFR').put(protect,acceptFriendRequest)
router.route('/rejectFr').put(protect,rejectFriendRequest)
router.route('/friends').get(protect,getFriends);
router.route('/friends/pending').get(protect,getPendingFriends);
router.route('/friends/:id').get(protect,getFriend);
router.route('/:id').delete(protect,admin,DeleteUser).get(protect,admin,getUsersById).put(protect,admin,updateUser);


export default router;