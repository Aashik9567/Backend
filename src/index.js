// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/database.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})



connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
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