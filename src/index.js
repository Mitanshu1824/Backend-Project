// require('dotenv').config({path: './env'})
import dotenv from "dotenv";
dotenv.config();
console.log("URI:", process.env.MONGODB_URI);
import connectDB from "./db/index.js";
import { app } from "./app.js";

// Chain .then() and .catch() to the connectDB() promise
connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT || 8000}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!!!", err);
        process.exit(1);
    });


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