import express from 'express';
const router = express.Router();
import {protect,admin} from '../middleware/authMiddleware.js'
import {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile,getUsers,DeleteUser,updateUser,getUsersById} from '../controllers/userController.js';

router.route('/').post(registerUser).get(protect,admin,getUsers);
router.route('/logout').post(logoutUser);
router.route('/auth').post(authUser);
router.route('/profile').get(protect,getUserProfile).put(protect,updateUserProfile);
router.route('/:id').delete(protect,admin,DeleteUser).get(protect,admin,getUsersById).put(protect,admin,updateUser);


export default router;