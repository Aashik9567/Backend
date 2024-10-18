import mongoose,{Schema,model} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema=new Schema({
    videoFile:{
        type:String,//cloudinary url
        required:[true,"video is required"],
    },
    thumbnail:{
        type:String,//cloudinary url
        required:[true,"thumbnail is required"],
    },
    title:{
        type:String,
        required:[true,"title is required"],
    },
    description:{
        type:String,
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
      type:Boolean,
      default:false
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

videoSchema.plugin(mongooseAggregatePaginate)
export const Video =model("Video",videoSchema)