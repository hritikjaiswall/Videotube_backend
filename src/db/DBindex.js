import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";
console.log("MongoDB URI:", typeof process.env.MONGO_URI);
console.log("NAME:", DB_NAME);
const URL = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
    } catch (err) {
        console.error("ERR:", err);
        process.exit(1);
    }
};
export default connectDB;
