import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt  from "jsonwebtoken";

export const verifyJwt=asyncHandler(async(req,res,next )=>{
   try {
    const token= req.cookies?.accessToken|| req.header("Authorization")?.replace("Bearer ","")
    if (!token) {
        throw new ApiError(401,"unauthorized access")
    }
    const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decodeToken?._id).select("-password -refreshToken")
    if (!user) {
        throw new ApiError(401,"user not found" )
    }
    req.user=user
    next()
   } catch (error) {
    throw new ApiError(401,"something went wrong")
   }
})