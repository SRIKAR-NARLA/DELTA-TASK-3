import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import AppError from './middleware/appError.js'
import errorHandler from './middleware/errorHandler.js'
dotenv.config();

const port = process.env.PORT || 5000;

connectDB();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/',(req,res)=>{
    res.send('API is running...')
})

app.use('/api/users',userRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(process.env.PORT,()=>console.log(`server running on ${process.env.PORT}`))

