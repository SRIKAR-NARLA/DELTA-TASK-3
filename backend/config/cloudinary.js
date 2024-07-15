import {v2 as cloudinary} from 'cloudinary'

const connectCloudinary = async ()=>{
    await cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        api_key:process.env.CLOUD_ID,
        api_secret:process.env.CLOUD_SECRET
    })
    console.log('connected cloud')
}

export default connectCloudinary;