import dotenv from "dotenv";
import connectDB from "./db/DBindex.js"; // This is correct

dotenv.config({
    path: './env'
});

connectDB();
