// require('dotenv').config({path:"./env"})
import dotenv from "dotenv";

import ConnectDb from "./db/database.js";
dotenv.config({
    path:'./env'
})
ConnectDb().then(()=>{

    app.listen(process.env.PORT || 8000,()=>{
        console.log(`app is listening on port${process.env.PORT}`);
    }
)})
.catch((error)=>{
    console.log("mongodb connection failed ",error);
    
})








/** First approach to connect DB
;(async()=>{
    try {
        await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("not able to communicate",error);
            throw(error)
        app.listen(process.env.PORT,()=>{
            console.log(`app is listening on localhost:${process.env.PORT}`);
            
        })    
        })
    } catch (error) {
        console.error("ERROR message",error);
        throw(error)
    }
})()
 */