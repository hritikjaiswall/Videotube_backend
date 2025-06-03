import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js';   
import {uploadOnCloudinary} from '../utils/cloudinary.js';  
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return {
            accessToken,
            refreshToken
        }
    }catch (error) {
       throw new ApiError(500, "Error generating tokens"); 
    }
}
 
const registerUser = asyncHandler(async(req,res)=>{
    // res.status(200).json(
    //     {
    //         message: 'User registered successfully'
    //     }
         
    // );
    const {fullName, email, password, username } = req.body;
    console.log(req.body);
    // if(fullName === '' ){
    //     throw new ApiError("Full name is required", 400);
    // } 
    if ( [fullName,email,username,password].some((field)=>field?.trim() === "")){
        throw new ApiError(400,"All fields are required");
    }
    const existingUser = await User.findOne({ 
        $or: [{username},{email}]
    })
    if (existingUser) {
        throw new ApiError(409,"User already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError( 400,"Avatar is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500,"User creation failed");
    }

     return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
)
})

const loginUser = asyncHandler(async(req,res)=>{
     const {email,username,password} = req.body;
     if(!email || !username){
         throw new ApiError(400,"Email or username is required");
     }
     if(!password){
         throw new ApiError(400,"Password is required");
     }
     const user = await User.findOne({ 
        $or: [{username},{email}]
    })
    if (!user) {
        throw new ApiError(409,"User not found");
    }
    const isPasswordValid = await user.isPasswordCorrect(password);
    
    if (!isPasswordValid) {
        throw new ApiError(401,"Invalid password");
    }

    const {accessToken , refreshToken}= await generateAccessAndRefreshToken(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    const options = {
        httpOnly: true,
        secure: true
    };
    console.log(res)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(200,{
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "User logged in successfully")
    );
});
const logoutUser = asyncHandler(async(req,res)=>{
   
});

export { 
    registerUser,
    loginUser
};

//STEPS TO CREATE USER 
// TAKE DETAILS FROM THE FRONTEND
// VALIDATE THE DETAILS
// CHECK IF USER ALREADY EXISTS
// IF USER EXISTS, RETURN ERROR
// CHECK FOR IMAGES AND AVATAR
// UPLOAD IMAGES TO CLOUDINARY, AVATAR
// CREATE USER IN THE DATABASE
//REMOVE PASSWORD FROM THE RESPONSE
// RETURN SUCCESS RESPONSE
// IF ANY ERROR OCCURS, CATCH IT AND RETURN ERROR RESPONSE

// TAKE DETAILS FROM THE FRONTEND
// VALIDATE THE DETAILS 
//should have email or username
// should have password
// CHECK IF USER EXISTS
//compare password with the hashed password in the database
// if user password matches 
//allow access token