import { asyncHandler } from "../utils/asyncHandler.js"

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
})

export { registerUser }