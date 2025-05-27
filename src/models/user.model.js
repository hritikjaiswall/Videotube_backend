import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,// using cloudinary url
        required: true,
    },
    coverImage: {
        type: String
    },
    watvhHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    refreshToken: {
        type: String,
    }
},
    {
        timestamps: true
    })

    userSchema.pre("save",async function(next){
        if(!this.isModified("passsword")) return next();
        this.password = bcrypt.hash(this.password, 10);
        next();
    })

export const User = mongoose.model("User", userSchema);