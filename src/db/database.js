import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
 

const ConnectDb = async()=>{
    try {
       const connect= await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       console.log(`\n Mongodb connected successfully${connect.connection.host }`);
       
    } catch (error){
        console.log("mongodb error",error);
        process.exit(1)
    }
}
export default ConnectDb