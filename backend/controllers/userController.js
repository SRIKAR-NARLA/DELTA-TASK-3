import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import Playlist from '../models/PlaylistModel.js'
import AppError from '../middleware/appError.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && await user.matchPassword(password)){
        generateToken(res,user._id);

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        })
    }else{
        throw new AppError(`Invalid Cred`, 404)
    }
})

// @desc Auth user using Dauth and get token
// @route POST /api/users/login
// @access Public

const loginDauth = asyncHandler(async(req,res)=>{
    
})

// @desc Register user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password,role} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        throw new AppError(`User Exists`, 400)
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        tofriends:[],
        fromfriends:[]
    })

    if(user){
        generateToken(res,user._id);
        const likedSongsPlaylist = await Playlist.create({
            name: 'Liked Songs', 
            description: 'Private playlist for liked songs',
            owner: user._id,
            ownership: 'private', 
            songs: [] ,
            duration:0
        });
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        })
    }else{
        throw new AppError('Invalid data',400)
    }
})

// @desc Logout user and clear cookie
// @route POST /api/users/logout
// @access Private

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie('jwt','',{
        httpOnly:true,
        expires:new Date(0)
    });
    res.status(200).json({message:'Logged out'})
})

// @desc Get user's profile
// @route Get /api/users/profile
// @access Private

const getUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            role:user.role,
            pendingAccepts:user.fromfriends.filter(f=>f.status==='pending'),
            acceptedFriends:[...user.fromfriends.filter(f=>f.status==='accepted'),...user.tofriends.filter(f=>f.status==='accepted')],
            number_friends:10
        })
    }else {
        throw new AppError('User not found',404);
    }
})

// @desc Update user's profile
// @route PUT /api/users/profile
// @access Private

const updateUserProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.user._id);

    if(user){
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.currentPassword===user.password){
            user.password = req.body.newPassword;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })

    }else {
        throw new AppError('User not found',404);
    }
})

// @desc Update user's profile
// @route PUT /api/users/profile
// @access Private

const getFriendsProfile = asyncHandler(async(req,res)=>{
    const user = await User.findById(req.params.id);

    if(user){
        res.status(200).json({
            name:user.name,
            email:user.email,
            role:user.role,
            number_friends:10
        })
    }else {
        throw new AppError('User not found',404);
    }
})

// @desc Get users
// @route GET /api/users
// @access Private/Admin

const getUsers = asyncHandler(async(req,res)=>{
    res.send('auth user');
})

// @desc Get users by id
// @route GET /api/users/:id
// @access Private/Admin

const getUsersById = asyncHandler(async(req,res)=>{
    res.send('auth user');
})


// @desc Delete users
// @route DELETE /api/users/:id
// @access Private/Admin

const DeleteUser = asyncHandler(async(req,res)=>{
    res.send('auth user');
})

// @desc Delete users
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async(req,res)=>{
    res.send('auth user');
})

// @desc Send friend request
// @route POST /api/send-friend-request
// @access Private

const sendFriendRequest = asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        const friend = await User.findById(req.body.friendId);
        if(user===friend)return;

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }
        const alreadySentRequest = user.tofriends.some(
            (req) => req.id.equals(friend._id)
        );

        const alreadyReceivedRequest = user.fromfriends.some(
            (req) => req.id.equals(friend._id)
        );

        if (alreadySentRequest || alreadyReceivedRequest) {
            return res.status(400).json({ message: 'Friend request already sent or received' });
        }

        user.tofriends.push({ id: friend._id,status:'pending' });
        friend.fromfriends.push({ id: user._id,status:'pending' });

        await user.save();
        await friend.save();

        res.status(201).json({ message: 'Friend request sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

})

const acceptFriendRequest = asyncHandler(async(req,res)=>{
    const { friendId } = req.body;
    console.log(friendId)
    const userId = req.user._id;
    console.log(userId)

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found',404)
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            throw new AppError('User not found',404)
        }

        const friendRequest = user.fromfriends.find(f => f.id.equals(friendId));
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        if(friendRequest.status === 'pending')
        friendRequest.status = 'accepted';

        const reciprocalFriendRequest = friend.tofriends.find(f => f.id.equals(userId));
        if (!reciprocalFriendRequest) {
            return res.status(400).json({ message: 'Reciprocal friend request not found' });
        }
        if(reciprocalFriendRequest.status === 'pending')
        reciprocalFriendRequest.status = 'accepted';

        await user.save();
        await friend.save();

        res.json({messgae:"accepted"})
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

const rejectFriendRequest = asyncHandler(async(req,res)=>{
    const { friendId } = req.body;
    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new AppError('User not found',404)
        }

        const friend = await User.findById(friendId);
        if (!friend) {
            throw new AppError('User not found',404)
        }

        const friendRequest = user.fromfriends.find(f => f._id.equals(friendId));
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        if(friendRequest.status === 'pending')
        friendRequest.status = 'rejected';

        const reciprocalFriendRequest = friend.tofriends.find(f => f._id.equals(userId));
        if (!reciprocalFriendRequest) {
            return res.status(400).json({ message: 'Reciprocal friend request not found' });
        }
        if(reciprocalFriendRequest.status === 'pending')
        reciprocalFriendRequest.status = 'rejected';

        await user.save();
        await friend.save();

        res.json({messgae:"rejected"})
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

const getFriends = asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter friends by accepted status
        const acceptedToFriends = user.tofriends.filter(friend => friend.status === 'accepted').map(friend => friend.id);
        const acceptedFromFriends = user.fromfriends.filter(friend => friend.status === 'accepted').map(friend => friend.id);

        // Find user details for accepted friends
        const friends = await User.find({ _id: { $in: [...acceptedToFriends, ...acceptedFromFriends] } }).select('name');

        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const getFriend = asyncHandler(async(req,res)=>{
    try {
        const friend = await User.findById(req.params.id).select('name email role');;

        if (!friend) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        res.status(200).json(friend);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

const getPendingFriends = asyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter friends by accepted status
        const acceptedFromFriends = user.fromfriends.filter(friend => friend.status === 'pending').map(friend => friend.id);

        // Find user details for accepted friends
        const friends = await User.find({ _id: { $in: [ ...acceptedFromFriends] } }).select('name email role');

        res.status(200).json(friends);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

export {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile,getUsers,DeleteUser,updateUser,getFriendsProfile,getUsersById,sendFriendRequest,acceptFriendRequest,rejectFriendRequest,getFriends,getPendingFriends,getFriend}