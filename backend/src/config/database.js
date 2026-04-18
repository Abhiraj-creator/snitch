import mongoose from "mongoose";
import { Config } from "./config.js";



export const ConnectTODb = async () => {
    try {
        await mongoose.connect(Config.MONGO_URI)
        console.log('database connected');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}