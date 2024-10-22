import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key:process.env.API_KEY , 
    api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
});
const fileUploadOnCloudinary=async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        // uploading a file using file path
        const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        // file has been uploaded sucessfully 
       // console.log("file has been uploaded successfully",response.url);
       fs.unlinkSync(localFilePath)
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locally saved filed as process failed
        return null
    }
}
export { fileUploadOnCloudinary }