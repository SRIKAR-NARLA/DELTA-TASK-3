import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import songRoutes from './routes/songRoutes.js'
import playlistRoutes from './routes/playlistRoutes.js'
import AppError from './middleware/appError.js'
import errorHandler from './middleware/errorHandler.js'
import connectCloudinary from './config/cloudinary.js';
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
connectCloudinary();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send('API is running...')
})

app.use('/api/users',userRoutes);
app.use('/api/songs',songRoutes);
app.use('/api/playlists',playlistRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))

