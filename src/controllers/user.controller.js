import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { fileUploadOnCloudinary } from "../utils/fileUpload.js";
import { ApiRespose } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const option={
    httpOnly:true,
    secure:true
}
const generateAcessTokenAndRefreshToken= (async(userId)=>{
    try {
        const user=  await User.findById(userId)
        const accessToken=user.generateAcessToken()
        const refreshToken=user.generateRefreshToken()

        user.refreshToken=refreshToken
        await  user.save({
            validateBeforeSave:false 
        })
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"something went wrong while generating access and refresh token")
    }
} )


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
    const existedUser =await User.findOne({
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

    const user=await User.create({
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

const loginUser =asyncHandler(async(req,res)=>{
   //get data from user :req-body
   // validation username and password present or not
   // match them with database(password check ): if not found throw error else
   // generate access token and refresh token and send to user 
   //cookies
   const {email,username,password}=req.body 
   if (!(email || username)) {
        throw new ApiError(400,"username or email is required")
   }
   const user=await User.findOne({
    $or:[{email},{username}]
   })
   if (!user) {
    throw new ApiError(404 ,"user not found")
   }
   const isPasswordValid= await user.isPasswordCorrect(password)
   if (!isPasswordValid) {
    throw new ApiError(401,"invalid password try again")
   }
   const {refreshToken,accessToken}=  await  generateAcessTokenAndRefreshToken(user._id)
   /**
    * * console.log("Generated tokens:", accessToken, refreshToken)
   */
   const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
   return res.status(200)
   .cookie("accessToken",accessToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(
    new ApiRespose(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "user logged in successfully"
    )
   )
})
const logoutUser = asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id,
        {
             $set:{
                refreshToken:undefined

             }      
        },
        {
            new:true
        }
    )
    
    return res.status(200)
    .clearCookie("accessToken",option)
    .clearCookie("refreshToken",option)
    .json(new ApiRespose(200,{},"user logged out successfully"))
})

const refreshAccessToken =asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401,"unauthorized access")
    }
    try {
        const decodeToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user =await User.findById(decodeToken?._id)
    if (!user) {
        throw new ApiError(400,"invalid refresh token")
    }
    if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401,"expired or used token sorry")
    }
    const {newRefreshToken,accessToken}=await generateAcessTokenAndRefreshToken(user?._id)
    return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",newRefreshToken,option)
    .json(
        new ApiRespose(
            200,{
                accessToken,newRefreshToken
            },
            "token generated successfully"
        )
    )
    } catch (error) {
        throw new ApiError(400,"something went wrong while generating token")
    }
})

export { registerUser,loginUser,logoutUser,refreshAccessToken }