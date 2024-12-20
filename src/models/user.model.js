import mongoose,{Schema,model} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new Schema(
    {
      username:{
        required:true,
        type:String,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
      },
      email:{
        required:true,
        type:String,
        unique:true,
        lowercase:true,
        trim:true
      },
      fullName:{
        required:true,
        type:String,
        trim:true,
        index:true
      },
      avatar:{
        type:String,//cloudinary url
      },
      coverImage:{
        type:String,//cloudinary url
      },
      watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
      ],
      password:{
        type:String,
        required:[true,"password is required"]
      },
      refreshToken:String

    },{timestamps:true}
)
userSchema.pre("save",async function(next){
  if(!this.isModified("password")) return next()
  this.password=await bcrypt.hash(this.password,10)  
  next()

})
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAcessToken=function(){
  return jwt.sign(
    {
      _id:this._id,
      email:this.email,
      username:this.username,
      fullName:this.fullName
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }

  )
}
userSchema.methods.generateRefreshToken=function(){
  return jwt.sign(
    {
      _id:this._id, 
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}
export const User=model("User",userSchema)