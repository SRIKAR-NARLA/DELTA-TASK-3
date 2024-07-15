import mongoose from "mongoose";
const schema = mongoose.Schema;

const songSchema = new schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    language:{
        type:String,
        required:true
    },
    artist:{
        type:String,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    image: {
        type:String,
        required:true
    },
    file: {
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    beatDuration:{
        type:Number,
        required:true
    },
    likes:{
        type:Number,
        required:true,
        default:0
    },
    dislikes:{
        type:Number,
        required:true,
        default:0
    },
    likedBy:[
         {type: schema.Types.ObjectId,ref:'User'}
    ],
    dislikedBy:[
        {type: schema.Types.ObjectId,ref:'User'}
    ]
},{
    timestamps:true
})


const Song = mongoose.model("Song",songSchema);

export default Song;