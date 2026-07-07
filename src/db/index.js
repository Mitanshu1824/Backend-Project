import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const buildMongoUri = () => {
    const baseUri = process.env.MONGODB_URI?.trim();

    if (!baseUri) {
        return `mongodb://127.0.0.1:27017/${DB_NAME}`;
    }

    if (baseUri.includes(`/${DB_NAME}`)) {
        return baseUri;
    }

    const normalizedBase = baseUri.endsWith("/") ? baseUri : `${baseUri}/`;
    return `${normalizedBase}${DB_NAME}`;
};

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(buildMongoUri());
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

export { buildMongoUri };
export default connectDB;