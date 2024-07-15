import mongoose from "mongoose";
const schema = mongoose.Schema;

const playlistSchema = new schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    owner:{
        type: schema.Types.ObjectId,
        ref: 'Song',
        required:true
    },
    ownership:{
        type:String,
        required:true,
        default:'private'
    },
    image: {
        type:String
    },
    songs: [{
        type: schema.Types.ObjectId,
        ref: 'Song'
    }],
    duration: {
        type: Number,
        required: true
    }
},{
    timestamps:true
})


const Playlist = mongoose.model("Playlist",playlistSchema);

export default Playlist;