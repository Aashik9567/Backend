import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiRespose } from "../utils/ApiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
     // get user detail from frontend 
     //validation of data 
     //check if user already exists:can be done by unique feilds like email
     //check for images or avatar
     //upload them to cloudinary
     // create user object - create entry in db
     //remove password and refresh token
     //check for user creation
     //return response

     const {fullName,email,username,password}=req.body
     console.log("email",email);
     if([fullName,email,username,password].some((feilds)=>
        feilds?.trim() === "") ){
            throw new ApiError(400,"all feilds are complusory")
    }
    const existedUser =User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"user already exists ")
    }

    const avatarLocalPath=req.files?.avatar[0]?.path;
    console.log(req.files.avatar)
    const coverImageLocalPath=req.files?.coverImage[0]?.path;
    console.log(req.files.coverImage)
    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }
    const avatar=await fileUploadOnCloudinary(avatarLocalPath) 
    const coverImage=await fileUploadOnCloudinary(coverImageLocalPath)
    if(!avatar){
        throw new ApiError(400,"avatar is required")
    }

    const user=awaitUser.create({
        fullName,
        email,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",
        username:username.toLowerCase(),
        password
    })
    console.log(user)
    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }
    return res.status(201).json(
        new ApiRespose(200,createdUser,"user registered successfully")
    )

})

export { registerUser }