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
    fullName: {
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
        if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10);
        next();
    })

    userSchema.methods.isPasswordCorrect = async function (password){
        return await bcrypt.compare(password, this.password);
    }
    

    userSchema.methods.generateAccessToken = function() {
        return jwt.sign({
            _id: this._id,
            username: this.username,
            email: this.email,
            fullname: this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d"
        }
        )
    }

    userSchema.methods.generateRefreshToken = function() {
         return jwt.sign({
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d"
        }
        )
    }

export const User = mongoose.model("User", userSchema);