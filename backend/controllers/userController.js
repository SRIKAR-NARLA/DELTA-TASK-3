import asyncHandler from '../middleware/asyncHandler.js'
import User from '../models/userModel.js'
import AppError from '../middleware/appError.js'
import generateToken from '../utils/generateToken.js'

// @desc Auth user and get token
// @route POST /api/users/login
// @access Public

const authUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user && await user.matchPassword(password)){
        generateToken(res,user.id);

        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
        })
    }else{
        throw new AppError(`Invalid Cred`, 404)
    }
})

// @desc Register user
// @route POST /api/users
// @access Public

const registerUser = asyncHandler(async(req,res)=>{
    const {name,email,password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists){
        throw new AppError(`User Exists`, 400)
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res,user.id);
        res.json({
            _id:user._id,
            name:user.name,
            email:user.email,
            isAdmin:user.isAdmin
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
            isAdmin:user.isAdmin
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
        if(req.body.password){
            user.password = req.body.password;
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

export {authUser,registerUser,logoutUser,getUserProfile,updateUserProfile,getUsers,DeleteUser,updateUser,getUsersById}