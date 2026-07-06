import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
import { url } from 'inspector';

 cloudinary.config({ 
        cloud_name: 'process.env.CLOUDINARY_CLOUD_NAME', 
        api_key: 'process.env.CLOUDINARY_API_KEY', 
        api_secret: 'process.env.CLOUDINARY_API_SECRET' 
    });

const uploadOnCloudinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudnary
        const respone = await cloudinary.uploader.upload
        (localFilePath , {
            resource_type : "auto"
        })
        // file has been uploaded successfully
        console.log("file is uploaded on cloudinary" , respone.url); 
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove locally saved temporily file as operation got failed
        return null;


    }
}