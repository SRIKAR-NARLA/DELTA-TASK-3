import mongoose from "mongoose";
const schema = mongoose.Schema;
import bcrypt from 'bcryptjs'

const userSchema = new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        enum:['user','artist','admin'],
        default:'user'
    },
    tofriends: [{
        id:{ type: schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }],
    fromfriends: [{
        id:{ type: schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
    }]
},{
    timestamps:true
})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

const User = mongoose.model("User",userSchema);

export default User;