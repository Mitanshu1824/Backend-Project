// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config();
console.log("URI:", process.env.MONGODB_URI);
import connectDB from "./db/index.js";

connectDB();

.then (() => {
    app.listen(process.env.PORT || 8000)
})
.catch((err)=> {
    console.log("Mongo db connection failed !!!" , () => {
        cosole.log(`Server is running at port : ${process.env.PORT}`);
    })
})


/*
import express from "express"
const app = express()

( async () => {
    try {
        mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error" , () => {
            console.log("ERR: " , error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.error("ERROR:" , error)
        throw error 
    }
}) () 
    
*/